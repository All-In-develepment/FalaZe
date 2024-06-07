import { addDays, addWeeks, addMonths, parseISO, format } from "date-fns";

export const addNewInterval = (
  dateString: string,
  intervalType: string,
  index: number,
  intervalValue: number
): string => {
  const date = parseISO(dateString);

  let newDate: Date;

  switch (intervalType) {
    case "dias":
      newDate = addDays(date, intervalValue * (index + 1));
      break;
    case "semanas":
      newDate = addWeeks(date, intervalValue * (index + 1));
      break;
    case "meses":
      newDate = addMonths(date, intervalValue * (index + 1));
      break;
    default:
      throw new Error("Intervalo inválido");
  }
  return format(newDate, "yyyy-MM-dd'T'HH:mm");
};
