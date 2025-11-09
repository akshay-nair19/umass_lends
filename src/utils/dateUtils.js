/**
 * Date utility functions for calculating exact return deadlines
 * All times are displayed in EST/EDT (America/New_York timezone)
 */

// EST timezone constant
const EST_TIMEZONE = 'America/New_York';

/**
 * Format a date/time string to EST/EDT timezone
 * @param {string|Date} date - Date string or Date object
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string in EST
 */
export function formatDateEST(date, options = {}) {
  if (!date) return '';
  
  try {
    // Parse the date - handle both Date objects and strings
    let dateObj;
    if (typeof date === 'string') {
      // If it's a string, create a Date object
      // JavaScript Date constructor handles ISO strings with timezone info correctly
      dateObj = new Date(date);
      
      // Validate the date
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date string:', date);
        return '';
      }
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      console.error('Invalid date type:', typeof date);
      return '';
    }
    
    // Default options for date formatting with EST timezone
    const defaultOptions = {
      timeZone: EST_TIMEZONE,
      ...options
    };
    
    // Use Intl.DateTimeFormat to format in EST timezone
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return '';
  }
}

/**
 * Parse a timestamp string and ensure it's treated as UTC
 * Supabase/PostgreSQL stores timestamps in UTC, but may return them without timezone info
 */
function parseAsUTC(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  
  // Remove any whitespace
  const cleaned = dateString.trim();
  
  // If it already has timezone info (Z or +HH:MM/-HH:MM), parse directly
  if (cleaned.endsWith('Z') || /[+-]\d{2}:?\d{2}$/.test(cleaned)) {
    return new Date(cleaned);
  }
  
  // If it's an ISO-like string (contains 'T'), treat as UTC by appending 'Z'
  if (cleaned.includes('T')) {
    // Ensure it ends with Z to indicate UTC
    const utcString = cleaned.endsWith('Z') ? cleaned : cleaned + 'Z';
    return new Date(utcString);
  }
  
  // Try parsing as-is (might be a date-only string)
  const parsed = new Date(cleaned);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  
  // Last resort: try adding Z
  return new Date(cleaned + 'Z');
}

/**
 * Format a time string in EST/EDT (HH:MM AM/PM)
 * @param {string|Date} date - Date string or Date object (UTC from database)
 * @returns {string} - Formatted time string in EST
 */
export function formatTimeEST(date) {
  if (!date) return '';
  
  try {
    let dateObj;
    
    if (typeof date === 'string') {
      // Supabase/PostgreSQL stores all TIMESTAMP values in UTC
      // Parse the string and ensure it's treated as UTC
      dateObj = parseAsUTC(date);
      
      if (!dateObj || isNaN(dateObj.getTime())) {
        console.error('Invalid date string:', date);
        return '';
      }
    } else if (date instanceof Date) {
      dateObj = date;
      if (isNaN(dateObj.getTime())) {
        return '';
      }
    } else {
      return '';
    }
    
    // Format in EST timezone using Intl.DateTimeFormat
    // Intl.DateTimeFormat automatically converts from the Date's internal UTC representation to EST/EDT
    // The Date object stores time as milliseconds since epoch (UTC), so this conversion is accurate
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: EST_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    
    return formatter.format(dateObj);
  } catch (error) {
    console.error('Error formatting time to EST:', error, 'Date value:', date);
    return '';
  }
}

/**
 * Format a date string in EST/EDT (MM/DD/YYYY)
 * @param {string|Date} date - Date string or Date object
 * @returns {string} - Formatted date string
 */
