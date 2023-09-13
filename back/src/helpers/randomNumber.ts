export const RandomNumber = () => {
  const min = Math.pow(10, 18);
  const max = Math.pow(10, 19) - 1;

  const random = Math.floor(Math.random() * (max - min + 1)) + min;

  return random.toString();
};
