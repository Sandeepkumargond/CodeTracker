"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiUsers, FiMenu } from "react-icons/fi";
import DarkModeToggle from "../components/UI/DarkModeToggle";
import "./globals.css";

const navItems = [
  { name: "Dashboard", href: "/", icon: <FiGrid /> },
  { name: "Students", href: "/students", icon: <FiUsers /> },
];

export default function RootLayout({ children }) {
  const [savedTheme, setSavedTheme] = useState("light");
  const pathname = usePathname();

  useEffect(() => {
    const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
    setSavedTheme(theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const themeClasses =
    savedTheme === "dark" ? "bg-black text-white" : "bg-white text-black";

  return (
    <html lang="en" className={savedTheme === "dark" ? "dark" : ""}>
      <body
        className={`transition-colors duration-300 min-h-screen flex flex-col ${themeClasses}`}
      >
        <header className={`w-full shadow ${themeClasses}`}>
          <div className="w-full mx-auto px-4 md:px-10 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left - Title and Mobile Menu Button */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="flex items-center gap-2">
                <button className="md:hidden text-2xl">
                  <FiMenu />
                </button>
                <Link href="/" passHref>
                  <h1 className="text-xl font-bold cursor-pointer hover:text-blue-500 transition-colors">
                    Student Management System
                  </h1>
                </Link>
              </div>
            </div>

            {/* Center - Navigation */}
            <nav className="flex gap-4 flex-wrap justify-center items-center">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : savedTheme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right - Dark Mode Toggle */}
            <div className="flex justify-end">
              <DarkModeToggle />
            </div>
          </div>
        </header>

        <main
          className={`flex-1 p-6 overflow-auto ${themeClasses}`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
