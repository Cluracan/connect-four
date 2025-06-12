import { useNavigate } from "@tanstack/react-router";
import { useGameController } from "../hooks/useGameController";

export const Route = createFileRoute({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { resetGame } = useGameController();
  return (
    <div>
      <h3>Welcome Home!</h3>
      <button
        onClick={() => {
          resetGame();
          navigate({ to: "/classic" });
        }}
      >
        Classic Game
      </button>
      <button
        onClick={() => {
          resetGame();
          navigate({ to: "/blindfold" });
        }}
      >
        Blindfold Game
      </button>
    </div>
  );
}
