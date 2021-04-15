'use strict';

const searchBtn = document.querySelector('.search-text');
const query = document.querySelector('.input-field');
const navBar = document.querySelector('.nav-bar');
const tableName = document.querySelector('.header-text');
const website = document.querySelector('.header-box');
const table = document.querySelector('.querry-box');
const searchBox = document.querySelector('.search');
const tableHeader = document.querySelector('.header');
const tableElements = document.querySelector('.grid');
const icons = document.querySelector('.fa');
const foodImg = document.querySelector('.small-imgs');
const foodIngBox = document.querySelector('.itemGrid');

const RES_PER_PAGE = 9;
let data;
let currentPage = 1;
let pages;
const leftArrowBtn = '<i class="fa fa-arrow-left"></i>';
const rightArrowBtn = '<i class="fa fa-arrow-right"></i>';
const header = `
<i class="fa fa-times"></i>
<span class="text">
  <h2 class="header-text">Search Results</h2>
</span>
</div>`;

// Functions that make code more readable
const insertNewHTML = function (element, markup, mode = 'afterbegin') {
  element.insertAdjacentHTML(mode, markup);
};

const clear = function (element) {
  element.innerHTML = '';
};

const apiCall = async function (url) {
  try {
    const response = await fetch(url);
    data = await response.json();
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    console.error(err);
  }
};

navBar.addEventListener('click', function (e) {
  // Event delegation
  if (e.target.className !== 'nav-text') return; // Guard clause
  tableName.textContent = e.target.textContent;
});

// Search Function
searchBtn.addEventListener('click', async function (e) {
  try {
    e.preventDefault();
    await apiCall(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query.value}`
    );
    currentPage = 1;
    query.value = '';
    getPageData(1, data);
    searchBox.classList.remove('hidden');
    table.classList.remove('hidden');
    if (!tableName) return;
    tableName.textContent = 'Searh Results';
  } catch (err) {
    console.error(err);
  }
});

const getPageData = function (pageNum, recipies) {
  const lowerLim = (pageNum - 1) * RES_PER_PAGE;
  const upperLim = pageNum * RES_PER_PAGE;
  const pageRecipies = recipies.meals.slice(lowerLim, upperLim);
  pages = Math.ceil(recipies.meals.length / RES_PER_PAGE);
  clear(tableHeader);
  insertNewHTML(tableHeader, renderButtons(pageNum, pages));
  renderPageData(pageRecipies);
};

const renderPageData = async function (pageRecipies) {
  clear(tableElements);
  pageRecipies.forEach(
    recipe => {
      if (recipe.strMeal.length > 24) {
        recipe.strMeal = `${recipe.strMeal.slice(0, 21)}...`;
      }
      const markup = `
      <i class="item">
      <img src="${recipe.strMealThumb}" class="small-imgs" onclick="loadFoodIng(${recipe.idMeal})"/>
      <h6>${recipe.strMeal}</h6>
      </i>`;
      insertNewHTML(tableElements, markup);
    },
    table.classList.remove('hidden')
    // apiCall(
    //   `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`
    // )
  );
};

const renderButtons = function (pageToSend, pages) {
  // There is only 1 page
  if (pageToSend === 1 && pages === 1) return header;
  // There are other pages
  if (pageToSend > 1 && pageToSend < pages) {
    return leftArrowBtn + rightArrowBtn + header;
  }
  // Last page and there are other pages
  if (pageToSend === pages && pages > 1) return leftArrowBtn + header;
  // First page and there are other pages
  if (pageToSend === 1 && pages > 1) return rightArrowBtn + header;
};

// Move to other pages function
window.addEventListener('click', function (e) {
  e.preventDefault();
  if (!e.target.className.includes('fa')) return;
  if (e.target.className.includes('fa-arrow-left')) {
    currentPage--;
  }
  if (e.target.className.includes('fa-arrow-right')) {
    currentPage++;
  }
  if (e.target.className.includes('fa-times')) {
    table.classList.add('hidden');
    currentPage = 1;
    return;
  }
  getPageData(currentPage, data);
  clear(tableHeader);
  insertNewHTML(tableHeader, renderButtons(currentPage, pages));
});

const loadFoodIng = async function (id) {
  try {
    const data = await apiCall(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    renderFoodIng(data.meals[0]);
  } catch (err) {
    console.error(err);
  }
};
const renderFoodIng = function (data) {
  searchBox.classList.add('hidden');
  foodIngBox.classList.remove('hidden');

  const allIngredients = Object.keys(data) // Getting all Ingredients
    .filter(param => param.includes('strIngredient') && data[param] !== '')
    .map(str => data[str]);

  const allQuantities = Object.keys(data) // Getting all Ingredient Quantities
    .filter(param => param.includes('strMeasure') && data[param] !== '')
    .map(str => data[str]);

  const ingredientMarkup = allIngredients
    .map((ing, i) => {
      return `<i class="ingredient-item">${ing}</i>
            <i class="ingredient-quantity">${allQuantities[i]}</i>`;
    })
    .join('');
  console.log(ingredientMarkup);
  const markup = `
  <div class="green-filter">
            <img
              src="${data.strMealThumb}"
              class="food-photo"
            />
          </div>
          <h1 class="ingredient-text">Ingredients</h1>
          <div class="grid ingredient-box">
            ${ingredientMarkup}
          </div>
          <div class="center">
            <button class="goto-recipe">Go to Page
            </div>`;
  insertNewHTML(foodIngBox, markup);
};
