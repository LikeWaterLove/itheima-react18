import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import { createBrowserRouter } from "react-router-dom";
import AuthRouter from "@/components/AuthRouter";
import { Suspense, lazy } from "react";
const Home = lazy(() => import("@/pages/Home"));
const Publish = lazy(() => import("@/pages/Publish"));
const Article = lazy(() => import("@/pages/Article"));
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthRouter>
        <Layout />
      </AuthRouter>
    ),
    children: [
      {
        index: true,
        path: "home",
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "article",
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <Publish />
          </Suspense>
        ),
      },
      {
        path: "publish",
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <Article />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
export default router;
