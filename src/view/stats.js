import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {makeItemsUniq, countFilmsByGenre, humanizeDuration, getMinDatePeriod, isDateAfter} from '../utils/stats.js';
import {calculateProfileRating} from '../utils/profile-rating.js';
import {StatsFilter} from '../const.js';

const BAR_HEIGHT = 50;

const createGenresData = (films, period) => {
  const filmGenres = [];
  const minDatePeriod = getMinDatePeriod(period);

  if (minDatePeriod) {
    films = films.filter((film) => isDateAfter(minDatePeriod, film.user.watchingDate));
  }

  films.forEach((film) => {
    film.info.genres.forEach((genre) => filmGenres.push(genre));
  });

  const uniqGenres = makeItemsUniq(filmGenres);
  const filmByGenreCounts = uniqGenres.map((genre) => countFilmsByGenre(films, genre));

  uniqGenres.sort((a, b) => {
    return filmByGenreCounts[uniqGenres.indexOf(b)] - filmByGenreCounts[uniqGenres.indexOf(a)];
  });

  filmByGenreCounts.sort((a, b) => {
    return b - a;
  });

  return {
    uniqGenres,
    filmByGenreCounts,
    filteredFilms: films,
  };
};

const renderChart = (statisticCtx, data) => {
  const {films, period} = data;
  const genresData = createGenresData(films, period);

  statisticCtx.height = BAR_HEIGHT * genresData.uniqGenres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genresData.uniqGenres,
      datasets: [{
        data: genresData.filmByGenreCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsTemplate = (data) => {
  const {films, period} = data;
  const genresData = createGenresData(films, period);
  const totalDuration = genresData.filteredFilms.reduce((accumulator, film) => {
    return accumulator + (film.info.runtime);
  }, 0);
  const topGenre = genresData.uniqGenres[genresData.filmByGenreCounts.indexOf(Math.max(...genresData.filmByGenreCounts))];

  return `<section class="statistic visually-hidden">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${calculateProfileRating(films)}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" 
      value="${StatsFilter.ALL_TIME}" ${period === StatsFilter.ALL_TIME ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" 
      value="${StatsFilter.TODAY}" ${period === StatsFilter.TODAY ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" 
      value="${StatsFilter.WEEK}" ${period === StatsFilter.WEEK ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" 
      value="${StatsFilter.MONTH}" ${period === StatsFilter.MONTH ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" 
      value="${StatsFilter.YEAR}" ${period === StatsFilter.YEAR ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${genresData.filteredFilms.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">
            ${humanizeDuration(totalDuration, {isHours: true})} <span class="statistic__item-description">h</span> 
            ${humanizeDuration(totalDuration, {isMinutes: true})} <span class="statistic__item-description">m</span>
        </p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre ? topGenre : ''}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;
};

export default class Stats extends SmartView {
  constructor(films) {
    super();

    this._data = {
      films,
      period: StatsFilter.ALL_TIME,
    };

    this._onFiltersChange = this._onFiltersChange.bind(this);
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  setChart() {
    renderChart(this.getElement().querySelector('.statistic__chart'), this._data);
  }

  _onFiltersChange(evt) {
    evt.preventDefault();
    this._callback.filtersChange(evt.target.value);
  }

  setFiltersChangeHandler(callback) {
    this._callback.filtersChange = callback;
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._onFiltersChange);
  }

  restoreHandlers() {
    this.setFiltersChangeHandler(this._callback.filtersChange);
  }
}
