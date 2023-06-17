import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { Button, Grid, Group, TextInput, Textarea, Title } from "@mantine/core";
import { Resume, JobDescription } from "../../declarations/main";
import styles from "./NewApplication.module.scss";
import { api, socket } from "../../utils/server";
import Automatic from "../TextEditor/Automatic/Automatic";

function NewApplication() {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<{
    jobDescription: JobDescription;
    resume: Resume;
  }>({
    initialValues: {
      jobDescription: {
        title: "",
        company: "",
        description: "",
        location: "",
      },
      resume: {
        name: "",
        email: "",
        phone: "",
        location: "",
        skills: [],
        experience: [],
        education: [],
        projects: [],
      },
    },
  });

  /*

Dear Hiring Manager, My name is Aidan and I am applying for the Software Engineer position at Google. As a web developer with experience in React, I am excited about the prospect of joining such a dynamic and innovative company. I understand that Google is a place where engineers push technology forward, develop cutting-edge platforms, and work on projects that are critical to Google’s needs. I am confident that my skills, experience, and passion for software development make me an excellent candidate for this role. As a web developer at Digital Strata, I gained valuable experience in software development and honed my skills in React. Additionally, my Web Development Diploma from BrainStation has laid the foundation for my development knowledge. I am excited about being in an environment where new technologies are constantly being explored and developed, and I am eager to contribute to the development of fluid, accessible, and secure platforms. I am impressed by Google's commitment to innovation and its ability to change how billions of users interact with information and one another. As a software engineer here, I would offer creativity, technical expertise, and an enthusiasm for taking on new challenges. I am confident that my experience in development and building accessible technologies will be a valuable asset. I appreciate your time and consideration and hope to have the opportunity to speak with you about my qualifications in more detail. Thank you for considering my application. Sincerely, Aidan Tilgner
*/
  const [coverLetter, setCoverLetter] = useState<string>(
    "Dear Hiring Manager..."
  );

  // load resume from local storage on mount
  useEffect(() => {
    const resume = localStorage.getItem("resume");
    if (resume) {
      const parsedResume = JSON.parse(JSON.parse(resume)) as Resume;
      form.setValues((prev) => {
        return {
          ...prev,
          resume: {
            name: parsedResume.name,
            email: parsedResume.email,
            phone: parsedResume.phone,
            location: parsedResume.location,
            skills: parsedResume.skills,
            experience: parsedResume.experience,
            education: parsedResume.education,
            projects: parsedResume.projects,
          },
        };
      });
    }

    return () => {
      localStorage.setItem("resume", JSON.stringify(form.values.resume));
    };
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    setCoverLetter("");
    api.post("/applications/new/cover-letter", {
      jobDescription: form.values.jobDescription,
      resume: form.values.resume,
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

  return (
    <div className={styles.newApplication}>
      <Title order={1}>Apply for a Job</Title>
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
                />
              </Grid.Col>
              <Grid.Col sm={12} md={6}>
                <TextInput
                  label="Company"
                  placeholder="Google"
                  withAsterisk
                  {...form.getInputProps("jobDescription.company")}
                />
              </Grid.Col>
              <Grid.Col sm={12} md={6}>
                <TextInput
                  label="Location"
                  placeholder="Mountain View, CA"
                  withAsterisk
                  {...form.getInputProps("jobDescription.location")}
                />
              </Grid.Col>
              <Grid.Col sm={12} md={12}>
                <Textarea
                  label="Job Description"
                  placeholder="Job Description"
                  withAsterisk
                  {...form.getInputProps("jobDescription.description")}
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
                content={coverLetter || "Dear Hiring Manager..."}
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
              />
            </div>
          </div>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default NewApplication;
