import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, Typography } from "@mui/material";
import { HomeButton } from "../components/HomeButton";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#242424",
    },
  },
});

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppBar
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            p: 2,
          }}
        >
          <Typography>Connect Four</Typography>
          <HomeButton />
        </AppBar>
        <Outlet />
        <TanStackRouterDevtools />
      </ThemeProvider>
    </>
  ),
});
