const ratingMap = new Map();

ratingMap.set({
  from: 0,
  to: 0,
}, '');

ratingMap.set({
  from: 1,
  to: 10,
}, 'Novice');

ratingMap.set({
  from: 11,
  to: 20,
}, 'Fan');

ratingMap.set({
  from: 21,
  to: Infinity,
}, 'Movie Buff');

export const calculateProfileRating = (movies) => {
  const watchedFilmsCount = movies.filter((movie) => movie.user.watched).length;

  for (const value of ratingMap) {
    if (watchedFilmsCount >= value[0].from && watchedFilmsCount <= value[0].to) {
      return value[1];
    }
  }
};
