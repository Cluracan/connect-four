import { Settings } from "../pages/Settings";

export const Route = createFileRoute({
  component: Index,
});

function Index() {
  return <Settings />;
}
