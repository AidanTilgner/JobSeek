import React from "react";
import "./Global.scss";
import styles from "./App.module.scss";
import { MantineProvider } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import NewApplication from "./components/Forms/NewApplication";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import Main from "./Layouts/Main";
import Resume from "./pages/Resume/Resume";

function App() {
  return (
    <MantineProvider
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        headings: {
          fontFamily: "Inter",
          fontWeight: 500,
        },
        colors: {
          cool_blue: [
            "#f2f3f7",
            "#d5d9e8",
            "#b7c0dd",
            "#97a7d8",
            "#758ed9",
            "#4e73e1",
            "#2256f2",
            "#2450d5",
            "#3050d5",
            "#3050af",
          ],
        },
        primaryColor: "cool_blue",
        fontFamily: "Inter",
      }}
    >
      <div className={styles.App}>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="applications">
              <Route path="new" element={<NewApplication />} />
            </Route>
            <Route path="resume">
              <Route index element={<Resume />} />
            </Route>
            <Route path="auth">
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
            </Route>
            <Route path="*" element={<div>404</div>} />
          </Route>
        </Routes>
      </div>
    </MantineProvider>
  );
}

export default App;
