import React, { useEffect } from "react";
import { Resume, Skill } from "../../declarations/main";
import { useForm } from "@mantine/form";
import {
  ActionIcon,
  Button,
  Flex,
  Grid,
  Group,
  Loader,
  Rating,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import styles from "./Resume.module.scss";
import { useUser } from "../../context/User";
import { api } from "../../utils/server";
import { showNotification } from "@mantine/notifications";
import { PencilSimple, TrashSimple } from "@phosphor-icons/react";

function Resume() {
  const { user } = useUser();
  const disabled = !user;

  const [loading, setLoading] = React.useState(false);

  const form = useForm<Partial<Resume>>({
    initialValues: {
      name: "",
      description: "",
      phone: "",
      location: "",
    },
    validate: {
      name: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
        return null;
      },
      description: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
        return null;
      },
      phone: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
        return null;
      },
      location: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
        return null;
      },
    },
  });

  const [skills, setSkills] = React.useState<Resume["skills"]>([]);
  const [editingSkill, setEditingSkill] = React.useState<number>();
  const skillForm = useForm<Skill>({
    initialValues: {
      name: "",
      level: 1,
      description: "",
    },
    validate: {
      name: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
        return null;
      },
      description: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
        return null;
      },
      level: (value) => {
        const isValid = value && value >= 1 && value <= 5;
        if (!isValid) {
          return "Value must be between 1 and 5";
        }
        return null;
      },
    },
  });

  const loadResume = async () => {
    setLoading(true);
    api
      .get("/applications/resume")
      .then((res) => {
        console.log("Resume: ", res.data.data);
        form.setValues({
          ...form.values,
          name: res.data.data.name || "",
          description: res.data.data.description || "",
          phone: res.data.data.phone || "",
          location: res.data.data.location || "",
        });
        setSkills(res.data.data.skills);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadResume();
  }, []);

  const updateResume = async () => {
    form.validate();
    const validated = form.isValid();
    if (!validated) {
      showNotification({
        title: "Error",
        message: "Please fill all required fields.",
        color: "red",
      });
      return;
    }
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

  const addOrUpdateSkill = async () => {
    try {
      skillForm.validate();
      const validated = skillForm.isValid();
      if (!validated) {
        showNotification({
          title: "Error",
          message: "Please fill all required fields.",
          color: "red",
        });
        return;
      }
      if (editingSkill) {
        const res = await api.put(
          `/applications/resume/skill/${editingSkill}`,
          {
            ...skillForm.values,
          }
        );
        const success = res.data.success;
        if (!success) {
          showNotification({
            title: "Error",
            message: "An error occurred while updating skill.",
            color: "red",
          });
          return;
        }
        showNotification({
          title: "Success",
          message: "Skill updated successfully.",
        });
        skillForm.reset();
        setEditingSkill(undefined);
        loadResume();
        return;
      }
      const res = await api.post("/applications/resume/skill", {
        ...skillForm.values,
      });
      const success = res.data.success;
      if (!success) {
        showNotification({
          title: "Error",
          message: "An error occurred while adding skill.",
          color: "red",
        });
        return;
      }

      showNotification({
        title: "Success",
        message: "Skill added successfully.",
      });
      skillForm.reset();
      loadResume();
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "An error occurred while adding skill.",
        color: "red",
      });
    }
  };

  const setEditSkill = (skill: Skill) => {
    skillForm.setValues(skill);
    setEditingSkill(skill.id);
  };

  const deleteSkill = async (skill: Skill) => {
    try {
      if (editingSkill === skill.id) {
        setEditingSkill(undefined);
        skillForm.reset();
      }
      const res = await api.delete(`/applications/resume/skill/${skill.id}`);
      const success = res.data.success;
      if (!success) {
        showNotification({
          title: "Error",
          message: "An error occurred while deleting skill.",
          color: "red",
        });
        return;
      }
      showNotification({
        title: "Success",
        message: "Skill deleted successfully.",
      });
      loadResume();
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "An error occurred while deleting skill.",
        color: "red",
      });
    }
  };

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        <Grid.Col span={12} />
        <Grid.Col span={12}>
          <Title order={3}>Your Skills</Title>
        </Grid.Col>
        <Grid.Col sm={12} md={12}>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                {!isMobile && <th>Description</th>}
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill, index) => (
                <tr key={index}>
                  <td>{skill.name}</td>
                  {!isMobile && <td>{skill.description}</td>}
                  <td>{skill.level}/5</td>
                  <td>
                    <Flex gap={8}>
                      <ActionIcon
                        onClick={() => setEditSkill(skill)}
                        loading={editingSkill === skill.id && loading}
                        variant="filled"
                      >
                        <PencilSimple />
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => deleteSkill(skill)}
                        loading={editingSkill === skill.id && loading}
                        variant="transparent"
                      >
                        <TrashSimple />
                      </ActionIcon>
                    </Flex>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Grid.Col>
        <Grid.Col span={12} />
        <Grid.Col span={12}>
          <Title order={3}>Add Skill</Title>
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <TextInput
            label="Name"
            placeholder="Skill name..."
            required
            {...skillForm.getInputProps("name")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <Textarea
            label="Description"
            placeholder="Describe your skill..."
            required
            {...skillForm.getInputProps("description")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <Flex
            direction="column"
            justify="center"
            style={{ width: "100%" }}
            gap={8}
          >
            <Text size="sm" color="">
              Level{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                *
              </span>
            </Text>
            <Rating
              placeholder="Skill level..."
              {...skillForm.getInputProps("level")}
            />
          </Flex>
        </Grid.Col>
        <Grid.Col span={12} />
        <Grid.Col>
          <Group position="right">
            <Button
              onClick={() => addOrUpdateSkill()}
              type="button"
              variant="filled"
              disabled={disabled}
            >
              Add
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default Resume;
