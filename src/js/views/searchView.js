class SearchView {
  _parentEl = document.querySelector('.search-bar');

  getQuery() {
    const query = this._parentEl.querySelector('.input-field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.input-field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
