/**
 * Countdown Timer Component
 * Displays a live countdown until a target date/time
 */

import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endDate, label = 'Time remaining' }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    if (!endDate) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      
      // Parse endDate - handle both UTC (with Z) and local time (without Z)
      let endTime;
      if (endDate.includes('Z') || endDate.match(/[+-]\d{2}:\d{2}$/)) {
        // It's UTC or has timezone offset
        endTime = new Date(endDate).getTime();
      } else {
        // It's a local time string (YYYY-MM-DDTHH:mm:ss)
        // Parse it as local time to avoid timezone conversion
        const match = endDate.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
        if (match) {
          const [, year, month, day, hour, minute, second] = match;
          // Create Date object using local time constructor
          const localEndDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hour),
            parseInt(minute),
            parseInt(second || 0)
          );
          endTime = localEndDate.getTime();
        } else {
          // Fallback: try parsing as-is
          endTime = new Date(endDate).getTime();
        }
      }
      
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        expired: false,
      });
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  if (!endDate) {
    return null;
  }

  if (timeRemaining.expired) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm font-semibold">
        ⏰ Return deadline has passed
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <p className="text-xs text-gray-600 mb-2 font-medium">{label}:</p>
      <div className="flex gap-2 items-center">
        {timeRemaining.days > 0 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-umass-maroon">{timeRemaining.days}</div>
            <div className="text-xs text-gray-600">day{timeRemaining.days !== 1 ? 's' : ''}</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-2xl font-bold text-umass-maroon">{String(timeRemaining.hours).padStart(2, '0')}</div>
          <div className="text-xs text-gray-600">hour{timeRemaining.hours !== 1 ? 's' : ''}</div>
        </div>
        <div className="text-gray-400">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-umass-maroon">{String(timeRemaining.minutes).padStart(2, '0')}</div>
          <div className="text-xs text-gray-600">min</div>
        </div>
        <div className="text-gray-400">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-umass-maroon">{String(timeRemaining.seconds).padStart(2, '0')}</div>
          <div className="text-xs text-gray-600">sec</div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Return by: {(() => {
          // Parse endDate for display - handle both UTC and local time
          let displayDate;
          if (endDate.includes('Z') || endDate.match(/[+-]\d{2}:\d{2}$/)) {
            // It's UTC or has timezone offset
            displayDate = new Date(endDate);
          } else {
            // It's a local time string - parse as local time
            const match = endDate.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
            if (match) {
              const [, year, month, day, hour, minute, second] = match;
              displayDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hour),
                parseInt(minute),
                parseInt(second || 0)
              );
            } else {
              displayDate = new Date(endDate);
            }
          }
          return displayDate.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
        })()}
      </p>
    </div>
  );
};

export default CountdownTimer;

