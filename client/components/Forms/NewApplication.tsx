import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  Grid,
  Group,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { JobDescription } from "../../declarations/main";
import styles from "./NewApplication.module.scss";
import { api, socket } from "../../utils/server";
import Automatic from "../TextEditor/Automatic/Automatic";
import { useUser } from "../../context/User";

function NewApplication() {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<{
    jobDescription: JobDescription;
  }>({
    initialValues: {
      jobDescription: {
        title: "",
        company: "",
        description: "",
        location: "",
      },
    },
  });

  const [coverLetter, setCoverLetter] = useState<string>("");

  useEffect(() => {
    if (coverLetter) {
      localStorage.setItem("coverLetter", coverLetter);
    }
  }, [coverLetter]);

  useEffect(() => {
    const coverLetter = localStorage.getItem("coverLetter");
    if (coverLetter) {
      setCoverLetter(coverLetter);
    }
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    setCoverLetter("");
    api.post("/applications/new/cover-letter", {
      jobDescription: form.values.jobDescription,
      stream: true,
    });
  };

  useEffect(() => {
    socket.on("application/new/cover-letter:datastream", (data) => {
      const done = data.done;
      setCoverLetter((prev) => {
        return prev + data.message_fragment;
      });
      if (done) {
        setLoading(false);
      }
    });

    return () => {
      socket.off("application/new/cover-letter:datastream");
    };
  }, []);

  const { user } = useUser();

  const disabled = !user;

  return (
    <div className={styles.newApplication}>
      <Title order={1}>Apply for a Job</Title>
      {!user && (
        <Text color="red">You must be signed in to use this feature.</Text>
      )}
      <br />
      <br />
      <Grid
        gutter={56}
        style={{
          height: "100%",
        }}
      >
        <Grid.Col
          sm={12}
          md={6}
          style={{
            height: "100%",
          }}
        >
          <form
            onSubmit={form.onSubmit(() => {
              onSubmit();
            })}
          >
            <Grid>
              <Grid.Col sm={12} md={6}>
                <TextInput
                  label="Job Title"
                  placeholder="Software Engineer"
                  withAsterisk
                  {...form.getInputProps("jobDescription.title")}
                  disabled={disabled}
                />
              </Grid.Col>
              <Grid.Col sm={12} md={6}>
                <TextInput
                  label="Company"
                  placeholder="Google"
                  withAsterisk
                  {...form.getInputProps("jobDescription.company")}
                  disabled={disabled}
                />
              </Grid.Col>
              <Grid.Col sm={12} md={6}>
                <TextInput
                  label="Location"
                  placeholder="Mountain View, CA"
                  withAsterisk
                  {...form.getInputProps("jobDescription.location")}
                  disabled={disabled}
                />
              </Grid.Col>
              <Grid.Col sm={12} md={12}>
                <Textarea
                  label="Job Description"
                  placeholder="Job Description"
                  withAsterisk
                  {...form.getInputProps("jobDescription.description")}
                  disabled={disabled}
                />
              </Grid.Col>
              <Grid.Col sm={12} md={12} />
              <Grid.Col sm={12} md={12}>
                <Group position="right">
                  <Button type="submit">Generate</Button>
                </Group>
              </Grid.Col>
            </Grid>
          </form>
        </Grid.Col>
        <Grid.Col
          sm={12}
          md={6}
          style={{
            height: "100%",
          }}
        >
          <div className={styles.output}>
            <div className={styles.coverLetter}>
              <Automatic
                content={coverLetter}
                onUpdate={(content, type) => {
                  switch (type) {
                    case "append":
                      setCoverLetter((prev) => {
                        return prev + content;
                      });
                      break;
                    case "replace":
                      setCoverLetter(content);
                      break;
                  }
                }}
                loading={loading}
                onClearContent={() => {
                  setCoverLetter("");
                }}
                disabled={disabled}
              />
            </div>
          </div>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default NewApplication;
