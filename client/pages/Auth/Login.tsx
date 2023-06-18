import React from "react";
import styles from "./Authform.module.scss";
import {
  Grid,
  TextInput,
  Title,
  Button,
  PasswordInput,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "../../utils/server";
import { showNotification } from "@mantine/notifications";
import { useUser } from "../../context/User";
import { useNavigate } from "react-router-dom";

function Login() {
  const { reloadUser } = useUser();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {},
  });

  const navigate = useNavigate();

  return (
    <div className={styles.AuthForm}>
      <div className={styles.form}>
        <div className={styles.form__header}>
          <Title order={2}>Login</Title>
        </div>
        <form
          className={styles.form__body}
          onSubmit={form.onSubmit(
            async (values) => {
              const res = await api.post("/users/login", {
                email: values.email,
                password: values.password,
              });

              const { data } = res;

              const { accessToken, refreshToken } = data.data;

              localStorage.setItem("accessToken", accessToken);
              localStorage.setItem("refreshToken", refreshToken);

              showNotification({
                title: "Success",
                message: "You have successfully logged in",
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
              <PasswordInput
                label="Password"
                placeholder="Password"
                required
                {...form.getInputProps("password")}
              />
            </Grid.Col>
            <Grid.Col span={12} />
            <Grid.Col>
              <Group position="right">
                <Button type="submit">Login</Button>
              </Group>
            </Grid.Col>
          </Grid>
        </form>
      </div>
    </div>
  );
}

export default Login;
