"use client"

import ProfileForm from "@/components/edit/profile-form"
import { useParams } from "next/navigation";
import { LogOut } from "lucide-react";


export default function Home() {
  const params = useParams();
  const id = Number(params?.id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-5">
        <a
          href="/.auth/logout"
          className="inline-flex items-center gap-4 mx-8 mt-1 text-sm pb-5 font-medium text-gray-600 hover:text-gray-300 rounded-xl"
        >
          <LogOut size={18} />
          ログアウト
        </a>
      <ProfileForm id={id} />
    </main>
  )
}