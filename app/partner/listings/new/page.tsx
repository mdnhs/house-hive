"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CreateListingForm } from "@/features/properties/components/CreateListingForm";
import { ChevronLeft } from "lucide-react";

export default function NewListingPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-white dark:bg-zinc-950 flex flex-col">
      <div className="sticky top-0 z-40 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => router.push("/partner/dashboard")}
            className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="size-5 text-zinc-700 dark:text-zinc-300" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              New Listing
            </h1>
            <p className="text-xs text-zinc-400">
              Create a new property or project
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 max-w-lg mx-auto w-full">
        <CreateListingForm
          businessType="housing"
          onSubmit={(data) => {
            console.log("Listing created:", data);
            router.push("/partner/dashboard");
          }}
        />
      </div>
    </div>
  );
}
