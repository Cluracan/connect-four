import { createLazyFileRoute } from "@tanstack/react-router"
import { BlindfoldGame } from "../components/blindfoldGame/BlindfoldGame";

export const Route = createLazyFileRoute("/blindfold")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BlindfoldGame />;
}
