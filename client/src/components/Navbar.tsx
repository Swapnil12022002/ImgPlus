"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleMode = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  if (!mounted) return null;
  return (
    <header>
      <nav className="items-center pt-5 px-4 mx-auto max-w-screen-xl sm:px-8 sm:flex sm:space-x-6">
        <a href="/" className="text-[24px] font-bold">
          IMGPLUS
        </a>
        <ul className="py-4 flex-1 items-center flex space-x-3 sm:space-x-6 sm:justify-end">
          <li className="dark:text-white cursor-pointer" onClick={toggleMode}>
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </li>
        </ul>
      </nav>
    </header>
  );
}
