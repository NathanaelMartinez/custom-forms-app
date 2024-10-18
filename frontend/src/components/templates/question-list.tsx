import React from "react";
import { Question } from "../../types";
import QuestionCard from "./question-card";

interface QuestionListProps {
  questions: Question[];
  onChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (question: Question) => void;
  onOptionChange: (id: string, index: number, value: string) => void;
  onAddOption: (id: string) => void;
  onToggleDisplayInTable: (id: string, value: boolean) => void; // New prop
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onChange,
  onDelete,
  onDuplicate,
  onOptionChange,
  onAddOption,
  onToggleDisplayInTable,
}) => (
  <>
    {questions.map((question) => (
      <QuestionCard
        key={question.id}
        question={question}
        onChange={onChange}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onOptionChange={onOptionChange}
        onAddOption={onAddOption}
        onToggleDisplayInTable={onToggleDisplayInTable}
      />
    ))}
  </>
);

export default QuestionList;
