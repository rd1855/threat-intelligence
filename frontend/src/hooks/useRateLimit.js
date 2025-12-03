import { useState, useEffect, useCallback } from 'react';

export const useRateLimit = () => {
  const [scanCount, setScanCount] = useState(0);
  const [lastScanTime, setLastScanTime] = useState(null);
  const [resetTimers, setResetTimers] = useState([]);

  useEffect(() => {
    const savedCount = localStorage.getItem('scanCount');
    const savedTime = localStorage.getItem('lastScanTime');
    
    if (savedCount) setScanCount(parseInt(savedCount, 10));
    if (savedTime) setLastScanTime(new Date(savedTime));
    
    // Cleanup timers on unmount
    return () => {
      resetTimers.forEach(timer => clearTimeout(timer));
    };
  }, [resetTimers]); // Added resetTimers to dependencies

  const updateScanCount = useCallback(() => {
    const newCount = scanCount + 1;
    const now = new Date();
    
    setScanCount(newCount);
    setLastScanTime(now);
    
    localStorage.setItem('scanCount', newCount.toString());
    localStorage.setItem('lastScanTime', now.toISOString());
    
    // Set timer to decrement count after 1 minute
    const timer = setTimeout(() => {
      setScanCount(prev => {
        const updated = Math.max(0, prev - 1);
        localStorage.setItem('scanCount', updated.toString());
        return updated;
      });
      
      // Remove timer from tracking
      setResetTimers(prev => prev.filter(t => t !== timer));
    }, 60000);
    
    setResetTimers(prev => [...prev, timer]);
    
    // Clean up old timers
    const currentTimers = resetTimers.filter(timer => timer._idleTimeout > 0);
    if (currentTimers.length > 5) {
      const oldestTimer = currentTimers[0];
      clearTimeout(oldestTimer);
      setResetTimers(prev => prev.filter(t => t !== oldestTimer));
    }
  }, [scanCount, resetTimers]);

  const resetCounter = useCallback(() => {
    setScanCount(0);
    setLastScanTime(null);
    
    // Clear all timers
    resetTimers.forEach(timer => clearTimeout(timer));
    setResetTimers([]);
    
    localStorage.removeItem('scanCount');
    localStorage.removeItem('lastScanTime');
  }, [resetTimers]);

  const checkRateLimit = useCallback(() => {
    const MAX_SCANS_PER_MINUTE = 5;
    
    if (lastScanTime) {
      const timeSinceLastScan = new Date() - lastScanTime;
      if (timeSinceLastScan < 60000 && scanCount >= MAX_SCANS_PER_MINUTE) {
        const secondsLeft = Math.ceil((60000 - timeSinceLastScan) / 1000);
        return {
          allowed: false,
          secondsLeft,
          error: `Rate limit exceeded. Please wait ${secondsLeft} seconds`
        };
      }
    }
    return { allowed: true };
  }, [scanCount, lastScanTime]);

  return {
    scanCount,
    lastScanTime,
    updateScanCount,
    resetCounter,
    checkRateLimit
  };
};