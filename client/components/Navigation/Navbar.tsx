import React from "react";
import styles from "./Navbar.module.scss";
import { Title, Burger, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { useUser } from "../../context/User";
import { logout } from "../../utils/auth";

function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);
  const { user } = useUser();

  return (
    <div className={styles.navbar}>
      <div className={styles.name}>
        <img src="/assets/branding/logo.svg" alt="Logo" />
        <Link to="/">
          <Title order={2}>JobSeek</Title>
        </Link>
      </div>
      <div className={styles.mobileMenu}>
        <Burger opened={opened} onClick={toggle} />
      </div>
      {opened && (
        <ul className={styles.mobileItems} onClick={toggle}>
          <li onClick={toggle} className={styles.mobileItem}>
            <Link to="/">Home</Link>
          </li>
          {!user && (
            <li onClick={toggle} className={styles.mobileItem}>
              <Link to="/auth/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </li>
          )}
          {!user && (
            <li onClick={toggle} className={styles.mobileItem}>
              <Link to="/auth/login">
                <Button variant="filled">Login</Button>
              </Link>
            </li>
          )}
          {user && (
            <li onClick={toggle} className={styles.mobileItem}>
              <Link to="/applications/new">
                <Button variant="outline">Apply</Button>
              </Link>
            </li>
          )}
          {user && (
            <li className={styles.desktopItem}>
              <Button variant="outline" color="red" onClick={logout}>
                Logout
              </Button>
            </li>
          )}
        </ul>
      )}
      <ul className={styles.desktopItems}>
        <li className={styles.desktopItem}>
          <Link to="/">Home</Link>
        </li>
        {!user && (
          <Link to="/auth/signup">
            <Button variant="outline">Sign Up</Button>
          </Link>
        )}
        {!user && (
          <li className={styles.desktopItem}>
            <Link to="/auth/login">
              <Button variant="filled">Login</Button>
            </Link>
          </li>
        )}
        {user && (
          <li className={styles.desktopItem}>
            <Link to="/applications/new">
              <Button variant="outline">Apply</Button>
            </Link>
          </li>
        )}
        {user && (
          <li className={styles.desktopItem}>
            <Button variant="outline" color="red" onClick={logout}>
              Logout
            </Button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
