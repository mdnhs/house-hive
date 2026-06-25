"use client";

import * as React from "react";
import Image from "next/image";
import { Home, Sun, Moon, Globe, Menu, User, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchPanel } from "@/features/search/components/SearchPanel";
import Link from "next/link";
import { motion } from "motion/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface HeaderProps {
  activeTab: "Flat" | "Interior";
  setActiveTab: (tab: "Flat" | "Interior") => void;
  searchParams: {
    location: string;
    budget?: string;
    bedrooms?: string;
    size?: string;
    spaceType?: string;
    designStyle?: string;
  };
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  isScrolled: boolean;
  isOverlaySearchOpen: boolean;
  setIsOverlaySearchOpen: (open: boolean) => void;
  activeCell: "location" | "budget" | "home" | "space" | "style" | null;
  setActiveCell: (cell: "location" | "budget" | "home" | "space" | "style" | null) => void;
  onSearch: (params: {
    type: "Flat" | "Interior";
    location: string;
    budget?: string;
    bedrooms?: string;
    size?: string;
    spaceType?: string;
    designStyle?: string;
  }) => void;
  onClearFilters: () => void;
  onTabChange: (tab: "Flat" | "Interior") => void;
}

export function Header({
  activeTab,
  setActiveTab,
  searchParams,
  darkMode,
  setDarkMode,
  isScrolled,
  isOverlaySearchOpen,
  setIsOverlaySearchOpen,
  activeCell,
  setActiveCell,
  onSearch,
  onClearFilters,
  onTabChange,
}: HeaderProps) {
  const isHeaderExpanded = !isScrolled || isOverlaySearchOpen;

  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = React.useState(false);
  const [leadsList, setLeadsList] = React.useState<any[]>([]);
  const [filterType, setFilterType] = React.useState<"All" | "Property" | "Interior">("All");
  const [filterStatus, setFilterStatus] = React.useState<string>("All");

  // Load leads from localStorage when dashboard opens
  React.useEffect(() => {
    if (isDashboardOpen) {
      const stored = JSON.parse(localStorage.getItem("house_hive_leads") || "[]");
      setLeadsList(stored);
    }
  }, [isDashboardOpen]);

  // Click outside listener for profile menu
  React.useEffect(() => {
    function handleClickOutsideMenu(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-menu-container")) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => document.removeEventListener("mousedown", handleClickOutsideMenu);
  }, []);

  // Update lead status in localStorage
  const handleUpdateStatus = (leadId: string, newStatus: string) => {
    const updated = leadsList.map((lead) =>
      lead.leadId === leadId ? { ...lead, status: newStatus } : lead
    );
    setLeadsList(updated);
    localStorage.setItem("house_hive_leads", JSON.stringify(updated));
  };

  // Clear leads database helper
  const handleClearLeads = () => {
    if (confirm("Are you sure you want to delete all leads?")) {
      localStorage.removeItem("house_hive_leads");
      setLeadsList([]);
    }
  };

  const filteredLeads = React.useMemo(() => {
    return leadsList.filter((lead) => {
      const typeMatch = filterType === "All" ? true : lead.type === filterType;
      const statusMatch = filterStatus === "All" ? true : lead.status === filterStatus;
      return typeMatch && statusMatch;
    });
  }, [leadsList, filterType, filterStatus]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-[#F7F7F7] dark:bg-zinc-900 border-b-3 border-[#EBEBEB] dark:border-zinc-800 transition-all duration-300 ease-in-out flex flex-col",
        isHeaderExpanded ? "h-50 overflow-visible" : "h-20 overflow-hidden",
      )}
    >
      {/* Top Row: Logo and Right Profile menu */}
      <div className="h-20 w-full grid grid-cols-3 items-center px-6 sm:px-12 shrink-0">
        {/* Left: Brand Logo */}
        <Link href="/">
          <div
            className="flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <div className="text-[#FF385C]">
              <Home className="size-8 stroke-[2.5]" />
            </div>
            <span className="text-xl font-black tracking-tight text-[#FF385C] hidden md:block">
              househive
            </span>
          </div></Link>

        {/* Center: Flat / Interior tabs */}
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            "hidden md:flex items-center justify-center gap-8 shrink-0",
            isHeaderExpanded
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 pointer-events-none",
          )}
        >
          <button
            onClick={() => onTabChange("Flat")}
            className={cn(
              "font-semibold relative flex items-center gap-1 transition-colors duration-300 pb-1 cursor-pointer group",
              activeTab === "Flat"
                ? "text-zinc-950 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: activeTab === "Flat" ? 1.08 : 1.0, opacity: 1 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="shrink-0"
            >
              <Image
                src="/icons/icon-flat.png"
                alt="Flat"
                width={40}
                height={40}
                className="size-10 object-cover"
              />
            </motion.div>
            <span>Flat</span>
            {activeTab === "Flat" && (
              <motion.div
                layoutId="headerActiveTab"
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-zinc-950 dark:bg-zinc-50 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => onTabChange("Interior")}
            className={cn(
              "font-semibold relative flex items-center gap-1 transition-colors duration-300 pb-1 cursor-pointer group",
              activeTab === "Interior"
                ? "text-zinc-950 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: activeTab === "Interior" ? 1.08 : 1.0, opacity: 1 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="shrink-0"
            >
              <Image
                src="/icons/icon-interior.png"
                alt="Interior"
                width={40}
                height={40}
                className="size-10 object-cover"
              />
            </motion.div>
            <span>Interior</span>
            {activeTab === "Interior" && (
              <motion.div
                layoutId="headerActiveTab"
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-zinc-950 dark:bg-zinc-50 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Right: List property & Settings */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
          <span className="hidden lg:inline-block text-sm font-semibold text-zinc-850 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/85 px-4 py-2.5 rounded-full cursor-pointer transition-colors">
            Share your space
          </span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 rounded-full text-zinc-655 dark:text-zinc-355 cursor-pointer"
          >
            {darkMode ? (
              <Sun className="size-4.5" />
            ) : (
              <Moon className="size-4.5" />
            )}
          </button>
          <button className="p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 rounded-full text-zinc-655 dark:text-zinc-355 cursor-pointer">
            <Globe className="size-4.5" />
          </button>

          {/* Profile Menu Capsule Wrapper */}
          <div className="profile-menu-container relative">
            <div
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 border border-[#DDDDDD] dark:border-zinc-800 rounded-full hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.05)] cursor-pointer transition-all bg-white dark:bg-zinc-900 select-none"
            >
              <Menu className="size-4 text-zinc-550 dark:text-zinc-355" />
              <div className="size-7.5 rounded-full bg-zinc-500 flex items-center justify-center text-white shrink-0">
                <User className="size-4 fill-white" />
              </div>
            </div>

            {/* Dropdown Menu Overlay */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 flex flex-col text-left">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDashboardOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-xs font-black text-[#FF385C] hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors w-full text-left cursor-pointer flex items-center gap-2"
                >
                  💼 Agent Leads Dashboard
                </button>
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />
                <span className="px-4 py-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-850 cursor-pointer">
                  Share your space
                </span>
                <span className="px-4 py-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-850 cursor-pointer">
                  Refer a friend
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SearchPanel */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-300 ease-in-out pointer-events-none w-full",
          isHeaderExpanded
            ? "top-35 -translate-y-1/2 max-w-4xl px-6"
            : "top-10 -translate-y-1/2 max-w-90 sm:max-w-105 px-4 sm:px-0",
        )}
      >
        <SearchPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
          collapsed={!isHeaderExpanded}
          onExpand={(targetCell) => {
            setIsOverlaySearchOpen(true);
            setActiveCell(targetCell || "location");
          }}
          onSearch={(params) => {
            onSearch(params);
            setIsOverlaySearchOpen(false);
            setActiveCell(null);
          }}
        />
      </div>

      {/* Agent Leads Dashboard Dialog */}
      <Dialog open={isDashboardOpen} onOpenChange={setIsDashboardOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] bg-white dark:bg-zinc-950 p-6 overflow-y-auto rounded-[32px] border border-zinc-150/40 dark:border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.18)] flex flex-col gap-5 outline-hidden">
          <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-4 shrink-0">
            <div className="flex flex-col gap-0.5 text-left">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                💼 Agent Leads Dashboard
              </h2>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                Manage inquiries, timelines, budget sizes, and assign lead status
              </p>
            </div>
            <div className="flex items-center gap-3">
              {leadsList.length > 0 && (
                <button
                  onClick={handleClearLeads}
                  className="px-3.5 py-2 border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Clear Database
                </button>
              )}
              <button
                onClick={() => setIsDashboardOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 shrink-0">
            <div className="flex gap-2">
              {["All", "Property", "Interior"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer",
                    filterType === type
                      ? "bg-zinc-900 text-white border-transparent dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50"
                  )}
                >
                  {type === "All" ? "All Leads" : type === "Property" ? "Property Leads" : "Interior Leads"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-zinc-450 dark:text-zinc-505 uppercase tracking-widest">
                Filter Status:
              </span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border border-zinc-250 dark:border-zinc-800 bg-transparent rounded-xl text-xs font-bold focus:outline-none dark:bg-zinc-900"
              >
                <option value="All">All Statuses</option>
                <option value="Created">Created</option>
                <option value="Assigned">Assigned</option>
                <option value="Contacted">Contacted</option>
                <option value="Follow Up">Follow Up</option>
                <option value="Closed">Closed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table Content */}
          <div className="flex-1 overflow-x-auto min-h-[300px]">
            {filteredLeads.length > 0 ? (
              <table className="w-full border-collapse text-left text-xs text-zinc-700 dark:text-zinc-350">
                <thead>
                  <tr className="border-b border-zinc-150 dark:border-zinc-800 text-[10px] font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Title / ID</th>
                    <th className="py-3 px-4">Mobile</th>
                    <th className="py-3 px-4">Timeline</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">Message</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.leadId}
                      className="border-b border-zinc-100 dark:border-zinc-850 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                    >
                      <td className="py-3 px-4 font-bold whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md border",
                            lead.type === "Property"
                              ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-400"
                              : "bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-950/20 dark:border-purple-900/50 dark:text-purple-400"
                          )}
                        >
                          {lead.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-[150px] truncate font-extrabold text-zinc-850 dark:text-zinc-200">
                        {lead.propertyTitle || lead.projectTitle}
                        <div className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold mt-0.5">
                          ID: {lead.propertyId || lead.projectId}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-black whitespace-nowrap text-zinc-900 dark:text-zinc-100">
                        {lead.mobileNumber}
                      </td>
                      <td className="py-3 px-4 font-bold">{lead.timeline}</td>
                      <td className="py-3 px-4 font-black text-emerald-600 dark:text-emerald-400">
                        {lead.budget}
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-500 dark:text-zinc-400 max-w-[150px] truncate" title={lead.message}>
                        {lead.message}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.leadId, e.target.value)}
                          className={cn(
                            "p-1.5 border border-zinc-250 dark:border-zinc-800 bg-transparent rounded-lg font-bold focus:outline-none cursor-pointer dark:bg-zinc-900",
                            lead.status === "Closed" && "text-emerald-500",
                            lead.status === "Cancelled" && "text-red-500",
                            lead.status === "Follow Up" && "text-amber-500"
                          )}
                        >
                          <option value="Created">Created</option>
                          <option value="Assigned">Assigned</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Follow Up">Follow Up</option>
                          <option value="Closed">Closed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20 text-zinc-400">
                <ShieldCheck className="size-12 mb-3 stroke-[1.5]" />
                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-300">
                  No Leads Found
                </h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  Go to flat or interior details pages to submit mock inquiries. They will
                  appear here.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
