import * as model from './model.js';
import foodsView from './views/foodsView.js';
import ingredientView from './views/ingredientView.js';
import navView from './views/navView.js';
import paginationFoodView from './views//pagination/paginationFoodView.js';
import searchView from './views/searchView.js';
import paginationIngView from './views/pagination/paginationIngredientView.js';
import categoriesView from './views/categoriesView.js';
import { async } from 'regenerator-runtime';

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
  paginationFoodView.render(model.state.search);
  // console.log(model.state.search.results);
};

const controlFoodPagination = function (goToPage) {
  if (model.state.search.context === 'categ') {
    // 1) Render New Results
    categoriesView.render(
      model.getSearchResultsPage(goToPage, model.state.search.results)
    );
    // 2) Render New Pagination Buttons
    paginationFoodView.render(model.state.search);
  }
  if (model.state.search.context === 'food') {
    // 1) Render New Results
    foodsView.render(model.getSearchResultsPage(goToPage));
    // 2) Render New Pagination Buttons
    paginationFoodView.render(model.state.search);
  }
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

const controlNavigation = async function (navStr) {
  // 2) Load Search Results
  let data;
  switch (navStr) {
    case 'categ':
      await model.loadCategories();
      categoriesView.render(
        model.getSearchResultsPage(1, model.state.search.results)
      );
      paginationFoodView.render(model.state.search);
      break;
    case 'luck':
      data = await model.loadLucky();
      break;
    case 'bookmark':
      break;
    case 'about':
      break;
    default:
      console.error('Unknown nav');
  }
  // 3) Hide Ingredient View (if there is)
  //  ingredientView.hideWindow();
  // 4) Render Results
  //  foodsView.render(model.getSearchResultsPage());

  // 5) Render Buttons
  //  paginationFoodView.render(model.state.search);
  // console.log(model.state.search.results);
};

const controlCategories = async function (category) {
  // 1) Send Api Call With Id
  await model.loadCategorySearch(category);
  // 2) Hide Category View
  categoriesView.hideWindow();
  // 3) Show Food View
  foodsView.render(model.getSearchResultsPage());
  // 4) Render Buttons
  paginationFoodView.render(model.state.search);
};

const init = function () {
  searchView.addHandlerSearch(controlSearch);
  paginationFoodView.addHandlerClick(controlFoodPagination);
  foodsView.addHandlerClick(controlImages);
  paginationIngView.addHandlerClick(controlIngPagination);
  navView.addHandlerClick(controlNavigation);
  categoriesView.addHandlerClick(controlCategories);
};
init();
