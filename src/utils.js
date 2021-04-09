import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import {DESCRIPTION_LIMIT} from './const.js';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    default:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');

  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElementFromArray = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

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

export const capitalize = (string) => {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};
