class foodsView extends View {
  _parentElement = document.querySelector('.itemGrid');
  _errorMessage = 'We could not find any ingredient with that recipe';
  _message = '';

  _generateMarkup(pageRecipies) {
    searchBox.classList.add('hidden');
    foodIngBox.classList.remove('hidden');
    const pagedIngredientMarkup = getPage(1, ingredientMarkup, 6).join('');
    const buttons = renderButtonIngPage(2, 3);
    const markup = `
                <div class="green-filter">
                  <img
                    src="${data.strMealThumb}"
                    class="food-photo"
                    />
                </div>
                <h1 class="ingredient-text">Ingredients</h1>
                ${buttons}
                <div class="grid ingredient-box">
                ${pagedIngredientMarkup}
                </div>
                <div class="center">
                  <button class="goto-recipe">Go to Page
                  </div>`;
    render(markup);
  }
}

export default new foodsView();
