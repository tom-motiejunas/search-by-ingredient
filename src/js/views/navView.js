import View from './View.js';

class navView extends View {
  _parentElement = document.querySelector('.nav-bar');
  _searchBtn = document.querySelector('.search-text');
  _errorMessage = 'We could not find any recipies with that ingredient';
  _message = '';

  addHandlerRender(handler) {
    this._parentElement.addEventListener('click', handler);
  }
  addHandlerRenderSearch(handler) {
    this._searchBtn.addEventListener('click', handler);
  }
}
export default new navView();
