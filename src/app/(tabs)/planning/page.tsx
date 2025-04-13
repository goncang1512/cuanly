import { getMyPlanning } from "@/actions/planning.action";
import Container from "@/components/container";
import CreatePlan from "@/components/PlanningPage/CreatePlan";
import ShowCalender from "@/components/PlanningPage/ShowCalender";
import PlanningTopBar from "@/components/PlanningPage/TopBar";
import PlanningContextProvider from "@/lib/context/PlanningContext";
import React from "react";

export default async function PlanningPage() {
  const data = await getMyPlanning();
  return (
    <PlanningContextProvider planning={data?.results}>
      <Container>
        <PlanningTopBar />
        <CreatePlan />

        <div className="pt-10">
          <ShowCalender />
        </div>
      </Container>
    </PlanningContextProvider>
  );
}
