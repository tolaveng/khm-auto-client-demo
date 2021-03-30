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

export const pad6 = (number: number): string => {
  if (number<=999999) {
     return ("00000"+number).slice(-6);
  }
  return number.toString();
}

export const pad8 = (number: number): string => {
  if (number<=99999999) {
     return ("0000000"+number).slice(-8);
  }
  return number.toString();
}