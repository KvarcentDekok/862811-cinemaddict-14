import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import {DESCRIPTION_LIMIT} from '../const.js';

export const getComponentFromDate = (date, component) => {
  if (component === 'year') {
    return dayjs(date).year();
  }
};

export const humanizeDuration = (durationTime) => {
  dayjs.extend(duration);

  return `${dayjs.duration(durationTime, 'minutes').hours()}h ${dayjs.duration(durationTime, 'minutes').minutes()}m`;
};

export const limitText = (text) => {
  if (text.length <= DESCRIPTION_LIMIT) {
    return text;
  }

  return `${text.slice(0, DESCRIPTION_LIMIT)}…`;
};

export const humanizeReleaseDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY');
};

export const humanizeCommentDate = (date) => {
  dayjs.extend(relativeTime);

  return `${dayjs(date).toNow(true)} ago`;
};

export const getComments = (commentsId, commentsArray) => {
  const comments = [];

  for (const comment of commentsArray) {
    if (commentsId.some((value) => value === comment.id)) {
      comments.push(comment);
    }
  }

  return comments;
};

export const getTopRatedMovies = (movies) => {
  const topRatedMovies = [];
  const sortedMovies = [...movies].sort(sortByRating);

  for (const movie of sortedMovies) {
    if (Number(movie.info.rating)) {
      topRatedMovies.push(movie);
    }
  }

  return topRatedMovies;
};

export const getMostCommentedMovies = (movies) => {
  const mostCommentedMovies = [];
  const sortedMovies = [...movies].sort((a, b) => {
    return b.comments.length - a.comments.length;
  });

  for (const movie of sortedMovies) {
    if (movie.comments.length) {
      mostCommentedMovies.push(movie);
    }
  }

  return mostCommentedMovies;
};

export const sortByDate = (a, b) => {
  return dayjs(b.info.releaseDate).diff(dayjs(a.info.releaseDate));
};

export const sortByRating = (a, b) => {
  return Number(b.info.rating) - Number(a.info.rating);
};
