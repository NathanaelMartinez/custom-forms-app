import React, { useEffect, useRef, useCallback } from "react";
import { dropTargetForElements, monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import invariant from "tiny-invariant";
import QuestionCard from "./question-card";
import { Question } from "../../types";

interface QuestionListProps {
  questions: Question[];
  containerId: string;
  onChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (question: Question) => void;
  onOptionChange: (id: string, index: number, value: string) => void;
  onAddOption: (id: string) => void;
  onToggleDisplayInTable: (id: string, value: boolean) => void;
  onReorder: (newQuestions: Question[]) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onChange,
  onDelete,
  onDuplicate,
  onOptionChange,
  onAddOption,
  onToggleDisplayInTable,
  onReorder,
  containerId,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // function to handle drop events and reorder cards
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrop = useCallback(({ source, location }: {source: any; location: any}) => { // source is info on card, and location is where card being dropped
    const numberOfDropTargets = location.current.dropTargets.length; // checks how many things card was dropped on
    console.log("Source object:", source);
    console.log("Location object:", location);
    
    // drop on card instead of container
    if (numberOfDropTargets === 2) {
      const [destinationCardRecord] = location.current.dropTargets;
  
      // find source id/idx and destination id/idx
      const draggedCardId = source.data.cardId;
      const sourceIndex = questions.findIndex((q) => q.id === draggedCardId);
      const dropTargetCardId = destinationCardRecord.data.cardId;
      const destinationIndex = questions.findIndex((q) => q.id === dropTargetCardId);
  
      console.log(`Dropped on card ${dropTargetCardId}, Source index: ${sourceIndex}, Destination index: ${destinationIndex}`);
      
      // if valid idx, then reorder
      if (sourceIndex !== -1 && destinationIndex !== -1 && sourceIndex !== destinationIndex) {
        const reorderedQuestions = reorder({
          list: questions,
          startIndex: sourceIndex,
          finishIndex: destinationIndex,
        });
  
        // update parent state
        onReorder(reorderedQuestions);
      }
    } else if (numberOfDropTargets === 1) {
      // handle when card is dropped into empty space or container
      console.log("Dropped on the container or empty space"); // TODO: figure out what to do when this happens
    }
  }, [questions, onReorder]);
  

  // monitor for drop events
  useEffect(() => {
    if (questions.length > 0) {
      return monitorForElements({
        onDrop: handleDrop,
      });
    }
  }, [handleDrop, questions]);

  // set up drop target for entire list
  useEffect(() => {
    const containerEl = containerRef.current;
    invariant(containerEl);

    console.log("Setting up dropTargetForElements");

    return dropTargetForElements({
      element: containerEl,
      onDragEnter: () => console.log("onDragEnter on list"),
      onDragLeave: () => console.log("onDragLeave on list"),
      onDrop: () => console.log("Dropped in container"),
      getData: () => ({ containerId }),
    });
  }, [containerId]);

  return (
    <div ref={containerRef}>
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
          dropTargetProps={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onDragEnter: (args: any) => console.log("onDragEnter", args),
            onDragLeave: () => console.log("onDragLeave"),
            onDrop: () => console.log("Dropped on card", question.id),
            getData: () => ({ cardId: question.id }),
          }}
        />
      ))}
    </div>
  );
};

export default QuestionList;
