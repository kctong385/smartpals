import { loadMathGamePage } from './game_addition.js';
import { createGameBtn, createElement } from './create.js';
import { displayView } from './display.js';
import { capitalize_str } from './content_gen.js';

function loadLevelView(game) {
  console.log(game);
  const view = document.querySelector('#activities-view');
  view.innerHTML = '';

  // Add heading
  view.append(
    createElement('h2', 'game-heading', capitalize_str(game))
  );

  // Load select level button
  const divLevel = document.createElement('div');
  divLevel.className = 'level-btn-container';

  // Add Level 1 button
  const btnL1 = createGameBtn('Level 1', function() {
    switch (game) {
      case 'addition':
        loadMathGamePage(game, '1');
        break;

      case 'subtraction':
        loadMathGamePage(game, '1');
        break;

      case 'multiplication':
        loadMathGamePage(game, '1');
        break;

      case 'division':
        loadMathGamePage(game, '1');
        break;
    }
  });
  divLevel.append(btnL1);

  // Add Level 2 button
  const btnL2 = createGameBtn('Level 2', function() {
    switch (game) {
      case 'addition':
        loadMathGamePage(game, '2');
        break;

      case 'subtraction':
        loadMathGamePage(game, '2');
        break;

      case 'multiplication':
        loadMathGamePage(game, '2');
        break;

      case 'division':
        loadMathGamePage(game, '2');
        break;
    }
  });
  divLevel.append(btnL2);
  
  // Add Level 3 button
  const btnL3 = createGameBtn('Level 3', function() {
    switch (game) {
      case 'addition':
        loadMathGamePage(game, '3');
        break;

      case 'subtraction':
        loadMathGamePage(game, '3');
        break;

      case 'multiplication':
        loadMathGamePage(game, '3');
        break;

      case 'division':
        loadMathGamePage(game, '3');
        break;
    }
  });
  divLevel.append(btnL3);
  
  view.append(divLevel);

  // Add Back button
  const btnBack = createGameBtn('Back', function() {
    displayView('#activities-content-view');
  });
  const btnBackDiv = document.createElement('div');
  btnBackDiv.append(btnBack);
  
  view.append(btnBackDiv);
}

export { loadLevelView }