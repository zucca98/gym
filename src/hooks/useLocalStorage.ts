import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with React state
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      const parsed = JSON.parse(item);
      
      // Handle Date objects in the data
      if (Array.isArray(parsed)) {
        return parsed.map(item => ({
          ...item,
          ...(item.createdAt && { createdAt: new Date(item.createdAt) }),
          ...(item.updatedAt && { updatedAt: new Date(item.updatedAt) }),
          ...(item.date && { date: new Date(item.date) }),
          ...(item.deadline && { deadline: new Date(item.deadline) }),
        })) as T;
      } else if (parsed && typeof parsed === 'object') {
        return {
          ...parsed,
          ...(parsed.createdAt && { createdAt: new Date(parsed.createdAt) }),
          ...(parsed.updatedAt && { updatedAt: new Date(parsed.updatedAt) }),
          ...(parsed.date && { date: new Date(parsed.date) }),
          ...(parsed.deadline && { deadline: new Date(parsed.deadline) }),
        } as T;
      }
      
      return parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook for managing app-wide settings
 */
export function useAppSettings() {
  const [settings, setSettings] = useLocalStorage('crossfit-app-settings', {
    notifications: true,
    soundEnabled: true,
    autoSaveWorkouts: true,
    defaultTimerDuration: 180,
    preferredUnits: 'metric' as 'metric' | 'imperial',
    theme: 'system' as 'light' | 'dark' | 'system',
  });

  const updateSetting = <K extends keyof typeof settings,>(
    key: K,
    value: typeof settings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
}
