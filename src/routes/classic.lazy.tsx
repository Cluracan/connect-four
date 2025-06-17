import { ClassicGame } from "../components/classicGame/ClassicGame";

export const Route = createLazyFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  return <ClassicGame />;
}
