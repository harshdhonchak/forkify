import * as model from './model.js';
import recipeView from './views/recipeView.js';
import { Fraction } from 'fractional';
import resultsView from './views/resultsView.js';



import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { getJSON } from './helpers.js';
import { async } from 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
// import recipeView from './views/recipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

const recipeContainer = document.querySelector('.recipe');

if (module.hot) {
  module.hot.accpet;
}

// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

// https://forkify-api.herokuapp.com/v2

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




const controlRecipes = async function () {

  try {

    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    //LOADING RECIPES


    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);



    await model.loadRecipe(id);




    //RENDERING RECIPE
    recipeView.render(model.state.recipe);
    // recipeView.update(model.state.recipe);




  } catch (err) {

    recipeView.renderError();

  }

}


const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query)
      return;
    await model.loadSearchResult(query);
    searchView.clear();
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultPage(1));

    paginationView.render(model.state.search);


  } catch (err) {
    console.log(err);
  }

}

const controlPagintion = function (goToPage) {

  console.log(goToPage);

  resultsView.render(model.getSearchResultPage(goToPage));

  paginationView.render(model.state.search);



}

const controlServings = function (newServings) {
  model.updateServings(newServings);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);


}

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe);
  else {
    model.deleteBookmark(model.state.recipe.id)
  }

  recipeView.update(model.state.recipe);


  //RENDER THE BOOKMARK
  bookmarksView.render(model.state.bookmarks);

}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)

};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    // console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings)
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagintion);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};


init();