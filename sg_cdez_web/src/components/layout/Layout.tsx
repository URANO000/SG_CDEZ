import { Sidebar } from "./Sidebar"
import { Outlet } from "react-router"
import classes from "../ui/styleModules/Layout.module.css";

export function Layout() {
    return (
        <div className={classes.container}>
            <Sidebar />
            <main className={classes.main}>
                <Outlet />
            </main>
        </div>
    );
}