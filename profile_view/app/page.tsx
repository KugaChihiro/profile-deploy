"use client"

import ProfileList from "@/components/list/profile-list"
import { LogOut } from "lucide-react";

export default function Home() {
  return (
    <div>
      <div className = "bg-white">
        <a
          href="/.auth/logout"
          className="inline-flex items-center gap-4 mx-7 mt-3 px-2 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-100 rounded-xl"
        >
          <LogOut size={18} />
          ログアウト
        </a>
      </div>
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <ProfileList/>
      </main>
    </div>
  )
}
