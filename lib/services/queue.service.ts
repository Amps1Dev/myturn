// lib/services/queue.service.ts
import { supabase } from '@/lib/supabase';
import type { QueueEntry, QueueStatus, PriorityType } from '@/lib/supabase';

export class QueueService {
  /**
   * Join a queue
   */
  static async joinQueue(data: {
    institutionId: string;
    branchId: string;
    serviceType?: string;
    priorityType?: PriorityType;
  }): Promise<QueueEntry | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current queue number
      const { data: lastEntry } = await supabase
        .from('queue_entries')
        .select('queue_number')
        .eq('branch_id', data.branchId)
        .order('queue_number', { ascending: false })
        .limit(1)
        .single();

      const queueNumber = (lastEntry?.queue_number || 0) + 1;

      // Get user profile for priority type
      const { data: profile } = await supabase
        .from('profiles')
        .select('priority_type')
        .eq('id', user.id)
        .single();

      // Calculate estimated wait time
      const { data: branch } = await supabase
        .from('branches')
        .select('average_service_time')
        .eq('id', data.branchId)
        .single();

      const { count } = await supabase
        .from('queue_entries')
        .select('*', { count: 'exact', head: true })
        .eq('branch_id', data.branchId)
        .eq('status', 'waiting');

      const estimatedWaitTime = (count || 0) * (branch?.average_service_time || 15);

      // Create queue entry
      const { data: queueEntry, error } = await supabase
        .from('queue_entries')
        .insert({
          user_id: user.id,
          institution_id: data.institutionId,
          branch_id: data.branchId,
          queue_number: queueNumber,
          priority_type: data.priorityType || profile?.priority_type || 'normal',
          service_type: data.serviceType,
          status: 'waiting',
          estimated_wait_time: estimatedWaitTime,
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'queue_update',
        title: 'Queue Joined',
        message: `You're #${queueNumber} in the queue`,
        data: { queue_entry_id: queueEntry.id },
      });

      // Update institution queue count
      await this.updateInstitutionQueueCount(data.institutionId);

