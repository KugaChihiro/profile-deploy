"use client"

import ProfileList from "@/components/list/profile-list"
import { LogOut } from "lucide-react";

export default function Home() {
  return (
    <div>
      <div className = "bg-white group relative inline-flex">
        <a
          href="/.auth/logout"
          className="inline-flex items-center gap-4 mx-7 mt-3 px-2 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-100 rounded-xl"
        >
          <LogOut size={18} />
          サインアウト
        </a>
        <div className="absolute top-full mt-2 left-1/2 w-36 -translate-x-1/2 rounded-lg bg-gray-500 px-4 py-3 text-sm text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 pointer-events-none z-50">
          <p className="font-bold mb-1">安全にセッションを終了します</p>
          <p>複数のアカウントがサインイン済みである場合、サインアウトするアカウントをお選びいただけます。<br/>別のアカウントでこのアプリを使い始めたい場合も、まずはこちらから現在の作業を終了してください。 </p>
          <div className="absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-b-8 border-x-transparent border-b-gray-500"></div>
        </div>
      </div>
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <ProfileList/>
      </main>
    </div>
  )
}
