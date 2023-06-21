import React, { createContext, useEffect, useState } from "react";
import { User } from "../declarations/main";
import { api } from "../utils/server";
import { checkTokenIsExpired, logout } from "../utils/auth";

interface UserContextInterface {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  reloadUser: () => void;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextInterface>({
  user: null,
  isLoggedIn: false,
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
    api
      .get("/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setUser(res.data.data);
      });
  };

  const refreshUser = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!accessToken || !refreshToken) {
      return;
    }
    const isExpired = checkTokenIsExpired(accessToken);
    if (!isExpired) {
      loadUser();
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
        api.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
      })
      .catch((err) => {
        console.error(err);
        logout();
      });
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value: UserContextInterface = {
    user,
    isLoggedIn: !!user,
    setUser,
    reloadUser: loadUser,
    refreshUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => React.useContext(UserContext);
