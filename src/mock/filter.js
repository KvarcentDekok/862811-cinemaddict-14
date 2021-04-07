const movieToFilterMap = {
  watchlist: (movies) => movies.filter((movie) => movie.user.watchlist).length,
  history: (movies) => movies.filter((movie) => movie.user.watched).length,
  favorites: (movies) => movies.filter((movie) => movie.user.favorite).length,
};

export const generateFilter = (movies) => {
  return Object.entries(movieToFilterMap).map(([filterName, countMovies]) => {
    return {
      name: filterName,
      count: countMovies(movies),
    };
  });
};
