// components/TemplateList.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import { format } from "date-fns";
import { Template } from "../../types";

interface TemplateListProps {
  title: string;
  templates: Template[];
  type: "top" | "recent"; // could be top or recent templates
}

const TemplateList: React.FC<TemplateListProps> = ({
  title,
  templates,
  type,
}) => {
  const navigate = useNavigate();

  const handleCardClick = (templateId: string) => {
    navigate(`/forms/${templateId}`);
  };

  return (
    <section className={`${type}-templates`}>
      <h3 className="mb-4 text-start fw-bold fs-2">{title}</h3>

      {type === "top" ? (
        <Row className="justify-content-center">
          {templates.map((template) => (
            <Col key={template.id} className="mb-4">
              <Card
                className="template-card"
                onClick={() => handleCardClick(template.id)} 
                style={{ cursor: "pointer" }} // make pointer indicate clickable
              >
                <Card.ImgOverlay className="d-flex flex-column justify-content-end">
                  <Card.Title className="fw-bold">{template.title}</Card.Title>
                  <Card.Text>
                    Filled Forms: {template.responses?.length}
                  </Card.Text>
                </Card.ImgOverlay>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        // else recent
        <Row>
          {templates.map((template) => (
            <Col key={template.id} sm={6} md={4} lg={2} className="mb-4">
              <Card
                className="template-card"
                onClick={() => handleCardClick(template.id)}
                style={{ cursor: "pointer" }}
              >
                <Card.ImgOverlay className="d-flex flex-column justify-content-end">
                  <Card.Title className="fw-bold">{template.title}</Card.Title>
                  <Card.Text>
                    Uploaded:{" "}
                    {format(new Date(template.createdAt), "MM-dd-yyyy")}
                  </Card.Text>
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
