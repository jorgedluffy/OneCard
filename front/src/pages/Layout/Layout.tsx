import { Outlet } from "react-router-dom";
import './Layout.css'


export default function Layout() {

  return (
    <>
      <div className="background"></div>
      <Outlet />
    </>
  )
}

