import { supabase } from '@/utils/supabase/client';

export interface QueueEntry {
  id: string;
  user_id: string;
  institution_id: string;
  branch_id: string;
  queue_number: number;
  priority_type: 'normal' | 'elderly' | 'pregnant' | 'premium' | 'disability';
  service_type?: string;
  status: 'waiting' | 'called' | 'served' | 'cancelled' | 'no_show';
  estimated_wait_time: number;
  actual_wait_time?: number;
  joined_at: string;
  called_at?: string;
  served_at?: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: any;
  institution?: any;
  branch?: any;
}

export async function joinQueue(
  userId: string,
  institutionId: string,
  branchId: string,
  serviceType?: string,
  priorityType: 'normal' | 'elderly' | 'pregnant' | 'premium' | 'disability' = 'normal'
) {
  try {
    // Get the next queue number
    const { data: lastEntry, error: lastEntryError } = await supabase
      .from('queue_entries')
      .select('queue_number')
      .eq('branch_id', branchId)
      .eq('status', 'waiting')
      .order('queue_number', { ascending: false })
      .limit(1);

    if (lastEntryError) {
      console.error('Error fetching last entry:', lastEntryError);
    }

    const nextQueueNumber = lastEntry && lastEntry.length > 0 ? lastEntry[0].queue_number + 1 : 1;

    // Calculate estimated wait time based on queue position and average service time
    const { data: branch } = await supabase
      .from('branches')
      .select('average_service_time')
      .eq('id', branchId)
      .single();

    const averageServiceTime = branch?.average_service_time || 15;
    const estimatedWaitTime = (nextQueueNumber - 1) * averageServiceTime;

    const { data, error } = await supabase
      .from('queue_entries')
      .insert({
        user_id: userId,
        institution_id: institutionId,
        branch_id: branchId,
        queue_number: nextQueueNumber,
        priority_type: priorityType,
        service_type: serviceType,
        estimated_wait_time: estimatedWaitTime,
      })
      .select(`
        *,
        user:profiles(*),
        institution:institutions(*),
        branch:branches(*)
      `)
      .single();

    if (error) {
      console.error('Error joining queue:', error);
      return null;
    }

    return data as QueueEntry;
  } catch (error) {
    console.error('Unexpected error joining queue:', error);
    return null;
  }
}

export async function leaveQueue(queueEntryId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('queue_entries')
      .update({ 
        status: 'cancelled',
        completed_at: new Date().toISOString()
      })
      .eq('id', queueEntryId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error leaving queue:', error);
      return null;
    }

    return data as QueueEntry;
  } catch (error) {
    console.error('Unexpected error leaving queue:', error);
    return null;
  }
}

export async function getUserActiveQueues(userId: string) {
  try {
    const { data, error } = await supabase
      .from('queue_entries')
      .select(`
        *,
        institution:institutions(*),
        branch:branches(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'waiting')
      .order('joined_at', { ascending: false });

    if (error) {
      console.error('Error fetching user queues:', error);
      return [];
    }

    return data as QueueEntry[];
  } catch (error) {
    console.error('Unexpected error fetching user queues:', error);
    return [];
  }
}

export async function getBranchQueue(branchId: string) {
  try {
    const { data, error } = await supabase
      .from('queue_entries')
      .select(`
        *,
        user:profiles(first_name, last_name, phone, priority_type)
      `)
      .eq('branch_id', branchId)
      .eq('status', 'waiting')
      .order('queue_number');

    if (error) {
      console.error('Error fetching branch queue:', error);
      return [];
    }

    return data as QueueEntry[];
  } catch (error) {
    console.error('Unexpected error fetching branch queue:', error);
    return [];
  }
}

export async function callNextCustomer(branchId: string) {
  try {
    // Get the next customer in queue
    const { data: nextCustomer, error: fetchError } = await supabase
      .from('queue_entries')
      .select(`
        *,
        user:profiles(first_name, last_name, phone)
      `)
      .eq('branch_id', branchId)
      .eq('status', 'waiting')
      .order('queue_number')
      .limit(1);

    if (fetchError || !nextCustomer || nextCustomer.length === 0) {
      console.error('Error fetching next customer:', fetchError);
      return null;
    }

    // Update the customer status to 'called'
    const { data, error } = await supabase
      .from('queue_entries')
      .update({ 
        status: 'called',
        called_at: new Date().toISOString()
      })
      .eq('id', nextCustomer[0].id)
      .select(`
        *,
        user:profiles(first_name, last_name, phone)
      `)
      .single();

    if (error) {
      console.error('Error calling next customer:', error);
      return null;
    }

    return data as QueueEntry;
  } catch (error) {
    console.error('Unexpected error calling next customer:', error);
    return null;
  }
}

export async function markCustomerServed(queueEntryId: string) {
  try {
    const { data, error } = await supabase
      .from('queue_entries')
      .update({ 
        status: 'served',
        served_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      })
      .eq('id', queueEntryId)
      .select()
      .single();

    if (error) {
      console.error('Error marking customer as served:', error);
      return null;
    }

    return data as QueueEntry;
  } catch (error) {
    console.error('Unexpected error marking customer as served:', error);
    return null;
  }
}

export async function markCustomerNoShow(queueEntryId: string) {
  try {
    const { data, error } = await supabase
      .from('queue_entries')
      .update({ 
        status: 'no_show',
        completed_at: new Date().toISOString()
      })
      .eq('id', queueEntryId)
      .select()
      .single();

    if (error) {
      console.error('Error marking customer as no show:', error);
      return null;
    }

    return data as QueueEntry;
  } catch (error) {
    console.error('Unexpected error marking customer as no show:', error);
    return null;
  }
}

export async function getQueuePosition(queueEntryId: string) {
  try {
    const { data: queueEntry } = await supabase
      .from('queue_entries')
      .select('queue_number, branch_id')
      .eq('id', queueEntryId)
      .single();

    if (!queueEntry) return null;

    const { data, error } = await supabase
      .from('queue_entries')
      .select('id')
      .eq('branch_id', queueEntry.branch_id)
      .eq('status', 'waiting')
      .lt('queue_number', queueEntry.queue_number);

    if (error) {
      console.error('Error getting queue position:', error);
      return null;
    }

    return data.length + 1; // Position in queue (1-indexed)
  } catch (error) {
    console.error('Unexpected error getting queue position:', error);
    return null;
  }
}