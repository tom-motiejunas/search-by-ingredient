import * as model from './model.js';
import foodsView from './views/foodsView.js';
import ingredientView from './views/ingredientView.js';
import navView from './views/navView.js';
import paginationView from './views/paginationFoodView.js';
import searchView from './views/searchView.js';
import paginationIngView from './views/paginationIngredientView.js';

const controlNavBar = function (e) {
  // Event delegation
  if (e.target.className !== 'nav-text') return; // Guard clause
  console.log('hello');
  //tableName.textContent = e.target.textContent;
};

const controlSearch = async function () {
  // 1) Getting search querry
  const query = searchView.getQuery();

  // 2) Load Search Results
  await model.loadSearchResults(query);

  // 3) Hide Ingredient View (if there is)
  ingredientView.hideWindow();
  // 4) Render Results
  foodsView.render(model.getSearchResultsPage());

  // 5) Render Buttons
  paginationView.render(model.state.search);
  // console.log(model.state.search.results);
};

const controlFoodPagination = function (goToPage) {
  // 1) Render New Results
  foodsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render New Pagination Buttons
  paginationView.render(model.state.search);
};

const makeIngObject = function (goToPage) {
  return {
    // Food image
    strMealThumb: model.state.ingredient.results.strMealThumb,
    // Food ingredient (only 6 per page)
    ingredients: model.getSearchResultsPage(
      goToPage,
      model.getKeysArr(model.state.ingredient.results, 'strIngredient'),
      model.state.ingredient.resultsPerPage
    ),
    // Food Ingredient Quantities (only 6 per page)
    quantities: model.getSearchResultsPage(
      goToPage,
      model.getKeysArr(model.state.ingredient.results, 'strMeasure'),
      model.state.ingredient.resultsPerPage
    ),
    page: model.state.ingredient.page,
    resultsPerPage: model.state.ingredient.resultsPerPage,
    allIngredients: model.getKeysArr(
      model.state.ingredient.results,
      'strIngredient'
    ),
  };
};

const controlImages = async function (foodID) {
  // 1) Send Api Call With Id
  await model.loadFoodIng(foodID);
  // 2) Hide foodsView
  foodsView.hideWindow();
  // 3) Show Ingredient View

  // Making Object to send to render
  const objToRender = makeIngObject(1);
  ingredientView.render(objToRender);
  // 4) Add Pagination buttons
  paginationIngView.render(objToRender, true, false);
};

const controlIngPagination = function (goToPage) {
  goToPage = model.state.ingredient.page + model.getNewPageNumber(goToPage);
  model.state.ingredient.page = goToPage;
  const objToRender = makeIngObject(2);

  ingredientView.render(objToRender);

  paginationIngView.render(objToRender, true, false);
};

const init = function () {
  navView.addHandlerRender(controlNavBar);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerClick(controlFoodPagination);
  foodsView.addHandlerClick(controlImages);
  paginationIngView.addHandlerClick(controlIngPagination);
};
init();
