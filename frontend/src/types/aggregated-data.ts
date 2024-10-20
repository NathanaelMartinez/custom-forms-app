interface NumericData {
  [questionId: string]: {
    questionText: string;
    average?: number;
    min?: number;
    max?: number;
  };
}

interface TextData {
  [questionId: string]: {
    questionText: string;
    counts?: Record<string, number>;
  };
}

interface CheckboxData {
  [questionId: string]: {
    questionText: string;
    optionCounts?: Record<string, number>;
  };
}

export interface AggregatedData {
  responseCount: number;
  numericData: NumericData;
  textData: TextData;
  checkboxData: CheckboxData;
}
