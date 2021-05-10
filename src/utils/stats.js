import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import {StatsFilter} from '../const.js';

export const makeItemsUniq = (items) => [...new Set(items)];

export const countFilmsByGenre = (films, genre) => {
  return films.filter((film) => film.info.genres.some((genreItem) => genreItem === genre)).length;
};

export const humanizeDuration = (durationTime, {isHours = false, isMinutes = false} = {}) => {
  dayjs.extend(duration);

  const durationTimeParse = dayjs.duration(durationTime, 'minutes');

  if (isHours) {
    return durationTimeParse.asHours().toFixed(0);
  }

  if (isMinutes) {
    return durationTimeParse.minutes();
  }
};

export const getMinDatePeriod = (period) => {
  if (period === StatsFilter.ALL_TIME) {
    return false;
  }

  if (period === StatsFilter.TODAY) {
    return dayjs().set('hour', 0).set('minute', 0).set('second', 0).format();
  }

  return dayjs().subtract(1, period).format();
};

export const isDateAfter = (startDate, date) => {
  return dayjs(date).isAfter(dayjs(startDate));
};
