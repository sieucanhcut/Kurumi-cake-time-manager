import { useEffect } from "react";

export default function useLocalStorage(key, value) {
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
}