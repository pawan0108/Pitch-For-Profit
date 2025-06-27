import { Outlet } from "react-router-dom";
import EnpSidebar from "./EnpSidebar";
import EnpTopbar from "./EnpTopbar";
import { useEffect, useState } from "react";
import '../assets/css/investor.css'; // Reuse the same CSS for styling consistency

const EntrepreneurLayout = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedEntrepreneur = JSON.parse(localStorage.getItem("entrepreneur"));
    if (storedEntrepreneur && storedEntrepreneur.name) {
      setUsername(storedEntrepreneur.name);
    }
  }, []);

  return (
    <>
      <div className="row my-4">
        <div className="col-sm-12 mt-5 my-5">
          <EnpTopbar username={username} />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-2">
          <EnpSidebar />
        </div>

        <div className="col-sm-10">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default EntrepreneurLayout;
