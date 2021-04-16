//import icons from 'url:../../img/icons.svg'; // Parcel 2
import View from './View.js';

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
    const header = `<span class="text">
                    <h2 class="header-text">Search Results</h2>
                    </span>`;
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.meals.length / this._data.resultsPerPage
    );
    const rendNextButton = function (curPage) {
      return `<i class="fa fa-arrow-right" aria-hidden="true"></i>`;
    };
    const rendPrevButton = function (curPage) {
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
