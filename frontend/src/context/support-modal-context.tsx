import React, { createContext, useContext, useState } from "react";
import { Button, Toast, ToastContainer } from "react-bootstrap";
import { createJiraTicket } from "../services/ticket-service";
import { useAuth } from "./auth-context";

interface SupportModalContextProps {
  showSupportModal: boolean;
  summary: string;
  priority: string;
  templateTitle: string;
  setShowSupportModal: (show: boolean) => void;
  setSummary: (summary: string) => void;
  setPriority: (priority: string) => void;
  setTemplateTitle: (title: string) => void; // expose this function to set template title
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
  const [templateTitle, setTemplateTitle] = useState<string>(""); // set dynamically as needed
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { user } = useAuth();

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

      console.log("response:", response);

      setToastMessage(
        response.ticketLink || "Report submitted, but no ticket link available."
      );
      setIsError(false);

      // reset values
      setSummary("");
      setPriority("Medium");
      setShowSupportModal(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      setToastMessage("Failed to submit report. Please try again.");
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
        setTemplateTitle, // expose setter to manage templateTitle externally
        handleSupportSubmit,
      }}
    >
      {children}

      {/* Toast notification for success/failure */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={10000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>
            {!isError ? (
              <>
                <div>Report submitted successfully!</div>
                {toastMessage && isError === false ? (
                  <Button
                    variant="link"
                    href={toastMessage}
                    target="_blank"
                    className="p-0"
                  >
                    View Ticket
                  </Button>
                ) : (
                  <span>{toastMessage}</span>
                )}
              </>
            ) : (
              <span>{toastMessage}</span>
            )}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </SupportModalContext.Provider>
  );
};

export const useSupportModal = (): SupportModalContextProps => {
  const context = useContext(SupportModalContext);
  if (!context) {
    throw new Error(
      "useSupportModal must be used within a SupportModalProvider"
    );
  }
  return context;
};
