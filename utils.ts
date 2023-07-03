export const waitCondition = (
  condition: () => boolean,
  delay = 1,
): Promise<void> => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (condition()) {
        resolve();
        clearInterval(interval);
      }
    }, delay);
  });
};
