import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Toast, ToastContainer } from "react-bootstrap";
import { createJiraTicket } from "../services/ticket-service";
import { useAuth } from "./auth-context";
import { Template } from "../types";
import { fetchTemplateById } from "../services/template-service";

// define context properties
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

// create support modal context
const SupportModalContext = createContext<SupportModalContextProps | undefined>(
  undefined
);

// provider component for support modal context
export const SupportModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [summary, setSummary] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [templateTitle, setTemplateTitle] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const path = location.pathname;

    // match url to set appropriate title
    const matchForm = path.match(/^\/forms\/([^/]+)$/);
    const matchTemplate = path.match(/^\/templates\/([^/]+)$/);

    if (matchForm) {
      fetchTemplateById(matchForm[1])
        .then((form: Template) => setTemplateTitle(form.title))
        .catch(() => console.error("failed to fetch form"));
    } else if (matchTemplate) {
      setTemplateTitle(matchTemplate[1]);
    }
  }, [location]);

  const handleSupportSubmit = async () => {
    try {
      const pageLink = window.location.href;

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

      setToastMessage(
        response?.ticketLink || "report submitted without ticket link"
      );
      setIsError(!response?.ticketLink);
      setSummary("");
      setPriority("Medium");
      setShowSupportModal(false);
    } catch {
      setToastMessage("failed to submit report. please try again.");
      setIsError(true);
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

      {/* toast for showing success/failure messages */}
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
                  View ticket
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

// hook to use support modal context
export const useSupportModal = (): SupportModalContextProps => {
  const context = useContext(SupportModalContext);
  if (!context)
    throw new Error("useSupportModal must be used within SupportModalProvider");
  return context;
};
