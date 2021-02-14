export const getToDay = (): string => {
  const today = new Date();
  const d = (today.getDate() < 10 ? "0" : "") + today.getDate();
  const m = (today.getMonth() + 1 < 10 ? "0" : "") + (today.getMonth() + 1);
  const y = today.getFullYear();
  const x = String(y + "-" + m + "-" + d);
  return x;
};
