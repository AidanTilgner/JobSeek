import React from "react";
import styles from "./Authform.module.scss";
import {
  Grid,
  TextInput,
  Title,
  Button,
  PasswordInput,
  Group,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "../../utils/server";
import { showNotification } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/User";

function Signup() {
  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      password_confirmation: "",
    },
    validate: {
      email: (value) => {
        if (!value.includes("@")) {
          return "Email is invalid";
        }
      },
      password: (value) => {
        // length greater than 5, at least one number, at least one letter, at least one special character
        const errors: string[] = [];
        if (value.length < 6) {
          errors.push("Password must be at least 6 characters long");
        }
        if (!value.match(/[0-9]/)) {
          errors.push("Password must contain at least one number");
        }
        if (!value.match(/[a-zA-Z]/)) {
          errors.push("Password must contain at least one letter");
        }
        if (!value.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)) {
          errors.push("Password must contain at least one special character");
        }
        return errors.length > 0 ? errors : false;
      },
      password_confirmation: (value, values) => {
        if (value !== values.password) {
          return "Passwords do not match";
        }
      },
    },
  });

  const navigate = useNavigate();

  const { reloadUser } = useUser();

  return (
    <div className={styles.AuthForm}>
      <div className={styles.form}>
        <div className={styles.form__header}>
          <Title order={2}>Sign up</Title>
        </div>
        <form
          className={styles.form__body}
          onSubmit={form.onSubmit(
            async (values) => {
              const res = await api.post("/users/signup", {
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                password: values.password,
              });

              const { data } = res;

              const { accessToken, refreshToken } = data.data;

              localStorage.setItem("accessToken", accessToken);
              localStorage.setItem("refreshToken", refreshToken);

              showNotification({
                title: "Success",
                message: "You have successfully signed up",
              });

              reloadUser();

              navigate("/");
            },
            (errors) => {
              showNotification({
                title: "Error",
                message: errors[0],
                color: "red",
              });
            }
          )}
        >
          <Grid>
            <Grid.Col>
              <TextInput
                label="Email"
                placeholder="Email"
                required
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                label="First Name"
                placeholder="First Name"
                required
                {...form.getInputProps("firstName")}
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                label="Last Name"
                placeholder="Last Name"
                required
                {...form.getInputProps("lastName")}
              />
            </Grid.Col>
            <Grid.Col>
              <PasswordInput
                label="Password"
                placeholder="Password"
                required
                {...form.getInputProps("password")}
              />
            </Grid.Col>
            <Grid.Col>
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm Password"
                required
                {...form.getInputProps("password_confirmation")}
              />
            </Grid.Col>
            <Grid.Col span={12} />
            <Grid.Col>
              <Group position="right">
                <Link to="/auth/login">
                  <Text color="white" underline>
                    Login instead
                  </Text>
                </Link>
                <Button type="submit">Sign Up</Button>
              </Group>
            </Grid.Col>
          </Grid>
        </form>
      </div>
    </div>
  );
}

export default Signup;
