import React, { useEffect } from "react";
import { Resume } from "../../declarations/main";
import { useForm } from "@mantine/form";
import { Grid, Text, TextInput, Title } from "@mantine/core";
import styles from "./Resume.module.scss";
import { useUser } from "../../context/User";
import { api } from "../../utils/server";

function Resume() {
  const { user } = useUser();

  const form = useForm<Partial<Resume>>({
    initialValues: {
      name: "",
      email: user?.email || "",
      phone: "",
      location: "",
    },
  });

  useEffect(() => {
    form.setValues({
      name: user ? `${user?.firstName} ${user?.lastName}` : "",
      email: user?.email || "",
    });
  }, [user]);

  useEffect(() => {
    api.get("/applications/resume").then((res) => {
      console.log(res.data.data);
    });
  }, []);

  const disabled = !user;

  return (
    <div className={styles.resume}>
      <Grid>
        <Grid.Col span={12}>
          <Title order={1}>Your Resume</Title>
          {!user && (
            <Text color="red">You must be signed in to use this feature.</Text>
          )}
        </Grid.Col>
        <Grid.Col span={12} />
        <Grid.Col sm={12} md={6} lg={4}>
          <TextInput
            label="Name"
            placeholder="Your name..."
            required
            {...form.getInputProps("name")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <TextInput
            label="Email"
            placeholder="Your email..."
            required
            {...form.getInputProps("email")}
            disabled={disabled}
          />
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default Resume;
