import BottomNav from "@/components/BottomNav";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <BottomNav />
    </div>
  );
}

export default layout;
