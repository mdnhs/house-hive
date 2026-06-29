"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Building2,
  Sofa,
  Eye,
  MessageSquare,
  Sparkles,
  Plus,
  LogOut,
  LayoutDashboard,
  Home,
  Settings,
  ChevronDown,
  List,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const sidebarData = {
  main: [
    { title: "Dashboard", url: "/partner/dashboard", icon: LayoutDashboard },
  ],
  listings: {
    label: "Listings",
    items: [
      { title: "All Properties", url: "#", icon: Building2 },
      { title: "Add New", url: "/partner/listings/new", icon: Plus },
    ],
  },
  other: [{ title: "Settings", url: "#", icon: Settings }],
};

export default function PartnerDashboardPage() {
  const router = useRouter();
  const businessType = "housing";

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/partner/dashboard">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-gradient-to-br from-[#FF385C] to-[#BD1E59] flex items-center justify-center shrink-0">
                      {businessType === "housing" ? (
                        <Building2 className="size-4 text-white" />
                      ) : (
                        <Sofa className="size-4 text-white" />
                      )}
                    </div>
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate font-semibold">househive</span>
                      <span className="truncate text-xs text-muted-foreground">
                        Partner
                      </span>
                    </div>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {/* Main */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarData.main.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.url === "/partner/dashboard"}
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Listings collapsible */}
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  <List className="size-4" />
                  <span>{sidebarData.listings.label}</span>
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarData.listings.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>

          <SidebarSeparator />

          {/* Other */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarData.other.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <Home />
                  <span>View Site</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        {/* Sticky navbar */}
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-6" />
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/", "_blank")}
            >
              <Home />
              View Site
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: businessType === "housing" ? "Properties" : "Projects",
                value: "1",
                icon: businessType === "housing" ? Building2 : Sofa,
                color: "from-[#FF385C] to-[#BD1E59]",
              },
              {
                label: "Views",
                value: "0",
                icon: Eye,
                color: "from-blue-500 to-blue-600",
              },
              {
                label: "Inquiries",
                value: "0",
                icon: MessageSquare,
                color: "from-emerald-500 to-emerald-600",
              },
              {
                label: "Featured",
                value: "0",
                icon: Sparkles,
                color: "from-amber-500 to-orange-500",
              },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border bg-card p-4">
                <div
                  className={cn(
                    "size-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3",
                    stat.color,
                  )}
                >
                  <stat.icon className="size-4 text-white" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => router.push("/partner/listings/new")}
                className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
              >
                <div className="size-10 rounded-xl bg-gradient-to-br from-[#FF385C] to-[#BD1E59] flex items-center justify-center shrink-0">
                  <Plus className="size-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    Add New Listing
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Create a new property or project
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Listings */}
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-semibold text-foreground mb-4">
              Recent Listings
            </h2>
            <div className="text-center py-12">
              <div className="size-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <Building2 className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Start by creating your first listing
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
