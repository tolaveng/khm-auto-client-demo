export const GetToDay = (): string => {
  const today = new Date();
  const d = (today.getDate() < 10 ? "0" : "") + today.getDate();
  const m = (today.getMonth() + 1 < 10 ? "0" : "") + (today.getMonth() + 1);
  const y = today.getFullYear();
  const x = String(y + "-" + m + "-" + d);
  return x;
};


export const RoundToTwo = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}