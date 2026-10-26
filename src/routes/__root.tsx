import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

export interface RouterContext {
  queryClient: QueryClient;
}

const RootComponent = () => (
  <div className="min-h-svh bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <Outlet />
  </div>
);

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});
