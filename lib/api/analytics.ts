import { supabase } from '@/lib/supabase';
import type { AnalyticsDaily, QueueEntry } from '@/lib/supabase';

export async function getBranchDashboardStats(branchId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's queue entries
  const { data: todayEntries, error: entriesError } = await supabase
    .from('queue_entries')
    .select('*')
    .eq('branch_id', branchId)
    .gte('joined_at', `${today}T00:00:00`)
    .lt('joined_at', `${today}T23:59:59`);

  if (entriesError) {
    console.error('Error fetching today entries:', entriesError);
    return null;
  }

  // Get current queue count
  const { data: currentQueue, error: queueError } = await supabase
    .from('queue_entries')
    .select('*')
    .eq('branch_id', branchId)
    .eq('status', 'waiting');

  if (queueError) {
    console.error('Error fetching current queue:', queueError);
    return null;
  }

  // Calculate statistics
  const totalCustomers = todayEntries.length;
  const currentQueueCount = currentQueue.length;
  const completedToday = todayEntries.filter(entry => 
    entry.status === 'served' || entry.status === 'completed'
  ).length;
  
  // Calculate average wait time for completed services
  const completedEntries = todayEntries.filter(entry => 
    entry.actual_wait_time && (entry.status === 'served' || entry.status === 'completed')
  );
  
  const averageWaitTime = completedEntries.length > 0
    ? Math.round(completedEntries.reduce((sum, entry) => sum + (entry.actual_wait_time || 0), 0) / completedEntries.length)
    : 0;

  // Find peak hour
  const hourCounts: Record<string, number> = {};
  todayEntries.forEach(entry => {
    const hour = new Date(entry.joined_at).getHours();
    const hourKey = `${hour.toString().padStart(2, '0')}:00`;
    hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1;
  });
  
  const peakHour = Object.entries(hourCounts).reduce((peak, [hour, count]) => 
    count > peak.count ? { hour, count } : peak, 
    { hour: '09:00', count: 0 }
  ).hour;

  return {
    totalCustomers,
    currentQueue: currentQueueCount,
    averageWaitTime,
    completedToday,
    peakHour,
    efficiency: totalCustomers > 0 ? Math.round((completedToday / totalCustomers) * 100) : 0
  };
}

export async function getBranchRecentActivity(branchId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('queue_entries')
    .select(`
      *,
      user:profiles(first_name, last_name)
    `)
    .eq('branch_id', branchId)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }

  return data.map(entry => ({
    id: entry.id,
    customer: `${entry.user?.first_name} ${entry.user?.last_name?.charAt(0)}.`,
    action: getActionText(entry.status),
    time: getRelativeTime(entry.updated_at),
    position: entry.status === 'waiting' ? entry.queue_number : null
  }));
}

export async function getTodayAppointments(branchId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      user:profiles(first_name, last_name)
    `)
    .eq('branch_id', branchId)
    .eq('appointment_date', today)
    .order('appointment_time');

  if (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }

  return data.map(appointment => ({
    id: appointment.id,
    customer: `${appointment.user?.first_name} ${appointment.user?.last_name?.charAt(0)}.`,
    service: appointment.service_type,
    time: appointment.appointment_time,
    status: appointment.status
  }));
}

export async function getWeeklyAnalytics(branchId: string) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);

  const { data, error } = await supabase
    .from('analytics_daily')
    .select('*')
    .eq('branch_id', branchId)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date');

  if (error) {
    console.error('Error fetching weekly analytics:', error);
    return [];
  }

  return data as AnalyticsDaily[];
}

export async function updateDailyAnalytics(branchId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's queue entries
  const { data: todayEntries } = await supabase
    .from('queue_entries')
    .select('*')
    .eq('branch_id', branchId)
    .gte('joined_at', `${today}T00:00:00`)
    .lt('joined_at', `${today}T23:59:59`);

  if (!todayEntries) return null;

  const totalCustomers = todayEntries.length;
  const completedServices = todayEntries.filter(entry => entry.status === 'served').length;
  const cancelledServices = todayEntries.filter(entry => entry.status === 'cancelled').length;
  const noShows = todayEntries.filter(entry => entry.status === 'no_show').length;
  
  const completedEntries = todayEntries.filter(entry => entry.actual_wait_time);
  const averageWaitTime = completedEntries.length > 0
    ? completedEntries.reduce((sum, entry) => sum + (entry.actual_wait_time || 0), 0) / completedEntries.length
    : 0;

  // Find peak hour
  const hourCounts: Record<number, number> = {};
  todayEntries.forEach(entry => {
    const hour = new Date(entry.joined_at).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  const peakHour = Object.entries(hourCounts).reduce((peak, [hour, count]) => 
    Number(count) > peak.count ? { hour: Number(hour), count: Number(count) } : peak, 
    { hour: 9, count: 0 }
  ).hour;

  const { data, error } = await supabase
    .from('analytics_daily')
    .upsert({
      branch_id: branchId,
      date: today,
      total_customers: totalCustomers,
      completed_services: completedServices,
      cancelled_services: cancelledServices,
      no_shows: noShows,
      average_wait_time: averageWaitTime,
      peak_hour: `${peakHour.toString().padStart(2, '0')}:00:00`,
      customer_satisfaction: 0 // This would come from feedback system
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating daily analytics:', error);
    return null;
  }

  return data as AnalyticsDaily;
}

function getActionText(status: string): string {
  switch (status) {
    case 'waiting': return 'Joined queue';
    case 'called': return 'Called to service';
    case 'served': return 'Completed service';
    case 'cancelled': return 'Left queue';
    case 'no_show': return 'No show';
    default: return 'Unknown action';
  }
}

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}