      return queueEntry;
    } catch (error) {
      console.error('Error joining queue:', error);
      return null;
    }
  }

  /**
   * Get user's active queues
   */
  static async getUserQueues(userId: string): Promise<QueueEntry[]> {
    try {
      const { data, error } = await supabase
        .from('queue_entries')
        .select(`
          *,
          institution:institutions(name, location, status),
          branch:branches(name, address)
        `)
        .eq('user_id', userId)
        .in('status', ['waiting', 'called'])
        .order('joined_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user queues:', error);
      return [];
    }
  }

  /**
   * Get branch queues (for company dashboard)
   */
  static async getBranchQueues(branchId: string): Promise<QueueEntry[]> {
    try {
      const { data, error } = await supabase
        .from('queue_entries')
        .select(`
          *,
          user:profiles(first_name, last_name, email, phone, priority_type)
        `)
        .eq('branch_id', branchId)
        .in('status', ['waiting', 'called'])
        .order('queue_number', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching branch queues:', error);
      return [];
    }
  }

  /**
   * Update queue status
   */
  static async updateQueueStatus(
    queueId: string,
    status: QueueStatus
  ): Promise<boolean> {
    try {
      // Get the queue entry first
      const { data: queueEntry } = await supabase
        .from('queue_entries')
        .select('*, institution_id, user_id, queue_number, joined_at')
        .eq('id', queueId)
        .single();

      if (!queueEntry) throw new Error('Queue entry not found');

      const updateData: any = { status };
      
      if (status === 'called') {
        updateData.called_at = new Date().toISOString();
      } else if (status === 'served') {
        updateData.served_at = new Date().toISOString();
        // Calculate actual wait time
        const joinedTime = new Date(queueEntry.joined_at).getTime();
        const servedTime = new Date().getTime();
        updateData.actual_wait_time = Math.round((servedTime - joinedTime) / (1000 * 60));
      } else if (status === 'cancelled' || status === 'no_show') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('queue_entries')
        .update(updateData)
        .eq('id', queueId);

      if (error) throw error;

      // Send notification to user
      let notificationMessage = '';
      if (status === 'called') {
        notificationMessage = `You're being called! Please proceed to the counter.`;
      } else if (status === 'served') {
        notificationMessage = `Service completed. Thank you for using MyTurn!`;
      } else if (status === 'cancelled') {
        notificationMessage = `Your queue has been cancelled.`;
      }

      if (notificationMessage) {
        await supabase.from('notifications').insert({
          user_id: queueEntry.user_id,
          type: 'queue_update',
          title: 'Queue Status Update',
          message: notificationMessage,
          data: { queue_entry_id: queueId, status },
        });
      }

      // Update institution queue count
      await this.updateInstitutionQueueCount(queueEntry.institution_id);

      return true;
    } catch (error) {
      console.error('Error updating queue status:', error);
      return false;
    }
  }

  /**
   * Cancel queue entry
   */
  static async cancelQueue(queueId: string): Promise<boolean> {
    return await this.updateQueueStatus(queueId, 'cancelled');
  }

  /**
   * Get queue statistics for branch
   */
  static async getBranchStats(branchId: string) {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get today's stats
      const { data: todayQueues } = await supabase
        .from('queue_entries')
        .select('status, actual_wait_time')
        .eq('branch_id', branchId)
        .gte('joined_at', `${today}T00:00:00`);

      const stats = {
        totalCustomers: todayQueues?.length || 0,
        currentQueue: todayQueues?.filter(q => q.status === 'waiting').length || 0,
        completedToday: todayQueues?.filter(q => q.status === 'served').length || 0,
        averageWaitTime: 0,
      };

      const completedWithTime = todayQueues?.filter(
        q => q.status === 'served' && q.actual_wait_time
      );
      
      if (completedWithTime && completedWithTime.length > 0) {
        const totalTime = completedWithTime.reduce(
          (sum, q) => sum + (q.actual_wait_time || 0),
          0
        );
        stats.averageWaitTime = Math.round(totalTime / completedWithTime.length);
      }

      return stats;
    } catch (error) {
      console.error('Error fetching branch stats:', error);
      return {
        totalCustomers: 0,
        currentQueue: 0,
        completedToday: 0,
        averageWaitTime: 0,
      };
    }
  }

  /**
   * Update institution queue count
   */
  private static async updateInstitutionQueueCount(institutionId: string) {
    try {
      const { count } = await supabase
        .from('queue_entries')
        .select('*', { count: 'exact', head: true })
        .eq('institution_id', institutionId)
        .eq('status', 'waiting');

      await supabase
        .from('institutions')
        .update({ current_queue_count: count || 0 })
        .eq('id', institutionId);
    } catch (error) {
      console.error('Error updating institution queue count:', error);
    }
  }

  /**
   * Get queue position
   */
  static async getQueuePosition(queueId: string): Promise<number | null> {
    try {
      const { data: currentEntry } = await supabase
        .from('queue_entries')
        .select('queue_number, branch_id')
        .eq('id', queueId)
        .single();

      if (!currentEntry) return null;

      const { count } = await supabase
        .from('queue_entries')
        .select('*', { count: 'exact', head: true })
        .eq('branch_id', currentEntry.branch_id)
        .eq('status', 'waiting')
        .lt('queue_number', currentEntry.queue_number);

      return (count || 0) + 1;
    } catch (error) {
      console.error('Error getting queue position:', error);
      return null;
    }
  }

  /**
   * Subscribe to queue updates (real-time)
   */
  static subscribeToQueueUpdates(
    branchId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`queue_${branchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue_entries',
          filter: `branch_id=eq.${branchId}`,
        },
        callback
      )
      .subscribe();
  }

  /**
   * Subscribe to user's queue updates
   */
  static subscribeToUserQueueUpdates(
    userId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`user_queue_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue_entries',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }

  /**
   * Call next customer in queue
   */
  static async callNextCustomer(branchId: string): Promise<QueueEntry | null> {
    try {
      // Get next waiting customer
      const { data: nextQueue } = await supabase
        .from('queue_entries')
        .select('*')
        .eq('branch_id', branchId)
        .eq('status', 'waiting')
        .order('queue_number', { ascending: true })
        .limit(1)
        .single();

      if (!nextQueue) return null;

      // Update status to called
      await this.updateQueueStatus(nextQueue.id, 'called');

      // Fetch updated entry
      const { data: updatedQueue } = await supabase
        .from('queue_entries')
        .select(`
          *,
          user:profiles(first_name, last_name, phone)
        `)
        .eq('id', nextQueue.id)
        .single();

      return updatedQueue;
    } catch (error) {
      console.error('Error calling next customer:', error);
      return null;
    }
  }
}