export const dateAdjustment = (date: string) => {
  try {
    // if (date.includes("due")) {
    // const  = date as string;
    // console.log(dateee);

    const oldDate = new Date(date);
    console.log(oldDate.setMonth(oldDate.getMonth() + 1));

    oldDate.setMonth(oldDate.getMonth() + 1);

    console.log("na datefunc", oldDate);

    // const [oldDay] = String(date.split("T"));
    // console.log(oldDay);

    // const oldDate = new Date(oldDay);

    // console.log(oldDate);

    // oldDate.setMonth(oldDate.getMonth() + 1);

    // return oldDate;
    // }

    // const [oldDay] = date.split("T");
    // console.log("ou ca");

    // const oldDate = new Date(oldDay);

    // oldDate.setDate(oldDate.getDate() + 3);

    // const year = oldDate.getFullYear();
    // const month = String(oldDate.getMonth() + 1).padStart(2, "0");
    // const day = String(oldDate.getDate()).padStart(2, "0");

    // const newDate = `${year}-${month}-${day}`;

    // return newDate;
  } catch (error) {
    console.log(error);
  }
};
