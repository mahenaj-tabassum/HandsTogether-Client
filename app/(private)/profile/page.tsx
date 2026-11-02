import type { Metadata } from "next";
import ProfileView from "@/components/profile/ProfileView";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 pb-16 pt-12">
      <ProfileView />
    </main>
  );
}
