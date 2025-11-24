import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Index";
import Home from "../pages/Home/Index";
import Layout from "../components/layout";
import User from "../pages/Home/User";
import Ticket from "../pages/Home/Tickect";
import Dashboard from "../pages/Home/dashboard";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/setting-user" element={<User />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/custom-tickect" element={<Ticket />} />
            </Route>
        </Routes>
    );
}