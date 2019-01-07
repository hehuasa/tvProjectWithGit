export const water = () => {
  const index = 0;
  const array = [];
  while (index < 20) {
    const key = `a${index}`;
    const value = Math.random() * 10;
    array.push({
      [key]: value,
    });
  }
  return array;
};
