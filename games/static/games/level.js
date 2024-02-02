'use strict'

import { createGameBtn } from './utils.js';
import { displayView } from './display.js';
import { loadMathGamePage } from './game_maths.js';
import { loadMemoryView } from './game_memory.js';

function loadLevelView(game) {
  // Handle navigation using the History API
  // history.pushState(null, null, `/games/${game}`);

  fetch(`info/${game}`)
  .then(response => response.json())
  .then(game_info => {
    const view = document.querySelector('#activities-view div');
    view.innerHTML = '';
    var level;
  
    // Add heading
    document.querySelector('#activities-view h2').innerHTML = game_info['title'];

    // Load select level button
    const divLevel = document.createElement('div');
    divLevel.className = 'level-btn-container';
  
    // Add Level 1 button
    const btnL1 = createGameBtn('Level 1', function() {
      level = '1';
      gamePageSelection(level);
    });
    divLevel.append(btnL1);
  
    // Add Level 2 button
    const btnL2 = createGameBtn('Level 2', function() {
      level = '2';
      gamePageSelection(level);
    });
    divLevel.append(btnL2);
    
    // Add Level 3 button
    const btnL3 = createGameBtn('Level 3', function() {
      level = '3';
      gamePageSelection(level);
    });
    divLevel.append(btnL3);
    
    view.append(divLevel);
  
    // Add Back button
    const btnBack = createGameBtn('Back', function() {
      displayView('#activities-content-view');
      // Handle navigation using the History API
      // history.pushState(null, null, `/games`);
    });
    const btnBackDiv = document.createElement('div');
    btnBackDiv.append(btnBack);
    
    view.append(btnBackDiv);

    // Display view
    displayView('#activities-view');

    function gamePageSelection(level) {
      switch (game) {
        case 'Addition':
        case 'Subtraction':
        case 'Multiplication':
        case 'Division':
          loadMathGamePage(level, game_info);
          break;
  
        case 'Memory':
          loadMemoryView(level, game_info);
          break;
      }
    }
  })
}


export { loadLevelView }