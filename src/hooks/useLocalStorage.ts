import { useState } from "react";
import { ActiveTimer } from "../components/TimerCard";
import { Timer } from "../components/TimerContainer";

// Found this to be super useful https://usehooks.com/useLocalStorage/
export default function useLocalStorage(key : string, initialValue : Timer[] | number | ActiveTimer) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value: (a: Timer[] | number | ActiveTimer) => Timer[] | number | ActiveTimer) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};
