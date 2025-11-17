"use client";

import { useEffect, useState } from "react";
import Ripple from "@/src/components/Ripple";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    if (savedTheme) {
      setTheme(savedTheme);
      updateBodyClass(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      updateBodyClass(initialTheme);
    }
  }, []);

  const updateBodyClass = (theme: "light" | "dark") => {
    const body = document.body;
    if (theme === "dark") {
      body.classList.add("dark");
      body.classList.remove("light");
    } else {
      body.classList.add("light");
      body.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    updateBodyClass(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Ripple handleOnClick={ toggleTheme } opt="outline" icon={theme === "dark" ? "bx bx-sun-dim" : "bx bx-moon"}></Ripple>
  );
}