import { api } from "./server";
import jwtDecode from "jwt-decode";

export const logout = async () => {
  const res = await api.post("/users/logout", {
    refreshToken: localStorage.getItem("refreshToken"),
  });
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/auth/login";
  return res;
};

export const checkTokenIsExpired = (token: string) => {
  const decodedToken: unknown = jwtDecode(token);
  const expirationDate = new Date(
    (
      decodedToken as {
        exp: number;
      }
    ).exp * 1000
  );
  const isExpired = new Date() > expirationDate;
  return isExpired;
};
