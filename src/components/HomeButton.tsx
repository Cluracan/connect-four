import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "@tanstack/react-router";

export const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <IconButton onClick={() => navigate({ to: "/" })}>
      <HomeIcon />
    </IconButton>
  );
};
