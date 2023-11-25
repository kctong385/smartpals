import { createGameBtn } from './create.js';
import { displayView } from './display.js';

function loadSpellingView() {
  // TODO
  const view = document.querySelector('#activities-spelling-view');
  view.innerHTML = 'Hello world!';

  // Set game = addition
  const game = document.createElement('div');
  game.innerHTML = 'Game set to Spelling!';
  view.append(game);

  // Load select level
  const divLevel = document.createElement('div');
  divLevel.className = '';
  const btnL1 = createGameBtn('Level 1', function() {
    // TODO
  });
  divLevel.append(btnL1);
  const btnL2 = createGameBtn('Level 2', function() {
    // TODO
  });
  divLevel.append(btnL2);
  const btnL3 = createGameBtn('Level 3', function() {
    // TODO
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

export { loadSpellingView }

