import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navigation/Navbar";
import styles from "./Main.module.scss";

function Main() {
  return (
    <div className={styles.main}>
      <Navbar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

export default Main;