export function formatDateOnlyEST(date) {
  return formatDateEST(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Format a full datetime string in EST/EDT
 * @param {string|Date} date - Date string or Date object
 * @returns {string} - Formatted datetime string
 */
export function formatDateTimeEST(date) {
  return formatDateEST(date, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get current date/time in EST/EDT
 * @returns {Date} - Current date in EST
 */
export function getCurrentDateEST() {
  const now = new Date();
  // Get the time in EST
  const estTimeString = now.toLocaleString('en-US', { timeZone: EST_TIMEZONE });
  return new Date(estTimeString);
}

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
        // It has timezone info - parse as UTC and convert to EST
        const utcDate = new Date(dbDateTime);
        // Convert to EST
        const estDateString = utcDate.toLocaleString('en-US', { timeZone: EST_TIMEZONE });
        const estDate = new Date(estDateString);
        const year = estDate.getFullYear();
        const month = String(estDate.getMonth() + 1).padStart(2, '0');
        const day = String(estDate.getDate()).padStart(2, '0');
        const hour = String(estDate.getHours()).padStart(2, '0');
        const minute = String(estDate.getMinutes()).padStart(2, '0');
        const second = String(estDate.getSeconds()).padStart(2, '0');
        localTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
      } else {
        // No timezone info - assume it's already in EST, extract just the date/time part
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
  if (request.picked_up_at) {
    try {
      let pickedUpDate;
      
      // Parse picked_up_at - handle both UTC and local time
      if (request.picked_up_at.includes('Z') || request.picked_up_at.match(/[+-]\d{2}:\d{2}$/)) {
        // It has timezone info - convert to EST
        const utcDate = new Date(request.picked_up_at);
        const estDateString = utcDate.toLocaleString('en-US', { timeZone: EST_TIMEZONE });
        pickedUpDate = new Date(estDateString);
      } else {
        // No timezone info - assume EST and parse directly
        pickedUpDate = new Date(request.picked_up_at);
      }
      
      // Get duration components
      const hours = request.borrow_duration_hours !== undefined && request.borrow_duration_hours !== null 
        ? request.borrow_duration_hours 
        : 0;
      const minutes = request.borrow_duration_minutes !== undefined && request.borrow_duration_minutes !== null
        ? request.borrow_duration_minutes
        : 0;
      const days = request.borrow_duration_days !== undefined && request.borrow_duration_days !== null
        ? request.borrow_duration_days
        : 0;
      const months = request.borrow_duration_months !== undefined && request.borrow_duration_months !== null
        ? request.borrow_duration_months
        : 0;
      
      // Calculate return datetime
      const returnDateTime = new Date(pickedUpDate);
      
      // Add duration components
      if (months > 0) {
        returnDateTime.setMonth(returnDateTime.getMonth() + months);
      }
      if (days > 0) {
        returnDateTime.setDate(returnDateTime.getDate() + days);
      }
      returnDateTime.setHours(returnDateTime.getHours() + hours);
      returnDateTime.setMinutes(returnDateTime.getMinutes() + minutes);
      
      // Format as EST time string
      const year = returnDateTime.getFullYear();
      const month = String(returnDateTime.getMonth() + 1).padStart(2, '0');
      const day = String(returnDateTime.getDate()).padStart(2, '0');
      const endHour = String(returnDateTime.getHours()).padStart(2, '0');
      const endMinute = String(returnDateTime.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${endHour}:${endMinute}:00`;
    } catch (e) {
      console.error('Error calculating return deadline from picked_up_at:', e);
    }
  }

  // Priority 3: Calculate from borrow_start_date + duration (fallback if item not picked up yet)
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
    
    // Create start datetime in EST timezone
    // Use a date string that represents EST time
    const estDateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`;
    const startDateTime = new Date(estDateString);
    
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
    
    // Format as EST time string (YYYY-MM-DDTHH:mm:ss) 
    const returnYear = returnDateTime.getFullYear();
    const returnMonth = String(returnDateTime.getMonth() + 1).padStart(2, '0');
    const returnDay = String(returnDateTime.getDate()).padStart(2, '0');
    const endHour = String(returnDateTime.getHours()).padStart(2, '0');
    const endMinute = String(returnDateTime.getMinutes()).padStart(2, '0');
    const endSecond = String(returnDateTime.getSeconds()).padStart(2, '0');
    
    return `${returnYear}-${returnMonth}-${returnDay}T${endHour}:${endMinute}:${endSecond}`;
  } catch (e) {
    console.error('Error calculating return deadline from start date:', e);
    return null;
  }
}

/**
 * Parse a database datetime string and convert to EST
 * @param {string} dbDateTime - Database datetime string
 * @returns {string} - EST datetime string
 */
export function parseDateTimeToEST(dbDateTime) {
  if (!dbDateTime) return '';
  
  try {
    if (dbDateTime.includes('Z') || dbDateTime.match(/[+-]\d{2}:\d{2}$/)) {
      // It has timezone info - convert to EST
      const utcDate = new Date(dbDateTime);
      const estDateString = utcDate.toLocaleString('en-US', { timeZone: EST_TIMEZONE });
      const estDate = new Date(estDateString);
      const year = estDate.getFullYear();
      const month = String(estDate.getMonth() + 1).padStart(2, '0');
      const day = String(estDate.getDate()).padStart(2, '0');
      const hour = String(estDate.getHours()).padStart(2, '0');
      const minute = String(estDate.getMinutes()).padStart(2, '0');
      const second = String(estDate.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    } else {
      // No timezone info - assume it's already in EST
      const match = dbDateTime.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
      if (match) {
        return match[1];
      }
      return dbDateTime;
    }
  } catch (e) {
    console.error('Error parsing datetime to EST:', e);
    return dbDateTime;
  }
}
