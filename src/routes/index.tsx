import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "../components/Settings";

const Index = () => {
  return <Settings />;
};
export const Route = createFileRoute("/")({
  component: Index,
});
