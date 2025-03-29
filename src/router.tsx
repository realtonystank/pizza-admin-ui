import { createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/login/Login";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Users from "./pages/users/Users";
import Restaurants from "./pages/restaurants/Restaurants";
import Products from "./pages/products/Products";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <Homepage />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "restaurants",
            element: <Restaurants />,
          },
          {
            path: "products",
            element: <Products />,
          },
        ],
      },
      {
        path: "auth",
        element: <NonAuth />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);
