import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";

export const Route = createFileRoute("/rooms")({
  component: () => <Outlet />,
});
