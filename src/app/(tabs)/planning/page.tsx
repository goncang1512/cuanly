import Container from "@/components/container";
import CreatePlan from "@/components/PlanningPage/CreatePlan";
import PlanningTopBar from "@/components/PlanningPage/TopBar";
import PlanningContextProvider from "@/lib/context/PlanningContext";
import React from "react";

export default function PlanningPage() {
  return (
    <PlanningContextProvider>
      <Container>
        <PlanningTopBar />
        <CreatePlan />

        <div className="w-full h-[300vh]"></div>
      </Container>
    </PlanningContextProvider>
  );
}
