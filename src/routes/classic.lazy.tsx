import { ClassicGame } from "../pages/ClassicGame";

export const Route = createLazyFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  return <ClassicGame />;
}
