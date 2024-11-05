import React, { createContext, useContext, useState } from "react";
import { createJiraTicket } from "../services/ticket-service";
import { useAuth } from "./auth-context";

interface SupportModalContextProps {
  showSupportModal: boolean;
  summary: string;
  priority: string;
  templateTitle: string;
  setTemplateTitle: (title: string) => void;
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
  const [templateTitle, setTemplateTitle] = useState<string>(""); // dynamic template title
  const { user } = useAuth();

  const handleSupportSubmit = async () => {
    try {
      const pageLink = window.location.href; // capture current page URL

      await createJiraTicket(
        summary,
        priority,
        {
          email: user?.email || "no-email@domain.com", // provide fallback value
          username: user?.username || "Unknown User",
        },
        pageLink,
        templateTitle
      ); 

      alert("Ticket created successfully!");
      // reset values
      setSummary("");
      setPriority("Medium");
      setShowSupportModal(false);
    } catch (error) {
      alert(`Failed to create ticket: ${error}`);
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
        setTemplateTitle,
        handleSupportSubmit,
      }}
    >
      {children}
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
