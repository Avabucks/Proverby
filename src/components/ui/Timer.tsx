"use client"
import { useEffect, useState } from "react";

export default function Timer() {

  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const now = new Date();

    // Calcola quanti giorni mancano alla prossima domenica
    const daysUntilSunday = (7 - now.getUTCDay()) % 7;

    // Imposta la domenica alle 23:59:59 UTC
    const deadline = new Date(now);
    deadline.setUTCDate(deadline.getUTCDate() + daysUntilSunday);
    deadline.setUTCHours(23, 59, 59, 999);

    function updateCountdown() {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const formatted =
        days +
        "g " +
        hours.toString().padStart(2, "0") +
        "h " +
        minutes.toString().padStart(2, "0") +
        "m " +
        seconds.toString().padStart(2, "0") +
        "s";

      setCountdown(formatted);
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {countdown}
    </>
  );
}
