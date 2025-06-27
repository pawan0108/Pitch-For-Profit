import { Outlet } from "react-router-dom"

import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import '../assets/css/admin.css'

const AdminLayout = () => {
    
    return (
        <>  

       
        <div className="row my-4">
          <div className="col-sm-12 mt-5 my-5">
          <Topbar/>
          </div>
        </div>

        <div className="row">
            <div className="col-sm-2">
            <Sidebar/>
            </div>

            <div className="col-sm-10">
            <Outlet />
            </div>
        </div>

        </>
    )
}

export default AdminLayout