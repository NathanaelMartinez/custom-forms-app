// components/TemplateList.tsx
import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Template } from "../../types";

interface TemplateListProps {
  title: string;
  templates: Template[];
  type: "top" | "recent"; // could be top or recent templates
}

const TemplateList: React.FC<TemplateListProps> = ({ title, templates, type }) => {
  return (
    <section className={`${type}-templates`}>
      <h3 className="mb-4 text-start fw-bold">{title}</h3>

      {type === "top" ? (
        <Row className="justify-content-center">
          {templates.map((template) => (
            <Col key={template.id} className="mb-4">
              <Card className="template-card">
                <Card.ImgOverlay className="d-flex flex-column justify-content-end">
                  <Card.Title className="fw-bold">{template.title}</Card.Title>
                  <Card.Text>Filled Forms: {template.filledForms}</Card.Text>
                </Card.ImgOverlay>
              </Card>
            </Col>
          ))}
        </Row>
      ) : ( // else recent
        <Row>
          {templates.map((template) => (
            <Col key={template.id} sm={6} md={4} lg={2} className="mb-4">
              <Card className="template-card">
                <Card.ImgOverlay className="d-flex flex-column justify-content-end">
                  <Card.Title className="fw-bold">{template.title}</Card.Title>
                  <Card.Text>Date Created: {template.createdAt.toLocaleDateString()}</Card.Text>
                </Card.ImgOverlay>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
};

export default TemplateList;
