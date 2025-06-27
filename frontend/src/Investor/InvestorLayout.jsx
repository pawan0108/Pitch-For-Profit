import { Outlet } from "react-router-dom";
import InvestorSidebar from "./InvestorSidebar";
import InvestorTopbar from "./InvestorTopbar";
import { useEffect, useState } from "react"; // ✅ Import useEffect and useState
import '../assets/css/investor.css'; // Investor CSS

const InvestorLayout = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedInvestor = JSON.parse(localStorage.getItem("investor"));
    if (storedInvestor && storedInvestor.name) {
      setUsername(storedInvestor.name);
    }
  }, []);

  return (
    <>
      <div className="row my-4">
        <div className="col-sm-12 mt-5 my-5">
          <InvestorTopbar username={username} />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-2">
          <InvestorSidebar />
        </div>

        <div className="col-sm-10">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default InvestorLayout;
