import he from 'he';
import {humanizeReleaseDate, humanizeCommentDate, humanizeDuration, getComments} from '../utils/films.js';
import SmartView from './smart.js';
import {FilmCardCall, Emoji} from '../const.js';
import {createComment} from '../utils/comment.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

const createGenresTemplate = (genres) => {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');
};

const createCommentsTemplate = (comments, deletingCommentId) => {
  return comments.map((comment) =>
    `<li class="film-details__comment" data-id="${comment.id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.name}</span>
          <span class="film-details__comment-day">${humanizeCommentDate(comment.date)}</span>
          <button class="film-details__comment-delete" data-call="${FilmCardCall.DELETE}" data-id="${comment.id}"
          ${deletingCommentId === comment.id ? 'disabled' : ''}>
          ${deletingCommentId === comment.id ? 'Deleting...' : 'Delete'}
          </button>
        </p>
      </div>
    </li>`,
  ).join('');
};

const createPopupTemplate = (film, allComments, newComment, states) => {
  const {
    title,
    originalTitle,
    rating,
    releaseDate,
    runtime,
    genres,
    poster,
    description,
    ageRating,
    director,
    writers,
    actors,
    country,
  } = film.info;
  const {comments} = film;
  const {isEmojiChecked, checkedEmoji, writtenComment} = newComment;
  const {watchlist, watched, favorite} = film.user;
  const {isAddingComment, deletingCommentId} = states;
  const commentsData = getComments(comments, allComments);
  const genresTemplate = createGenresTemplate(genres);
  const commentsTemplate = createCommentsTemplate(commentsData, deletingCommentId);

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${poster}" alt="${title}">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${humanizeReleaseDate(releaseDate)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${humanizeDuration(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${genresTemplate}
            </tr>
          </table>

          <p class="film-details__film-description">
           ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" 
        data-call="${FilmCardCall.WATCHLIST}" ${watchlist ? 'checked' : ''}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" 
        data-call="${FilmCardCall.WATCHED}" ${watched ? 'checked' : ''}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" 
        data-call="${FilmCardCall.FAVORITE}" ${favorite ? 'checked' : ''}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
         ${commentsTemplate}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${isEmojiChecked ? `<img src="images/emoji/${checkedEmoji}.png" width="55" height="55" alt="emoji-${checkedEmoji}">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" 
            name="comment" ${isAddingComment ? 'disabled' : ''}>${writtenComment ? he.encode(writtenComment) : ''}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" 
            value="smile" ${checkedEmoji === Emoji.SMILE ? 'checked' : ''} ${isAddingComment ? 'disabled' : ''}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" 
            value="sleeping" ${checkedEmoji === Emoji.SLEEPING ? 'checked' : ''} ${isAddingComment ? 'disabled' : ''}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" 
            value="puke" ${checkedEmoji === Emoji.PUKE ? 'checked' : ''} ${isAddingComment ? 'disabled' : ''}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" 
            value="angry" ${checkedEmoji === Emoji.ANGRY ? 'checked' : ''} ${isAddingComment ? 'disabled' : ''}>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class Popup extends SmartView {
  constructor(film, allComments) {
    super();

    this._data = film;
    this._allComments = allComments;
    this._newComment = {
      isEmojiChecked: false,
      checkedEmoji: undefined,
      writtenComment: '',
    };
    this._states = {
      isAddingComment: false,
      deletingCommentId: null,
    };

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onControlsChange = this._onControlsChange.bind(this);
    this._onDeleteCommentClick = this._onDeleteCommentClick.bind(this);
    this._onEmojiChange = this._onEmojiChange.bind(this);
    this._onAddComment = this._onAddComment.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._data, this._allComments, this._newComment, this._states);
  }

  _onCloseButtonClick(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._onCloseButtonClick);
  }

  _onControlsChange(evt) {
    if (evt.target.dataset.call) {
      evt.preventDefault();
      this._callback.controlsChange(evt.target.dataset.call);
    }
  }

  setControlsChangeHandler(callback) {
    this._callback.controlsChange = callback;
    this.getElement().querySelector('.film-details__controls').addEventListener('change', this._onControlsChange);
  }

  _onEmojiChange(evt) {
    if (evt.target.tagName === 'INPUT') {
      evt.preventDefault();

      const scrollTop = this.getElement().scrollTop;

      this._newComment.isEmojiChecked = true;
      this._newComment.checkedEmoji = evt.target.value;
      this._newComment.writtenComment = this.getElement().querySelector('.film-details__comment-input').value;

      this.updateElement();
      this.getElement().scrollTop = scrollTop;
    }
  }

  setEmojiChangeHandler() {
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._onEmojiChange);
  }

  _onDeleteCommentClick(evt) {
    if (evt.target.dataset.call === FilmCardCall.DELETE) {
      evt.preventDefault();

      const scrollTop = this.getElement().scrollTop;

      this._callback.deleteCommentClick(evt.target.dataset.id)
        .then(() => {
          this.getElement().scrollTop = scrollTop;
          this.setState({deletingCommentId: null});
        })
        .catch(() => {
          this._shake(() => {
            this.getElement().scrollTop = scrollTop;
            this.setState({deletingCommentId: null});
          }, this.getElement().querySelector(`.film-details__comment[data-id="${evt.target.dataset.id}"]`));
        });
    }
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteCommentClick = callback;
    this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._onDeleteCommentClick);
  }

  _onAddComment(evt) {
    if (evt.ctrlKey && evt.code === 'Enter') {
      const commentData = new FormData(this._element.querySelector('.film-details__inner'));

      if (commentData.get('comment') && commentData.get('comment-emoji')){
        const scrollTop = this.getElement().scrollTop;
        const comment = createComment(commentData);

        this._newComment.writtenComment = this.getElement().querySelector('.film-details__comment-input').value;
        this._callback.addComment(comment)
          .then(() => {
            this._resetNewComment();
            this.getElement().scrollTop = scrollTop;
            this.setState({isAddingComment: false});
          })
          .catch(() => {
            this._shake(() => {
              this.getElement().scrollTop = scrollTop;
              this.setState({isAddingComment: false});
            }, this.getElement().querySelector('.film-details__inner'));
          });
      }
    }
  }

  setAddCommentHandler(callback) {
    this._callback.addComment = callback;
    this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._onAddComment);
  }

  restoreHandlers() {
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setControlsChangeHandler(this._callback.controlsChange);
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
    this.setAddCommentHandler(this._callback.addComment);
    this.setEmojiChangeHandler();
  }

  updateComments(allComments) {
    this._allComments = allComments;
  }

  _resetNewComment() {
    this._newComment = {
      isEmojiChecked: false,
      checkedEmoji: undefined,
      writtenComment: '',
    };
  }

  setState({isAddingComment = false, deletingCommentId = null} = {}) {
    const scrollTop = this.getElement().scrollTop;

    this._states = {
      isAddingComment,
      deletingCommentId,
    };

    this.updateElement();

    this.getElement().scrollTop = scrollTop;
  }

  _shake(callback, element) {
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      element.style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
