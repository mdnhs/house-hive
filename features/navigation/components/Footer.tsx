"use client";

import * as React from "react";
import { Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-900 py-10 px-6 sm:px-12 bg-[#F7F7F7] dark:bg-zinc-900/50 text-[13px] text-zinc-650 dark:text-zinc-400">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <span>© 2026 HouseHive, Inc.</span>
          <span>•</span>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            Sitemap
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            UK Modern Slavery Act
          </a>
        </div>
        <div className="flex items-center gap-6 font-semibold">
          <span className="flex items-center gap-1 cursor-pointer hover:underline">
            <Globe className="size-4" /> English (US)
          </span>
          <span className="cursor-pointer hover:underline">৳ BDT</span>
        </div>
      </div>
    </footer>
  );
}
