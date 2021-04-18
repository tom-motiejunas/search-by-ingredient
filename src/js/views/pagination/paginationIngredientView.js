import View from '../View.js';

class PaginationIngView extends View {
  _parentElement = document.querySelector('.itemGrid');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.fa');
      if (!btn) return;
      handler(btn.classList[1]);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.allIngredients.length / this._data.resultsPerPage
    );
    const rendNextButton = function () {
      return `<i class="fa fa-arrow-right" aria-hidden="true"></i>`;
    };
    const rendPrevButton = function () {
      return `<i class="fa fa-arrow-left" aria-hidden="true"></i>`;
    };
    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return rendNextButton();
    }
    // Page 1, and there are no other pages
    if (curPage === 1 && numPages === 1) {
      return '';
    }
    // Last page
    if (curPage === numPages) {
      return rendPrevButton();
    }
    // Other page
    if (curPage < numPages) {
      return rendNextButton() + rendPrevButton();
    }
  }
}

export default new PaginationIngView();
