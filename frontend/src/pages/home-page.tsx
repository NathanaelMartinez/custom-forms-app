import React from "react";
import { Button, Container, Tab, Tabs } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
import AppNavBar from "../components/app-nav-bar";
import CallToAction from "../components/call-to-action-banner";
import TemplateList from "../components/template-list";
import { Template } from "../types";
import Footer from "../components/app-footer";

const HomePage: React.FC = () => {
  // const navigate = useNavigate();

  // placeholder data for top 5 all-time templates
  const popularTemplates: Template[] = [
    {
      id: "1",
      name: "Top Form Template 1",
      filledForms: 120,
      description: "A top template",
      author: {
        id: "user1",
        username: "User One",
        email: "user1@example.com",
        role: "user",
        status: "active",
        templates: [],
        createdAt: new Date(),
      },
      questions: [],
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Top Form Template 2",
      filledForms: 95,
      description: "A top template",
      author: {
        id: "user2",
        username: "User Two",
        email: "user2@example.com",
        role: "user",
        status: "active",
        templates: [],
        createdAt: new Date(),
      },
      questions: [],
      createdAt: new Date(),
    },
    {
      id: "3",
      name: "Top Form Template 3",
      filledForms: 85,
      description: "A top template",
      author: {
        id: "user3",
        username: "User Three",
        email: "user3@example.com",
        role: "user",
        status: "active",
        templates: [],
        createdAt: new Date(),
      },
      questions: [],
      createdAt: new Date(),
    },
    {
      id: "4",
      name: "Top Form Template 4",
      filledForms: 70,
      description: "A top template",
      author: {
        id: "user4",
        username: "User Four",
        email: "user4@example.com",
        role: "user",
        status: "active",
        templates: [],
        createdAt: new Date(),
      },
      questions: [],
      createdAt: new Date(),
    },
    {
      id: "5",
      name: "Top Form Template 5",
      filledForms: 50,
      description: "A top template",
      author: {
        id: "user5",
        username: "User Five",
        email: "user5@example.com",
        role: "user",
        status: "active",
        templates: [],
        createdAt: new Date(),
      },
      questions: [],
      createdAt: new Date(),
    },
  ];

  // placeholder data for recent templates
  const recentTemplates: Template[] = [
    {
      id: "6",
      name: "Recent Form Template 1",
      description: "A recent template",
      filledForms: 0,
      author: {
        id: "user6",
        username: "User Six",
        email: "user6@example.com",
        role: "user",
        status: "active",
        templates: [],
        createdAt: new Date(),
      },
      questions: [],
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "7",
      name: "Recent Form Template 2",
      description: "A recent template",
      filledForms: 0,
      author: {
        id: "user7",
        username: "User Seven",
        email: "user7@example.com",
        role: "user",
        status: "active",
        templates: [],
        createdAt: new Date(),
      },
      questions: [],
      createdAt: new Date("2024-01-05"),
    },
    {
      id: "8",
      name: "Recent Form Template 3",
      description: "A recent template",
      filledForms: 0,
      author: {
        id: "user8",
        username: "User Eight",
        email: "user8@example.com",
        role: "user",
        status: "active",
        templates: [],
        createdAt: new Date(),
      },
      questions: [],
      createdAt: new Date("2024-01-10"),
    },
  ];

  return (
    <>
      <AppNavBar />

      <Container className="p-4 home-page-crawl">
        <TemplateList
          title="Top Templates"
          templates={popularTemplates}
          type="top"
        />
      </Container>

      <CallToAction />

      <Container className="p-4 home-page-crawl">
        <Tabs
          defaultActiveKey="new-templates"
          className="tabs-container rounded"
        >
          <Tab
            eventKey="new-templates"
            title={<span className="fw-bold fs-3">New Templates</span>}
            className="recent-templates-container p-4"
          >
            <TemplateList title="" templates={recentTemplates} type="recent" />
            <div className="d-flex justify-content-center mt-4">
              <Button variant="primary" className="custom-primary-btn">
                Load More Templates
              </Button>
            </div>
          </Tab>
        </Tabs>
      </Container>

      <Footer />
    </>
  );
};

export default HomePage;
