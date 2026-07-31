import { Sidebar } from "./Sidebar"
import { Outlet } from "react-router"

export function Layout(){
    return(
        <>
      <div style={{ display: "flex", height: "calc(100vh - 60px)", backgroundColor: "--color-navbar"}}>
        <Sidebar />

        <main style={{ flex: 1, padding: "1rem", overflow: "auto",  }}>
          <Outlet />
        </main>
      </div>
        </>
    )
}