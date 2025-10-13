import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../page/auth/login";
import User from "../page/admin_page/user";
import ProtectedRoute from "./protectedRoute";
import DefaultLayout from "../layout/defaultLayout";
import Dashboard from "../page/admin_page/dashboard";
import Categories from "../page/admin_page/categories";
import Items from "../page/admin_page/items";
import Orders from "../page/admin_page/orders"; // make sure this file exists
import UpdateUserForm from "../features/user/updateUserForm";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DefaultLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="items" element={<Items />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users/" element={<User />} >
           <Route path="update_user" element={<UpdateUserForm/>}/>
          </Route>
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <User />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
