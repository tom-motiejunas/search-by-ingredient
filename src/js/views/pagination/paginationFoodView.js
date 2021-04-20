//import icons from 'url:../../img/icons.svg'; // Parcel 2
import View from '../View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.header');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.fa');
      if (!btn) return;

      handler(btn.classList[1]);
    });
  }

  _generateMarkup() {
    let curPage, numPages, header;
    if (this._data.context === 'food') {
      header = `<span class="text">
      <h2 class="header-text">Search Results</h2>
      </span>`;
      curPage = this._data.page;
      numPages = Math.ceil(
        this._data.results.meals.length / this._data.resultsPerPage
      );
    }
    if (this._data.context === 'categ') {
      header = `<span class="text">
        <h2 class="header-text">Categories</h2>
        </span>`;
      curPage = this._data.page;
      numPages = Math.ceil(
        this._data.results.length / this._data.resultsPerPage
      );
    }
    if (this._data.context === 'luck') {
      header = `<span class="text">
          <h2 class="header-text">Lucky Search</h2>
          </span>`;
      curPage = this._data.page;
      numPages = Math.ceil(
        this._data.results.meals.length / this._data.resultsPerPage
      );
    }
    if (this._data.context === 'bookmark') {
      header = `<span class="text">
      <h2 class="header-text">Bookmarks</h2>
      </span>`;
      curPage = this._data.page;
      numPages = Math.ceil(
        this._data.entries.length / this._data.resultsPerPage
      );
      numPages = numPages ? numPages : 1;
    }
    const rendNextButton = function () {
      return `<i class="fa fa-arrow-right" aria-hidden="true"></i>`;
    };
    const rendPrevButton = function () {
      return `<i class="fa fa-arrow-left" aria-hidden="true"></i>`;
    };
    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return header + rendNextButton();
    }
    // Page 1, and there are no other pages
    if (curPage === 1 && numPages === 1) {
      return header;
    }
    // Last page
    if (curPage === numPages) {
      return rendPrevButton() + header;
    }
    // Other page
    if (curPage < numPages) {
      return rendNextButton() + rendPrevButton() + header;
    }
  }
}

export default new PaginationView();
