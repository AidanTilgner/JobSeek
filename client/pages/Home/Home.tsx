import React from "react";
import { useUser } from "../../context/User";
import { Link } from "react-router-dom";

function Home() {
  const { isLoggedIn } = useUser();

  return (
    <div>
      <p>Hello and welcome :)</p>
      {!isLoggedIn && (
        <p>
          <Link to="/auth/login">Log in</Link> to get started
        </p>
      )}
      {isLoggedIn && (
        <p>
          <Link to="/applications/new">Start a new application</Link>
        </p>
      )}
    </div>
  );
}

export default Home;
