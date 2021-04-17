import View from './View.js';

class foodsView extends View {
  _parentElement = document.querySelector('.grid');
  _UIbtn = document.querySelector('.fa');
  _overlay = document.querySelector('.querry-box');
  _content = document.querySelector('.search');
  _errorMessage = 'We could not find any recipies with that ingredient';
  _message = '';

  // addHandlerArrow(handler) {
  //   this._UIbtn.addEventListener('click', handler);
  // }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      if (!e.target.className === 'small-imgs') return;
      const foodID = e.target.closest('.item').id;
      handler(foodID);
    });
  }

  openWindow() {
    this._overlay.classList.remove('hidden');
    this._content.classList.remove('hidden');
  }
  hideWindow() {
    this._content.classList.add('hidden');
  }
  _generateMarkup() {
    this.openWindow();
    return this._data
      .map(recipe => {
        if (recipe.strMeal.length > 24) {
          recipe.strMeal = `${recipe.strMeal.slice(0, 21)}...`;
        }
        return `
        <i class="item" id="${recipe.idMeal}">
        <img src="${recipe.strMealThumb}" class="small-imgs"/>
        <h6>${recipe.strMeal}</h6>
        </i>`;
      })
      .join('');
  }
}

export default new foodsView();
//insertNewHTML(tableElements, markup);
