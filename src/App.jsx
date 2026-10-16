import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Application from "./pages/Application";
import Document from "./pages/Document";
import HomeBanner from "./pages/HomeBanner";
import Media from "./pages/Media";
import ManageUser from "./pages/ManageUser";
import CardPage from "./pages/CardPage";
import Calculator from "./pages/Calculator";
import Withdraw from "./pages/Withdraw";
import Settings from "./pages/Settings";
import Staff from "./pages/Staff";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="application" element={<Application />} />
          <Route path="document" element={<Document />} />
          <Route path="home-banner" element={<HomeBanner />} />
          <Route path="media" element={<Media />} />
          <Route path="manage-user" element={<ManageUser />} />
          <Route path="card" element={<CardPage />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="settings" element={<Settings />} />
          <Route path="staff" element={<Staff />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
