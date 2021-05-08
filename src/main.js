import ProfileView from './view/profile.js';
import MenuView from './view/menu.js';
import StatisticsView from './view/statistics.js';
import ContentPresenter from './presenter/content.js';
import FilterPresenter from './presenter/filter.js';
import MoviesModel  from './model/movies.js';
import CommentsModel  from './model/comments.js';
import FilterModel from './model/filter.js';
import {generateFilm} from './mock/film.js';
import {generateComment} from './mock/comment.js';
import {generateProfileRating} from './mock/profile-rating';
import {render} from './utils/render.js';

const ALL_MOVIES_COUNT = 20;
const MAX_COMMENTS_COUNT = 5;

const movies = new Array(ALL_MOVIES_COUNT).fill().map(generateFilm);
const comments = new Array(MAX_COMMENTS_COUNT).fill().map((value, index) => generateComment(index));
const profileRating = generateProfileRating(movies);
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const statisticsContainer = document.querySelector('.footer__statistics');
const profileComponent = new ProfileView(profileRating);
const menuComponent = new MenuView();
const statisticsComponent = new StatisticsView(movies.length);
const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

moviesModel.setMovies(movies);
commentsModel.setComments(comments);

const contentPresenter = new ContentPresenter(mainElement, moviesModel, commentsModel, filterModel);

render(mainElement, menuComponent);

const filterPresenter = new FilterPresenter(menuComponent.getElement(), filterModel, moviesModel);

if (movies.length) {
  render(headerElement, profileComponent);
}

filterPresenter.init();
contentPresenter.init();
render(statisticsContainer, statisticsComponent);
