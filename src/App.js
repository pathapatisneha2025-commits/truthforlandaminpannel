import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminResourcesPanel from "./pages/resources";
import AdminLayout from "./components/Adminlayout";
import AdminLogin from "./pages/adminlogin";
import AdminForgotPassword from "./pages/forgotpassword";
import AdminBlogPanel from "./pages/Blogs";


function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/adminlogin" />} />


        {/* Login */}
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/forgotpassword" element={<AdminForgotPassword />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* ✅ relative path */}
          <Route path="resources" element={<AdminResourcesPanel />} />
           <Route path="blogs" element={<AdminBlogPanel />} />

        </Route>

        {/* 404 */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
