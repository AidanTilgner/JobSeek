import React, { createContext, useEffect, useState } from "react";
import { User } from "../declarations/main";
import { api, logout } from "../utils/server";

interface UserContextInterface {
  user: User | null;
  setUser: (user: User | null) => void;
  reloadUser: () => void;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextInterface>({
  user: null,
  setUser: () => {
    return;
  },
  reloadUser: () => {
    return;
  },
  refreshUser: () => {
    return;
  },
});

export default UserContext;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const loadUser = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!accessToken || !refreshToken) {
      return;
    }
    api.get("/users/me").then((res) => {
      setUser(res.data);
    });
  };

  const refreshUser = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!accessToken || !refreshToken) {
      return;
    }
    api
      .post("/users/refresh", {
        refreshToken: localStorage.getItem("refreshToken"),
      })
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      })
      .catch((err) => {
        console.log("Error refreshing user");
        console.error(err);
        logout();
      });
  };

  useEffect(() => {
    refreshUser().then(() => {
      loadUser();
    });
  }, []);

  console.log("User: ", user);

  const value = { user, setUser, reloadUser: loadUser, refreshUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => React.useContext(UserContext);
