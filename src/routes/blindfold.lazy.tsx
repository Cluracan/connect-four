import { BlindfoldGame } from "../pages/BlindfoldGame";

export const Route = createLazyFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  return <BlindfoldGame />;
}
