import { createLazyFileRoute } from "@tanstack/react-router";
import { ClassicGame } from "../components/ClassicGame";

export const Route = createLazyFileRoute("/classic")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ClassicGame />;
}
