import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navigation/Navbar";
import styles from "./Main.module.scss";
import { Notifications } from "@mantine/notifications";

function Main() {
  return (
    <div className={styles.main}>
      <Notifications />
      <Navbar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

export default Main;
