// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { FiGrid, FiUsers } from "react-icons/fi";

// const navItems = [
//   { name: "Dashboard", href: "/", icon: <FiGrid /> },
//   { name: "Students", href: "/students", icon: <FiUsers /> },
// ];

// export default function Sidebar({ isOpen, onClose }) {
//   const pathname = usePathname();
//   const [theme, setTheme] = useState("0"); // "0" = light, "1" = dark

//   useEffect(() => {
//     const stored = localStorage.getItem("theme");
//     setTheme(stored || "0");
//   }, []);

//   return (
//     <aside
//       className={`fixed md:static top-0 left-0 min-h-screen w-64 z-50 transform
//         ${theme === "1" ? "bg-black text-white" : "bg-white text-black"}
//         p-6 border-r border-gray-200 dark:border-gray-700
//         overflow-y-auto transition-transform duration-300
//         ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
//     >
//       <div className="md:hidden flex justify-end mb-4">
//         <button onClick={onClose} className="text-xl font-bold">
//           ✕
//         </button>
//       </div>

//       <h2 className="text-2xl font-semibold mb-8">Navigation</h2>

//       <nav className="flex flex-col gap-2">
//         {navItems.map((item) => {
//           const isActive = pathname === item.href;
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors ${
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : theme === "1"
//                   ? "hover:bg-gray-800"
//                   : "hover:bg-gray-200"
//               }`}
//               onClick={onClose}
//             >
//               <span className="text-xl">{item.icon}</span>
//               {item.name}
//             </Link>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }