import React, { useEffect, useState } from "react";
import {
  Education,
  Experience,
  Project,
  Resume,
  Skill,
} from "../../declarations/main";
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
import { DateInput } from "@mantine/dates";
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

  const [experience, setExperience] = useState<Resume["experience"]>([]);
  const [editingExperience, setEditingExperience] = useState<number>();
  const experienceForm = useForm<Experience>({
    initialValues: {
      title: "",
      company: "",
      location: "",
      description: "",
      startDate: "",
      endDate: "",
    },
    validate: {
      title: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
        return null;
      },
      company: (value) => {
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
      description: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
        return null;
      },
      startDate: (value) => {
        const isValid = value && new Date(value).getTime() > 0;
        if (!isValid) {
          return "Value must be a valid date";
        }
        return null;
      },
      endDate: (value) => {
        if (!value) {
          return null;
        }
        const isValid = new Date(value).getTime() > 0;
        if (!isValid) {
          return "Value must be a valid date";
        }
        return null;
      },
    },
    transformValues: (values) => {
      // convert the dates to ISO strings
      return {
        ...values,
        startDate: values.startDate
          ? new Date(values.startDate).toISOString()
          : "",
        endDate: values.endDate ? new Date(values.endDate).toISOString() : "",
      };
    },
  });

  const [education, setEducation] = useState<Resume["education"]>([]);
  const [editingEducation, setEditingEducation] = useState<number>();
  const educationForm = useForm<Education>({
    initialValues: {
      degree: "",
      school: "",
      location: "",
      description: "",
      startDate: "",
      endDate: "",
    },
    validate: {
      degree: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
      },
      school: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
      },
      location: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
      },
      description: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
      },
      startDate: (value) => {
        const isValid = value && new Date(value).getTime() > 0;
        if (!isValid) {
          return "Value must be a valid date";
        }
      },
      endDate: (value) => {
        if (!value) {
          return null;
        }
        const isValid = new Date(value).getTime() > 0;
        if (!isValid) {
          return "Value must be a valid date";
        }
      },
    },
    transformValues: (values) => {
      // convert the dates to ISO strings
      return {
        ...values,
        startDate: values.startDate
          ? new Date(values.startDate).toISOString()
          : "",
        endDate: values.endDate ? new Date(values.endDate).toISOString() : "",
      };
    },
  });

  const [projects, setProjects] = useState<Resume["projects"]>([]);
  const [editingProject, setEditingProject] = useState<number>();
  const projectForm = useForm<Project>({
    initialValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      link: "",
      location_worked_on: "",
    },
    validate: {
      name: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
      },
      description: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
      },
      startDate: (value) => {
        const isValid = value && new Date(value).getTime() > 0;
        if (!isValid) {
          return "Value must be a valid date";
        }
      },
      endDate: (value) => {
        if (!value) {
          return null;
        }
        const isValid = new Date(value).getTime() > 0;
        if (!isValid) {
          return "Value must be a valid date";
        }
      },
      link: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
      },
      location_worked_on: (value) => {
        const isValid = value && value.trim().length > 0;
        if (!isValid) {
          return "Value must not be empty";
        }
      },
    },
    transformValues: (values) => {
      // convert the dates to ISO strings
      return {
        ...values,
        startDate: values.startDate
          ? new Date(values.startDate).toISOString()
          : "",
        endDate: values.endDate ? new Date(values.endDate).toISOString() : "",
      };
    },
  });

  const loadResume = async () => {
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
        setSkills(res.data.data.skills);
        setExperience(res.data.data.experience);
        setEducation(res.data.data.education);
        setProjects(res.data.data.projects);
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

  const addOrUpdateExperience = async () => {
    try {
      experienceForm.validate();
      const validated = experienceForm.isValid();
      if (!validated) {
        showNotification({
          title: "Error",
          message: "Please fill all required fields.",
          color: "red",
        });
        return;
      }
      if (editingExperience) {
        const res = await api.put(
          `/applications/resume/experience/${editingExperience}`,
          {
            ...experienceForm.getTransformedValues(),
          }
        );
        const success = res.data.success;
        if (!success) {
          showNotification({
            title: "Error",
            message: "An error occurred while updating experience.",
            color: "red",
          });
          return;
        }
        showNotification({
          title: "Success",
          message: "Experience updated successfully.",
        });
        experienceForm.reset();
        setEditingExperience(undefined);
        loadResume();
        return;
      }
      const res = await api.post("/applications/resume/experience", {
        ...experienceForm.getTransformedValues(),
      });
      const success = res.data.success;
      if (!success) {
        showNotification({
          title: "Error",
          message: "An error occurred while adding experience.",
          color: "red",
        });
        return;
      }

      showNotification({
        title: "Success",
        message: "Experience added successfully.",
      });
      experienceForm.reset();
      loadResume();
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "An error occurred while adding experience.",
        color: "red",
      });
    }
  };

  const setEditExperience = (experience: Experience) => {
    experienceForm.setValues({
      ...experience,
    });
    setEditingExperience(experience.id);
  };

  const deleteExperience = async (experience: Experience) => {
    try {
      if (editingExperience === experience.id) {
        setEditingExperience(undefined);
        experienceForm.reset();
      }

      const res = await api.delete(
        `/applications/resume/experience/${experience.id}`
      );

      const success = res.data.success;
      if (!success) {
        showNotification({
          title: "Error",
          message: "An error occurred while deleting experience.",
          color: "red",
        });
        return;
      }

      showNotification({
        title: "Success",
        message: "Experience deleted successfully.",
      });
      loadResume();
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "An error occurred while deleting experience.",
        color: "red",
      });
    }
  };

  const addOrUpdateEducation = async () => {
    try {
      educationForm.validate();
      const validated = educationForm.isValid();
      if (!validated) {
        showNotification({
          title: "Error",
          message: "Please fill all required fields.",
          color: "red",
        });
        return;
      }
      if (editingEducation) {
        const res = await api.put(
          `/applications/resume/education/${editingEducation}`,
          {
            ...educationForm.getTransformedValues(),
          }
        );
        const success = res.data.success;
        if (!success) {
          showNotification({
            title: "Error",
            message: "An error occurred while updating education.",
            color: "red",
          });
          return;
        }
        showNotification({
          title: "Success",
          message: "Education updated successfully.",
        });
        educationForm.reset();
        setEditingEducation(undefined);
        loadResume();
        return;
      }
      const res = await api.post("/applications/resume/education", {
        ...educationForm.getTransformedValues(),
      });
      const success = res.data.success;
      if (!success) {
        showNotification({
          title: "Error",
          message: "An error occurred while adding education.",
          color: "red",
        });
        return;
      }

      showNotification({
        title: "Success",
        message: "Education added successfully.",
      });
      educationForm.reset();
      loadResume();
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "An error occurred while adding education.",
        color: "red",
      });
    }
  };

  const setEditEducation = (education: Education) => {
    educationForm.setValues({
      ...education,
    });
    setEditingEducation(education.id);
  };

  const deleteEducation = async (education: Education) => {
    try {
      if (editingEducation === education.id) {
        setEditingEducation(undefined);
        educationForm.reset();
      }

      const res = await api.delete(
        `/applications/resume/education/${education.id}`
      );

      const success = res.data.success;
      if (!success) {
        showNotification({
          title: "Error",
          message: "An error occurred while deleting education.",
          color: "red",
        });
        return;
      }

      showNotification({
        title: "Success",
        message: "Education deleted successfully.",
      });
      loadResume();
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "An error occurred while deleting education.",
        color: "red",
      });
    }
  };

  const addOrUpdateProject = async () => {
    try {
      projectForm.validate();
      const validated = projectForm.isValid();
      if (!validated) {
        showNotification({
          title: "Error",
          message: "Please fill all required fields.",
          color: "red",
        });
        return;
      }
      if (editingProject) {
        const res = await api.put(
          `/applications/resume/project/${editingProject}`,
          {
            ...projectForm.getTransformedValues(),
          }
        );
        const success = res.data.success;
        if (!success) {
          showNotification({
            title: "Error",
            message: "An error occurred while updating project.",
            color: "red",
          });
          return;
        }
        showNotification({
          title: "Success",
          message: "Project updated successfully.",
        });
        projectForm.reset();
        setEditingProject(undefined);
        loadResume();
        return;
      }
      const res = await api.post("/applications/resume/project", {
        ...projectForm.getTransformedValues(),
      });
      const success = res.data.success;
      if (!success) {
        showNotification({
          title: "Error",
          message: "An error occurred while adding project.",
          color: "red",
        });
        return;
      }

      showNotification({
        title: "Success",
        message: "Project added successfully.",
      });
      projectForm.reset();
      loadResume();
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "An error occurred while adding project.",
        color: "red",
      });
    }
  };

  const setEditProject = (project: Project) => {
    projectForm.setValues({
      ...project,
    });
    setEditingProject(project.id);
  };

  const deleteProject = async (project: Project) => {
    try {
      if (editingProject === project.id) {
        setEditingProject(undefined);
        projectForm.reset();
      }

      const res = await api.delete(
        `/applications/resume/project/${project.id}`
      );

      const success = res.data.success;
      if (!success) {
        showNotification({
          title: "Error",
          message: "An error occurred while deleting project.",
          color: "red",
        });
        return;
      }

      showNotification({
        title: "Success",
        message: "Project deleted successfully.",
      });
      loadResume();
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "An error occurred while deleting project.",
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

  return (
    <div className={styles.resume}>
      {loading && <Loader />}
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
        {skills.length > 0 && (
          <>
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
          </>
        )}
        <Grid.Col span={12} />
        <Grid.Col span={12}>
          <Title order={3}>{editingSkill ? "Update" : "Add"} Skill</Title>
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
              {editingSkill ? "Update" : "Add"}
            </Button>
          </Group>
        </Grid.Col>
        <Grid.Col span={12} />
        {experience.length > 0 && (
          <>
            <Grid.Col span={12}>
              <Title order={3}>Your Experience</Title>
            </Grid.Col>
            <Grid.Col sm={12} md={12}>
              <Table>
                <thead>
                  <tr>
                    <th>Title</th>
                    {!isMobile && <th>Description</th>}
                    <th>Company</th>
                    {!isMobile && <th>Location</th>}
                    <th>Timeline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {experience.map((experience, index) => (
                    <tr key={index}>
                      <td>{experience.title}</td>
                      {!isMobile && <td>{experience.description}</td>}
                      <td>{experience.company}</td>
                      {!isMobile && <td>{experience.location}</td>}
                      <td>
                        {experience.startDate
                          ? new Date(experience.startDate).toLocaleDateString()
                          : ""}{" "}
                        -{" "}
                        {experience.endDate
                          ? new Date(experience.endDate).toLocaleDateString()
                          : "Present"}
                      </td>
                      <td>
                        <Flex gap={8}>
                          <ActionIcon
                            onClick={() => setEditExperience(experience)}
                            loading={
                              editingExperience === experience.id && loading
                            }
                            variant="filled"
                          >
                            <PencilSimple />
                          </ActionIcon>
                          <ActionIcon
                            onClick={() => deleteExperience(experience)}
                            loading={
                              editingExperience === experience.id && loading
                            }
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
          </>
        )}
        <Grid.Col span={12} />
        <Grid.Col span={12}>
          <Title order={3}>
            {editingExperience ? "Update" : "Add"} Experience
          </Title>
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <TextInput
            label="Title"
            placeholder="Experience title..."
            required
            {...experienceForm.getInputProps("title")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <TextInput
            label="Company"
            placeholder="Company name..."
            required
            {...experienceForm.getInputProps("company")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <TextInput
            label="Location"
            placeholder="Company location..."
            required
            {...experienceForm.getInputProps("location")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <Textarea
            label="Description"
            placeholder="Describe your experience..."
            required
            {...experienceForm.getInputProps("description")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <DateInput
            label="Start Date"
            placeholder="Start date..."
            required
            disabled={disabled}
            value={
              experienceForm.values.startDate
                ? new Date(experienceForm.values.startDate)
                : undefined
            }
            onChange={(date) => {
              if (!date) {
                return;
              }
              experienceForm.setValues({
                ...experienceForm.values,
                startDate: date.toISOString(),
              });
            }}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <DateInput
            label="End Date"
            placeholder="End date..."
            disabled={disabled}
            value={
              experienceForm.values.endDate
                ? new Date(experienceForm.values.endDate)
                : undefined
            }
            onChange={(date) => {
              if (!date) {
                return;
              }
              experienceForm.setValues({
                ...experienceForm.values,
                endDate: date.toISOString(),
              });
            }}
          />
        </Grid.Col>
        <Grid.Col span={12} />
        <Grid.Col>
          <Group position="right">
            <Button
              onClick={() => addOrUpdateExperience()}
              type="button"
              variant="filled"
              disabled={disabled}
            >
              {editingExperience ? "Update" : "Add"}
            </Button>
          </Group>
        </Grid.Col>
        <Grid.Col span={12} />
        {education.length > 0 && (
          <>
            <Grid.Col span={12}>
              <Title order={3}>Your Education</Title>
            </Grid.Col>
            <Grid.Col sm={12} md={12}>
              <Table>
                <thead>
                  <tr>
                    <th>Degree</th>
                    {!isMobile && <th>Description</th>}
                    <th>School</th>
                    {!isMobile && <th>Location</th>}
                    <th>Timeline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {education.map((education, index) => (
                    <tr key={index}>
                      <td>{education.degree}</td>
                      {!isMobile && <td>{education.description}</td>}
                      <td>{education.school}</td>
                      {!isMobile && <td>{education.location}</td>}
                      <td>
                        {education.startDate
                          ? new Date(education.startDate).toLocaleDateString()
                          : ""}{" "}
                        -{" "}
                        {education.endDate
                          ? new Date(education.endDate).toLocaleDateString()
                          : "Present"}
                      </td>
                      <td>
                        <Flex gap={8}>
                          <ActionIcon
                            onClick={() => setEditEducation(education)}
                            loading={
                              editingEducation === education.id && loading
                            }
                            variant="filled"
                          >
                            <PencilSimple />
                          </ActionIcon>
                          <ActionIcon
                            onClick={() => deleteEducation(education)}
                            loading={
                              editingEducation === education.id && loading
                            }
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
          </>
        )}
        <Grid.Col span={12} />
        <Grid.Col span={12}>
          <Title order={3}>
            {editingEducation ? "Update" : "Add"} Education
          </Title>
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <TextInput
            label="Degree"
            placeholder="Degree name..."
            required
            {...educationForm.getInputProps("degree")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <TextInput
            label="School"
            placeholder="School name..."
            required
            {...educationForm.getInputProps("school")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <TextInput
            label="Location"
            placeholder="School location..."
            required
            {...educationForm.getInputProps("location")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <Textarea
            label="Description"
            placeholder="Describe your education..."
            required
            {...educationForm.getInputProps("description")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <DateInput
            label="Start Date"
            placeholder="Start date..."
            required
            disabled={disabled}
            value={
              educationForm.values.startDate
                ? new Date(educationForm.values.startDate)
                : undefined
            }
            onChange={(date) => {
              if (!date) {
                return;
              }
              educationForm.setValues({
                ...educationForm.values,
                startDate: date.toISOString(),
              });
            }}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <DateInput
            label="End Date"
            placeholder="End date..."
            disabled={disabled}
            value={
              educationForm.values.endDate
                ? new Date(educationForm.values.endDate)
                : undefined
            }
            onChange={(date) => {
              if (!date) {
                return;
              }
              educationForm.setValues({
                ...educationForm.values,
                endDate: date.toISOString(),
              });
            }}
          />
        </Grid.Col>
        <Grid.Col span={12} />
        <Grid.Col>
          <Group position="right">
            <Button
              onClick={() => addOrUpdateEducation()}
              type="button"
              variant="filled"
              disabled={disabled}
            >
              {editingEducation ? "Update" : "Add"}
            </Button>
          </Group>
        </Grid.Col>
        <Grid.Col span={12} />
        {projects.length > 0 && (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                {!isMobile && <th>Description</th>}
                <th>Timeline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index}>
                  <td>{project.name}</td>
                  {!isMobile && <td>{project.description}</td>}
                  <td>
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : ""}{" "}
                    -{" "}
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "Present"}
                  </td>
                  <td>
                    <Flex gap={8}>
                      <ActionIcon
                        onClick={() => setEditProject(project)}
                        loading={editingProject === project.id && loading}
                        variant="filled"
                      >
                        <PencilSimple />
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => deleteProject(project)}
                        loading={editingProject === project.id && loading}
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
        )}
        <Grid.Col span={12} />
        <Grid.Col span={12}>
          <Title order={3}>{editingProject ? "Update" : "Add"} Project</Title>
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <TextInput
            label="Name"
            placeholder="Project name..."
            required
            {...projectForm.getInputProps("name")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <Textarea
            label="Description"
            placeholder="Describe your project..."
            required
            {...projectForm.getInputProps("description")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <TextInput
            label="Link"
            placeholder="Project link..."
            required
            {...projectForm.getInputProps("link")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <TextInput
            label="Location Worked On"
            placeholder="Project location..."
            required
            {...projectForm.getInputProps("location_worked_on")}
            disabled={disabled}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <DateInput
            label="Start Date"
            placeholder="Start date..."
            required
            disabled={disabled}
            value={
              projectForm.values.startDate
                ? new Date(projectForm.values.startDate)
                : undefined
            }
            onChange={(date) => {
              if (!date) {
                return;
              }
              projectForm.setValues({
                ...projectForm.values,
                startDate: date.toISOString(),
              });
            }}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={4}>
          <DateInput
            label="End Date"
            placeholder="End date..."
            disabled={disabled}
            value={
              projectForm.values.endDate
                ? new Date(projectForm.values.endDate)
                : undefined
            }
            onChange={(date) => {
              if (!date) {
                return;
              }
              projectForm.setValues({
                ...projectForm.values,
                endDate: date.toISOString(),
              });
            }}
          />
        </Grid.Col>
        <Grid.Col span={12} />
        <Grid.Col>
          <Group position="right">
            <Button
              onClick={() => addOrUpdateProject()}
              type="button"
              variant="filled"
              disabled={disabled}
            >
              {editingProject ? "Update" : "Add"}
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default Resume;
