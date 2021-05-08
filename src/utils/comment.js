import {getRandomElementFromArray, getRandomInteger} from './common.js';
import dayjs from 'dayjs';
import {names, surnames} from '../mock/common.js';
import {nanoid} from 'nanoid';

export const createComment = (commentData) => {
  return {
    id: nanoid(),
    emotion: commentData.get('comment-emoji'),
    date: dayjs(getRandomInteger(+dayjs().set('year', 2020), +dayjs())).format(),
    name: `${getRandomElementFromArray(names)} ${getRandomElementFromArray(surnames)}`,
    comment: commentData.get('comment'),
  };
};
