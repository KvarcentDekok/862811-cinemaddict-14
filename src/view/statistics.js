export const createStatisticsTemplate = (moviesCount) => {
  return `<p>${moviesCount.toLocaleString()} movies inside</p>`;
};
