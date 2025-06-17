import { BlindfoldGame } from "../components/blindfoldGame/BlindfoldGame";

export const Route = createLazyFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  return <BlindfoldGame />;
}
