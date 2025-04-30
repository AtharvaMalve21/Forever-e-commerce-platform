import { createContext, useEffect, useState } from "react";

import axios from "axios";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const value = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
  };

  const fetchUserDetails = async () => {
    try {
      const { data } = await axios.get(URI + "/api/user/profile", {
        withCredentials: true,
      });

      console.log(data);
      if (data.success) {
        setIsLoggedIn(true);
        setUser(data.data);
      }
    } catch (err) {
      console.log(err.response?.data.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [isLoggedIn]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
