import React, { useEffect } from "react";
import { Resume } from "../../declarations/main";
import { useForm } from "@mantine/form";
import {
  Button,
  Grid,
  Group,
  Loader,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import styles from "./Resume.module.scss";
import { useUser } from "../../context/User";
import { api } from "../../utils/server";

function Resume() {
  const { user } = useUser();

  const [loading, setLoading] = React.useState(false);

  const form = useForm<Partial<Resume>>({
    initialValues: {
      name: "",
      description: "",
      phone: "",
      location: "",
    },
  });

  useEffect(() => {
    setLoading(true);
    api
      .get("/applications/resume")
      .then((res) => {
        form.setValues({
          ...form.values,
          name: res.data.data.name || "",
          description: res.data.data.description || "",
          phone: res.data.data.phone || "",
          location: res.data.data.location || "",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const disabled = !user;

  const updateResume = async () => {
    setLoading(true);
    api
      .put("/applications/resume", {
        name: form.values.name,
        description: form.values.description,
        phone: form.values.phone,
        location: form.values.location,
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <Loader />;
  }

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
        <Grid.Col span={12} />
        <Grid.Col span={12}>
          <Title order={3}>Personal Information</Title>
        </Grid.Col>
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
            label="Phone"
            placeholder="Your phone number..."
            required
            {...form.getInputProps("phone")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <TextInput
            label="Location"
            placeholder="Your location..."
            required
            {...form.getInputProps("location")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <Textarea
            label="Description"
            placeholder="Describe yourself..."
            required
            {...form.getInputProps("description")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col span={12} />
        <Grid.Col>
          <Group position="right">
            <Button
              onClick={() => updateResume()}
              type="button"
              variant="filled"
              disabled={disabled}
            >
              Save
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default Resume;
