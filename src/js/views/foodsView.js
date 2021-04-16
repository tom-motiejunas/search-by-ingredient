import View from './View.js';

class foodsView extends View {
  _parentElement = document.querySelector('.grid');
  _UIbtn = document.querySelector('.fa');
  _errorMessage = 'We could not find any recipies with that ingredient';
  _message = '';

  addHandlerArrow(handler) {
    this._UIbtn.addEventListener('click', handler);
  }

  _generateMarkup(pageRecipies) {
    return pageRecipies.map(recipe => {
      if (recipe.strMeal.length > 24) {
        recipe.strMeal = `${recipe.strMeal.slice(0, 21)}...`;
      }
      const markup = `
        <i class="item">
        <img src="${recipe.strMealThumb}" class="small-imgs" onclick="loadFoodIng(${recipe.idMeal})"/>
        <h6>${recipe.strMeal}</h6>
        </i>`;
    });
  }
}

export default new foodsView();
//insertNewHTML(tableElements, markup);
