"use client"

import ProfileForm from "@/components/edit/profile-form"
import { useParams } from "next/navigation";
import { LogOut,User } from "lucide-react";


export default function Home() {
  const params = useParams();
  const id = Number(params?.id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-5">
        <a
          href="/.auth/login/aad?prompt=select_account"
          className="inline-flex items-center gap-4 ml-8 mt-1 text-sm pb-5 font-medium text-gray-600 hover:text-gray-300 rounded-xl"
        >
          <User size={18} />
          アカウント変更
        </a>
        <a
          href="/.auth/logout?post_logout_redirect_uri=/logout-complete"
          className="inline-flex items-center gap-4 mx-8 mt-1 mb-2 text-sm pb-5 font-medium text-gray-600 hover:text-gray-300 rounded-xl"
        >
          <LogOut size={18} />
          ログアウト
        </a>
      <ProfileForm id={id} />
    </main>
  )
}