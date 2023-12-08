import { displayView, fadeIn } from './display.js';
import { capitalize_str, createGameBtn, createElement } from './utils.js';
import { loadLevelView } from './level.js';


document.addEventListener("DOMContentLoaded", function() {
  // Load game content page
  populateContentView();
  
  // When back arrow is clicked, show previous section
  window.onpopstate = function() {
    console.log(window.location.pathname);
    handleRoute(window.location.pathname);
  }
  
  // Display content view initially
  const view = document.querySelector('#activities-content-view');
  fadeIn(view, '');
});


// Function to handle routes
function handleRoute(route) {
  switch (route) {
    case '/games/Addition':
      loadLevelView('Addition');
      break;
    case '/games/Subtraction':
      loadLevelView('Subtraction');
      break;
    case '/games/Multiplication':
      loadLevelView('Multiplication');
      break;
    case '/games/Division':
      loadLevelView('Division');
      break;
    case '/games/Spelling':
      loadLevelView('Spelling');
      break;
    case '/games/Memory':
      loadLevelView('Memory');
      break;
    case '/games':
      // window.location.href = '/games';
      displayView('#activities-content-view');
      break;

    default:
      window.location.href = '/games';
  }
}


function populateContentView() {
  const view = document.querySelector('#activities-content-view');

  view.append(createElement('h1', '', 'ACTIVITIES'));

  fetch('games_data')
  .then(response => response.json())
  .then(games_data => {
    // console.log(games_data);
    var categories = games_data.map(get_category).filter(onlyUnique);

    // For each category, create its own div
    categories.forEach(category => {
      const catDiv = document.createElement('div');
      const catFilter = {
        thisCat: category,
        isInThisCat: function (value) {
          return value.category === this.thisCat;
        }
      }
      const catGameData = games_data.filter(catFilter.isInThisCat, catFilter)

      // Add category heading
      catDiv.append(
        createElement('h3', '', capitalize_str(category))
      )

      // Create ul for games in the category
      const catUl = createElement('ul', 'inlineBtn', '');

      // For each game in the category, create a Game Button
      catGameData.forEach(gameData => {
        const gameLi = document.createElement('li');
        const gameBtn = createGameBtn(gameData.title, () => {
          loadLevelView(gameData.title);
        })
        
        gameLi.append(gameBtn);
        catUl.append(gameLi);
      })

      // Append category ul to category div
      catDiv.append(catUl);
      view.append(catDiv);
    })


    function get_category(value) {
      return value.category;
    }

    function onlyUnique(value, index, array) {
      return array.indexOf(value) === index;
    }
  })
}


export { handleRoute }