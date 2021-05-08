import {FilterType} from '../const.js';

export const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.user.watchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.user.watched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.user.favorite),
};
