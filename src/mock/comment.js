import {getRandomElementFromArray, getRandomInteger} from '../utils/common.js';
import {names, surnames} from './common.js';
import dayjs from 'dayjs';

const emotions = ['smile', 'sleeping', 'puke', 'angry'];
const comments = [
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
];

export const generateComment = (index) => {
  return {
    id: index + 1,
    emotion: getRandomElementFromArray(emotions),
    date: dayjs(getRandomInteger(+dayjs().set('year', 2020), +dayjs())).format(),
    name: `${getRandomElementFromArray(names)} ${getRandomElementFromArray(surnames)}`,
    comment: getRandomElementFromArray(comments),
  };
};
