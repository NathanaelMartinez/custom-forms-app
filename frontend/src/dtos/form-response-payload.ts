export interface FormResponsePayload {
  templateId: string; // ID of the template being submitted
  answers: {
    [questionId: string]: string | number | string[]; // Answer can be string / number / array (checkboxes)
  };
}
