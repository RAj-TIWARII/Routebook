import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Nav } from '@/components/layout/Nav';
import { useLenis } from '@/hooks/useLenis';
import { RequireAuth } from '@/components/admin/RequireAuth';

// Route-level code splitting: the homepage (with the map) is the only thing
// that needs to be fast on first paint, so everything else — the journey
// detail page and the whole admin panel — loads on demand.
const Home = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })));
const JourneyPage = lazy(() => import('@/pages/Journey').then((m) => ({ default: m.JourneyPage })));
const AdminLogin = lazy(() => import('@/pages/admin/Login').then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() =>
  import('@/pages/admin/Dashboard').then((m) => ({ default: m.AdminDashboard })),
);
const JourneyEditor = lazy(() =>
  import('@/pages/admin/JourneyEditor').then((m) => ({ default: m.JourneyEditor })),
);

function RouteFallback() {
  return <div className="flex h-screen items-center justify-center text-secondary">Loading…</div>;
}

export function App() {
  useLenis();

  return (
    <>
      <Nav />
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journey/:slug" element={<JourneyPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/journeys/:id"
          element={
            <RequireAuth>
              <JourneyEditor />
            </RequireAuth>
          }
        />

        <Route
          path="*"
          element={
            <div className="flex h-screen flex-col items-center justify-center gap-3 text-center">
              <p className="font-display text-2xl">Page not found</p>
              <a href="/" className="text-accent hover:underline">
                Back to RouteBook
              </a>
            </div>
          }
        />
      </Routes>
      </Suspense>
    </>
  );
}
