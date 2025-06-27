import { Outlet } from "react-router-dom"
import Navbar from "../Elements/Navbar"
import Footer from "../Components/Footer"
import Slider from "../Components/Slider"

const Layout = () => {
    return (
        <div>
           <Navbar/>
           {/* <Slider/> */}
            <Outlet />
          <Footer/>
        </div>
    )
}

export default Layout