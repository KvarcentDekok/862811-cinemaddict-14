import ProfileView from './view/profile.js';
import MenuView from './view/menu.js';
import FilterView from './view/filter.js';
import StatisticsView from './view/statistics.js';
import ContentPresenter from './presenter/content.js';
import {generateFilm} from './mock/film.js';
import {generateComment} from './mock/comment.js';
import {generateFilter} from './mock/filter';
import {generateProfileRating} from './mock/profile-rating';
import {render} from './utils/render.js';

const ALL_MOVIES_COUNT = 20;
const MAX_COMMENTS_COUNT = 5;

const movies = new Array(ALL_MOVIES_COUNT).fill().map(generateFilm);
const comments = new Array(MAX_COMMENTS_COUNT).fill().map((value, index) => generateComment(index));
const filters = generateFilter(movies);
const profileRating = generateProfileRating(movies);
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const statisticsContainer = document.querySelector('.footer__statistics');
const profileComponent = new ProfileView(profileRating);
const menuComponent = new MenuView();
const statisticsComponent = new StatisticsView(movies.length);
const contentPresenter = new ContentPresenter(mainElement);

render(mainElement, menuComponent);

filters.forEach((filter) => {
  const filterComponent = new FilterView(filter);

  render(menuComponent.getNavigationContainer(), filterComponent);
});

if (movies.length) {
  render(headerElement, profileComponent);
}

contentPresenter.init(movies, comments);
render(statisticsContainer, statisticsComponent);
