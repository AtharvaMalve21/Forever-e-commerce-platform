import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { assets } from "../assets/frontend_assets/assets.js";

const Navbar = () => {
  const { user, setIsLoggedIn, setUser, isLoggedIn } = useContext(UserContext);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const [dropDown, setDropDown] = useState(false);

  const toggleDropDown = () => {
    setDropDown((prev) => !prev);
  };

  const navigate = useNavigate();

  const logoutUserAccount = async () => {
    try {
      const { data } = await axios.get(URI + "/api/user/logout", {
        withCredentials: true,
      });
      if (data.success) {
        setIsLoggedIn(false);
        setUser(null);
        toast.success(data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data.message);
    }
  };

  return (
    <div>
      <img src={assets.logo} alt="" />
      {isLoggedIn ? (
        <div>
          <div
            onClick={toggleDropDown}
            className={`flex justify-end mr-5 items-center`}
          >
            <p className="border flex justify-center items-center border-gray-900 w-10 h-10 bg-gray-900 text-white rounded-full">
              {user?.name.charAt(0)}
            </p>
          </div>
          <div>
            {dropDown && (
              <div>
                <Link>My Profile</Link>
                <Link>My Orders</Link>
                <button onClick={logoutUserAccount}>Logout</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
