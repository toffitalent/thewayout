interface ValidateStartAtProps {
  startAtMonth?: string;
  startAtYear?: string;
  fieldName: string;
}

export const validateStartAt = ({ startAtMonth, startAtYear, fieldName }: ValidateStartAtProps) => {
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const errorMessage =
    fieldName === 'startAtMonth' ? 'Date must be in the present or the future' : ' ';

  if (startAtYear && startAtMonth) {
    if (Number(startAtYear) > thisYear) {
      return undefined;
    }
    return Number(startAtMonth) >= thisMonth + 1 ? undefined : errorMessage;
  }
  return undefined;
};
