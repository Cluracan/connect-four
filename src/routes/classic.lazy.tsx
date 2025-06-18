import { createLazyFileRoute } from "@tanstack/react-router"
import { ClassicGame } from "../components/classicGame/ClassicGame";

export const Route = createLazyFileRoute("/classic")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ClassicGame />;
}
