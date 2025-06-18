import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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
        <header>
          <Link to="/">Home</Link> <Link to="/about">About</Link>
        </header>
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
      </ThemeProvider>
    </>
  ),
});
