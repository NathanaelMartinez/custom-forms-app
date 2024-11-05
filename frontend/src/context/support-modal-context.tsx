import React, { createContext, useContext, useState } from "react";
import { createJiraTicket } from "../services/ticket-service";

interface SupportModalContextProps {
  showSupportModal: boolean;
  summary: string;
  priority: string;
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

  const handleSupportSubmit = async () => {
    try {
      await createJiraTicket(summary, priority);
      alert("Ticket created successfully!"); // TODO: remove debug alert
      setSummary("");
      // return to defaults
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
