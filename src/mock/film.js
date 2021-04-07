import {getRandomElementFromArray, getRandomInteger} from '../utils.js';
import {names, surnames} from './common.js';
import dayjs from 'dayjs';

const MIN_SENTENCES_COUNT = 1;
const MAX_SENTENCES_COUNT = 5;
const MIN_GENRES_COUNT = 1;
const MAX_GENRES_COUNT = 3;
const MIN_NAMES_COUNT = 1;
const MAX_NAMES_COUNT = 3;
const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 5;

const titles = [
  'Star Wars',
  'Lord of the Rings',
  'Pirates of the Caribbean',
  'Harry Potter',
  'The Matrix',
  'Mr. Nobody',
  'The Butterfly Effect',
  'Eternal Sunshine of the Spotless Mind',
  'Requiem for a Dream',
  'Fight Club',
];
const posters = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];
const countries = ['USA', 'New Zealand', 'England', 'Canada', 'France', 'Germany', 'Belgium'];

const generateDescription = () => {
  const descriptionSentences = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  const sentencesCount = getRandomInteger(MIN_SENTENCES_COUNT, MAX_SENTENCES_COUNT);

  return new Array(sentencesCount).fill().map(() => getRandomElementFromArray(descriptionSentences)).join(' ');
};

const generateGenres = () => {
  const genres = ['Musical', 'Western', 'Drama', 'Comedy', 'Cartoon', 'Mystery', 'Film-Noir'];
  const genresCount = getRandomInteger(MIN_GENRES_COUNT, MAX_GENRES_COUNT);

  return new Array(genresCount).fill().map(() => {
    const randomGenre = getRandomElementFromArray(genres);

    delete genres[genres.indexOf(randomGenre)];

    return randomGenre;
  });
};

const generateNames = () => {
  const namesCount = getRandomInteger(MIN_NAMES_COUNT, MAX_NAMES_COUNT);

  return new Array(namesCount).fill().map(() => {
    return `${getRandomElementFromArray(names)} ${getRandomElementFromArray(surnames)}`;
  });
};

const generateCommentsId = () => {
  const commentsId = Array(MAX_COMMENTS_COUNT).fill().map((value, index) => index + 1);
  const commentsNumber = getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);

  return new Array(commentsNumber).fill().map(() => {
    const randomId = getRandomElementFromArray(commentsId);

    delete commentsId[commentsId.indexOf(randomId)];

    return randomId;
  });
};


export const generateFilm = () => {
  const title = getRandomElementFromArray(titles);
  const releaseDate = dayjs(getRandomInteger(0, +dayjs())).format();

  return {
    info: {
      title,
      originalTitle: title,
      poster: getRandomElementFromArray(posters),
      description: generateDescription(),
      rating: `${getRandomInteger(0, 9)}.${getRandomInteger(0, 9)}`,
      releaseDate,
      runtime: getRandomInteger(20, 300),
      genres: generateGenres(),
      director: `${getRandomElementFromArray(names)} ${getRandomElementFromArray(surnames)}`,
      writers: generateNames(),
      actors: generateNames(),
      country: getRandomElementFromArray(countries),
      ageRating: getRandomInteger(0, 18),
    },
    comments: generateCommentsId(),
    user: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      watched: Boolean(getRandomInteger(0, 1)),
      watchingDate: dayjs(getRandomInteger(+dayjs(releaseDate), +dayjs())).format(),
      favorite: Boolean(getRandomInteger(0, 1)),
    },
  };
};

