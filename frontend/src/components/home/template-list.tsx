import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import { format } from "date-fns";
import { Template } from "../../types";
import {
  ChatDots,
  ChatLeft,
  Clipboard2Check,
  Heart,
} from "react-bootstrap-icons";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

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
                <Card.Img
                  variant="top"
                  src="https://placehold.co/600x820/f4f4f4/FFF?text=Template"
                  alt="Template placeholder"
                />
                <Card.ImgOverlay className="d-flex flex-column justify-content-end">
                  <div
                    className="position-absolute"
                    style={{ top: "10px", right: "10px" }}
                  >
                    <Heart className="me-1" color="red" />
                    <span>{template.likes}</span>
                  </div>
                  <Card.Title className="fw-bold">{template.title}</Card.Title>
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {template.description
                      ? template.description.split(" ").slice(0, 5).join(" ") +
                        "..."
                      : ""}
                  </ReactMarkdown>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Clipboard2Check className="me-1" />
                      <span>{template.responses?.length}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <ChatLeft className="me-1" />
                      <span>{template.comments?.length}</span>
                    </div>
                  </div>
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
                <Card.Img
                  variant="top"
                  src="https://placehold.co/600x820/f4f4f4/FFF?text=Template"
                  alt="Template placeholder"
                />
                <Card.ImgOverlay className="d-flex flex-column justify-content-end">
                  <Card.Title className="fw-bold">{template.title}</Card.Title>
                  <Card.Text>
                    Uploaded:{" "}
                    {format(new Date(template.createdAt), "MM-dd-yyyy")}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="d-flex align-items-center">
                      <Clipboard2Check className="me-1" />
                      <span>{template.responses?.length}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <ChatDots className="me-1" />
                      <span>{template.comments?.length}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <Heart className="me-1" color="red" />
                      <span>{template.likes}</span>
                    </div>
                  </div>
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
