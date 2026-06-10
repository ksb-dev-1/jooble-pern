import { Outlet } from "react-router"

import Navbar from "@/components/navbar/navbar"

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}
