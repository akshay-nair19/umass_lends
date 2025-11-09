/**
 * Date utility functions for calculating exact return deadlines
 */

/**
 * Calculate exact return datetime from borrow request data
 * @param {Object} request - Borrow request object
 * @returns {string|null} - ISO string of exact return datetime, or null if cannot calculate
 */
export function calculateExactReturnDeadline(request) {
  if (!request || !request.borrow_start_date) {
    return null;
  }

  // If exact datetime is stored in database, use it (most accurate)
  if (request.return_deadline_datetime) {
    try {
      return new Date(request.return_deadline_datetime).toISOString();
    } catch (e) {
      console.error('Error parsing return_deadline_datetime:', e);
    }
  }

  // Calculate from start date + duration components
  try {
    const [year, month, day] = request.borrow_start_date.split('-').map(Number);
    
    // Parse start time (HH:MM:SS or HH:MM)
    const startTime = request.borrow_start_time || '00:00:00';
    const timeParts = startTime.split(':');
    const startHour = parseInt(timeParts[0]) || 0;
    const startMinute = parseInt(timeParts[1]) || 0;
    
    // Create start datetime in local timezone
    const startDateTime = new Date(year, month - 1, day, startHour, startMinute, 0, 0);
    
    // Add duration components
    const returnDateTime = new Date(startDateTime);
    
    // Add hours and minutes if available (these are the most important for exact timing)
    const hours = request.borrow_duration_hours !== undefined && request.borrow_duration_hours !== null 
      ? request.borrow_duration_hours 
      : 0;
    const minutes = request.borrow_duration_minutes !== undefined && request.borrow_duration_minutes !== null
      ? request.borrow_duration_minutes
      : 0;
    
    if (hours > 0 || minutes > 0) {
      returnDateTime.setHours(returnDateTime.getHours() + hours);
      returnDateTime.setMinutes(returnDateTime.getMinutes() + minutes);
      // Return exact datetime including hours and minutes
      return returnDateTime.toISOString();
    }
  } catch (e) {
    console.error('Error calculating return deadline from duration:', e);
  }

  // Fallback: use end of end date (for backward compatibility with old requests)
  if (request.borrow_end_date) {
    return new Date(request.borrow_end_date + 'T23:59:59').toISOString();
  }

  return null;
}

