import React, { createContext, useEffect, useState } from "react";
import { User } from "../declarations/main";
import { api } from "../utils/server";

interface UserContextInterface {
  user: User | null;
  setUser: (user: User | null) => void;
  reloadUser: () => void;
}

const UserContext = createContext<UserContextInterface>({
  user: null,
  setUser: () => {
    return;
  },
  reloadUser: () => {
    return;
  },
});

export default UserContext;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const loadUser = async () => {
    api.get("/users/me").then((res) => {
      setUser(res.data);
    });
  };

  useEffect(() => {
    loadUser();
  }, []);

  const value = { user, setUser, reloadUser: loadUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => React.useContext(UserContext);
