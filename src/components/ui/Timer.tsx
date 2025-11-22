"use client"
import { useEffect, useState } from "react";

export default function Timer() {

  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const now = new Date();

    const daysUntilSunday = (7 - now.getUTCDay()) % 7;

    const isSundayBefore18UTC = now.getUTCDay() === 0 && now.getUTCHours() < 18;

    const deadline = new Date(now);
    if (!isSundayBefore18UTC) {
      deadline.setUTCDate(deadline.getUTCDate() + daysUntilSunday);
    }
    deadline.setUTCHours(18, 0, 0, 0);

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
