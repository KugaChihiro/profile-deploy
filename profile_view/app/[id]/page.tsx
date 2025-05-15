"use client"

import ProfilePage from "@/components/view/profile-page"
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const id = Number(params?.id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10">
      <ProfilePage id={id} />
    </main>
  )
}