import ProfileView from './view/profile.js';
import MenuView from './view/menu.js';
import StatisticsView from './view/statistics.js';
import StatsView from './view/stats.js';
import ContentPresenter from './presenter/content.js';
import FilterPresenter from './presenter/filter.js';
import MoviesModel  from './model/movies.js';
import CommentsModel  from './model/comments.js';
import FilterModel from './model/filter.js';
import {calculateProfileRating} from './utils/profile-rating';
import {render} from './utils/render.js';
import {UpdateType} from './const.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic 0J3QsNCy0LDQu9GM0L3Ri9C5';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const statisticsContainer = document.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);
const menuComponent = new MenuView();
const statsComponent = new StatsView([]);
const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const onStatsClick = () => {
  statsComponent.setChart();
  statsComponent.show();
  contentPresenter.hide();
  filterPresenter.removeActiveClass();
};

const contentPresenter =
  new ContentPresenter(mainElement, moviesModel, commentsModel, filterModel, statsComponent, api);

const filterPresenter = new FilterPresenter(
  menuComponent.getElement(),
  filterModel,
  moviesModel,
  contentPresenter,
  statsComponent,
  menuComponent,
);

filterPresenter.init();
contentPresenter.init();

statsComponent.setFiltersChangeHandler((period) => {
  statsComponent.updateData({period});
  statsComponent.setChart();
  statsComponent.show();
});

api.getMovies()
  .then((movies) => {
    const profileRating = calculateProfileRating(movies);
    const profileComponent = new ProfileView(profileRating);
    const statisticsComponent = new StatisticsView(movies.length);

    if (movies.length) {
      render(headerElement, profileComponent);
    }

    render(mainElement, menuComponent);
    menuComponent.setStatsClickHandler(onStatsClick);
    moviesModel.setMovies(UpdateType.INIT, movies);
    render(mainElement, statsComponent);
    render(statisticsContainer, statisticsComponent);
  })
  .catch(() => {
    const statisticsComponent = new StatisticsView(0);

    render(mainElement, menuComponent);
    menuComponent.setStatsClickHandler(onStatsClick);
    moviesModel.setMovies(UpdateType.INIT, []);
    render(mainElement, statsComponent);
    render(statisticsContainer, statisticsComponent);
  });
