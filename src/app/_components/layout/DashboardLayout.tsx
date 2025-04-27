"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hovered, setHovered] = useState(false);

  const sidebarExpanded = sidebarOpen || hovered;

  return (
    <div className="flex h-screen overflow-hidden"> 
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative z-50 flex flex-col bg-gray-900
          transition-all duration-300 ease-in-out
          ${sidebarExpanded ? "w-64" : "w-16"}
        `}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          isCollapsed={!sidebarExpanded}
        />
 
        {!sidebarOpen && !hovered && (
          <div
            className="absolute top-4 right-[-12px] cursor-pointer bg-white rounded-full p-1 shadow-md"
            onClick={() => setSidebarOpen(true)}
          >
            <div className="h-6 w-1 bg-gray-400 rounded" />
          </div>
        )}
      </div>
 
      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-40">
          <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
        </div>
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
