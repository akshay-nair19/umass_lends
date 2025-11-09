/**
 * Date utility functions for calculating exact return deadlines
 */

/**
 * Calculate exact return datetime from borrow request data
 * @param {Object} request - Borrow request object
 * @returns {string|null} - ISO string of exact return datetime, or null if cannot calculate
 */
export function calculateExactReturnDeadline(request) {
  if (!request) {
    return null;
  }

  // Priority 1: If item was picked up, use the return_deadline_datetime calculated from picked_up_at
  // This is the most accurate as it's based on when the item was actually picked up
  if (request.picked_up_at && request.return_deadline_datetime) {
    try {
      const dbDateTime = request.return_deadline_datetime;
      
      // Handle both formats: "2024-11-09T23:00:00" (local) or "2024-11-10T04:00:00.000Z" (UTC)
      let localTimeString = dbDateTime;
      
      if (dbDateTime.includes('Z') || dbDateTime.match(/[+-]\d{2}:\d{2}$/)) {
        // It has timezone info - parse as UTC and extract local time components
        const utcDate = new Date(dbDateTime);
        const year = utcDate.getFullYear();
        const month = String(utcDate.getMonth() + 1).padStart(2, '0');
        const day = String(utcDate.getDate()).padStart(2, '0');
        const hour = String(utcDate.getHours()).padStart(2, '0');
        const minute = String(utcDate.getMinutes()).padStart(2, '0');
        const second = String(utcDate.getSeconds()).padStart(2, '0');
        localTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
      } else {
        // No timezone info - extract just the date/time part
        const match = dbDateTime.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
        if (match) {
          localTimeString = match[1];
        }
      }
      
      return localTimeString;
    } catch (e) {
      console.error('Error parsing return_deadline_datetime:', e);
    }
  }

  // Priority 2: If item was picked up but return_deadline_datetime is missing, calculate from picked_up_at + duration
  if (request.picked_up_at && !request.return_deadline_datetime) {
    try {
      // Parse picked_up_at (handle both UTC and local time formats)
      let pickedUpDate;
      if (request.picked_up_at.includes('Z') || request.picked_up_at.match(/[+-]\d{2}:\d{2}$/)) {
        pickedUpDate = new Date(request.picked_up_at);
      } else {
        const match = request.picked_up_at.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
        if (match) {
          const [, year, month, day, hour, minute, second] = match;
          pickedUpDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hour),
            parseInt(minute),
            parseInt(second || 0)
          );
        } else {
          pickedUpDate = new Date(request.picked_up_at);
        }
      }
      
      // Add duration components
      const returnDateTime = new Date(pickedUpDate);
      const hours = request.borrow_duration_hours || 0;
      const minutes = request.borrow_duration_minutes || 0;
      
      returnDateTime.setHours(returnDateTime.getHours() + hours);
      returnDateTime.setMinutes(returnDateTime.getMinutes() + minutes);
      
      // Format as local time string
      const endYear = returnDateTime.getFullYear();
      const endMonth = String(returnDateTime.getMonth() + 1).padStart(2, '0');
      const endDay = String(returnDateTime.getDate()).padStart(2, '0');
      const endHour = String(returnDateTime.getHours()).padStart(2, '0');
      const endMinute = String(returnDateTime.getMinutes()).padStart(2, '0');
      const endSecond = String(returnDateTime.getSeconds()).padStart(2, '0');
      
      return `${endYear}-${endMonth}-${endDay}T${endHour}:${endMinute}:${endSecond}`;
    } catch (e) {
      console.error('Error calculating return deadline from picked_up_at:', e);
    }
  }

  // Priority 3: If exact datetime is stored in database (for backward compatibility), use it
  if (request.return_deadline_datetime) {
    try {
      const dbDateTime = request.return_deadline_datetime;
      
      // Supabase/PostgreSQL may return TIMESTAMP as ISO string with or without timezone
      // We stored it as local time (YYYY-MM-DDTHH:mm:ss), but it might be returned as UTC (with Z)
      // We need to extract the local time components and return them as a local time string
      
      // Handle both formats: "2024-11-09T23:00:00" (local) or "2024-11-10T04:00:00.000Z" (UTC)
      // If it has timezone info, we need to convert it back to local time
      let localTimeString = dbDateTime;
      
      if (dbDateTime.includes('Z') || dbDateTime.match(/[+-]\d{2}:\d{2}$/)) {
        // It has timezone info - parse as UTC and convert to local time
        // But wait - if we stored it as local time and Supabase converted it to UTC,
        // we need to convert it back to local time
        // Actually, the best approach is to parse it and extract the local time components
        const utcDate = new Date(dbDateTime);
        // Extract local time components (not UTC components)
        const year = utcDate.getFullYear();
        const month = String(utcDate.getMonth() + 1).padStart(2, '0');
        const day = String(utcDate.getDate()).padStart(2, '0');
        const hour = String(utcDate.getHours()).padStart(2, '0');
        const minute = String(utcDate.getMinutes()).padStart(2, '0');
        const second = String(utcDate.getSeconds()).padStart(2, '0');
        localTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
      } else {
        // No timezone info - it's already a local time string
        // Extract just the date/time part (ignore milliseconds if present)
        const match = dbDateTime.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
        if (match) {
          localTimeString = match[1];
        }
      }
      
      // Return as local time string (YYYY-MM-DDTHH:mm:ss) - countdown timer will parse it correctly
      return localTimeString;
    } catch (e) {
      console.error('Error parsing return_deadline_datetime:', e);
    }
  }

  // Priority 4: Calculate from start date + duration components (only if borrow_start_date exists)
  if (!request.borrow_start_date) {
    return null;
  }

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
    
    // Add months and days if available
    const months = request.borrow_duration_months !== undefined && request.borrow_duration_months !== null
      ? request.borrow_duration_months
      : 0;
    const days = request.borrow_duration_days !== undefined && request.borrow_duration_days !== null
      ? request.borrow_duration_days
      : 0;

    // Add duration components in order: months, days, hours, minutes
    // Always add hours and minutes if they are defined (even if 0) to ensure exact calculation
    if (months > 0) {
      returnDateTime.setMonth(returnDateTime.getMonth() + months);
    }
    if (days > 0) {
      returnDateTime.setDate(returnDateTime.getDate() + days);
    }
    // Always add hours and minutes (even if 0) to ensure we get the exact time
    returnDateTime.setHours(returnDateTime.getHours() + hours);
    returnDateTime.setMinutes(returnDateTime.getMinutes() + minutes);
    
    // Format as local time string (YYYY-MM-DDTHH:mm:ss) to avoid timezone conversion
    const endYear = returnDateTime.getFullYear();
    const endMonth = String(returnDateTime.getMonth() + 1).padStart(2, '0');
    const endDay = String(returnDateTime.getDate()).padStart(2, '0');
    const endHour = String(returnDateTime.getHours()).padStart(2, '0');
    const endMinute = String(returnDateTime.getMinutes()).padStart(2, '0');
    const endSecond = String(returnDateTime.getSeconds()).padStart(2, '0');
    
    return `${endYear}-${endMonth}-${endDay}T${endHour}:${endMinute}:${endSecond}`;
  } catch (e) {
    console.error('Error calculating return deadline from duration:', e);
  }

  // Fallback: use end of end date (for backward compatibility with old requests)
  if (request.borrow_end_date) {
    // Return as local time string to avoid timezone issues
    return request.borrow_end_date + 'T23:59:59';
  }

  return null;
}

