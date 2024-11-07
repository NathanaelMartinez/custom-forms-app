import React, { createContext, useContext, useEffect, useState } from "react";
import { Button, Toast, ToastContainer } from "react-bootstrap";
import { createJiraTicket } from "../services/ticket-service";
import { useAuth } from "./auth-context";
import { Template } from "../types";
import { fetchTemplateById } from "../services/template-service";

interface SupportModalContextProps {
  showSupportModal: boolean;
  summary: string;
  priority: string;
  templateTitle: string;
  setShowSupportModal: (show: boolean) => void;
  setSummary: (summary: string) => void;
  setPriority: (priority: string) => void;
  handleSupportSubmit: () => Promise<void>;
}

const SupportModalContext = createContext<SupportModalContextProps | undefined>(
  undefined
);

export const SupportModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [summary, setSummary] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [templateTitle, setTemplateTitle] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const path = location.pathname;

    // regex for appropriate templateTitle
    const matchForm = path.match(/^\/forms\/([^/]+)$/);
    const matchTemplate = path.match(/^\/templates\/([^/]+)$/);

    if (matchForm) {
      const formId = matchForm[1];
      fetchTemplateById(formId)
        .then((form: Template) => {
          setTemplateTitle(form.title); // set form title
        })
        .catch((error) => {
          console.error("Failed to fetch form:", error);
        });
    } else if (matchTemplate) {
      const templateId = matchTemplate[1];
      setTemplateTitle(templateId); // just set template ID
    }
  }, [location]);

  const handleSupportSubmit = async () => {
    try {
      const pageLink = window.location.href; // capture current page URL

      const response = await createJiraTicket(
        summary,
        priority,
        {
          email: user?.email || "no-email@domain.com",
          username: user?.username || "Unknown User",
        },
        pageLink,
        templateTitle
      );

      if (response?.ticketLink) {
        setToastMessage(response.ticketLink);
        setIsError(false); // Ensure it's a success state
      } else {
        throw new Error("Ticket link missing in response.");
      }

      // reset values
      setSummary("");
      setPriority("Medium");
      setShowSupportModal(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setToastMessage("Failed to submit report. Please try again.");
      setIsError(true); // Set as error state
    } finally {
      setShowToast(true);
    }
  };

  return (
    <SupportModalContext.Provider
      value={{
        showSupportModal,
        setShowSupportModal,
        summary,
        setSummary,
        priority,
        setPriority,
        templateTitle,
        handleSupportSubmit,
      }}
    >
      {children}

      {/* Toast for showing success/failure messages */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>
            {!isError ? (
              <>
                <div>Report submitted successfully!</div>
                <Button
                  variant="link"
                  href={toastMessage}
                  target="_blank"
                  className="p-0"
                >
                  View Ticket
                </Button>
              </>
            ) : (
              toastMessage
            )}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </SupportModalContext.Provider>
  );
};

export const useSupportModal = (): SupportModalContextProps => {
  const context = useContext(SupportModalContext);
  if (context === undefined) {
    throw new Error(
      "useSupportModal must be used within a SupportModalProvider"
    );
  }
  return context;
};
