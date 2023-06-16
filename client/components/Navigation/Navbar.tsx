import React from "react";
import styles from "./Navbar.module.scss";
import { Title, Burger, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";

function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <div className={styles.navbar}>
      <div className={styles.name}>
        <img src="/assets/branding/logo.svg" alt="Logo" />
        <Title order={2}>JobSeek</Title>
      </div>
      <div className={styles.mobileMenu}>
        <Burger opened={opened} onClick={toggle} />
      </div>
      {opened && (
        <ul className={styles.mobileItems} onClick={toggle}>
          <li onClick={toggle} className={styles.mobileItem}>
            <Link to="/">Home</Link>
          </li>
          <li onClick={toggle} className={styles.mobileItem}>
            <Link to="/applications/new">
              <Button variant="outline">Apply</Button>
            </Link>
          </li>
        </ul>
      )}
      <ul className={styles.desktopItems}>
        <li className={styles.desktopItem}>
          <Link to="/">Home</Link>
        </li>
        <li className={styles.desktopItem}>
          <Link to="/applications/new">
            <Button variant="outline">Apply</Button>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
