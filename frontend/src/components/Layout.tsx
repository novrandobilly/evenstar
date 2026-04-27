import type { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-svh flex flex-col">
      <Header />
      {/* pb-24 on mobile to clear the fixed bottom nav */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
