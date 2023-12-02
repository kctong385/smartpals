'use strict'

import { loadMathGamePage } from './game_maths.js';
import { createGameBtn, createElement } from './create.js';
import { displayView } from './display.js';
import { capitalize_str } from './content_gen.js';
import { loadSpellingView } from './game_spelling.js';
import { loadMemoryView } from './game_memory.js';

function loadLevelView(game) {
  fetch(`instruction/${game}`)
  .then(response => response.json())
  .then(game_data => {
    const view = document.querySelector('#activities-view > div');
    view.innerHTML = '';
    var level;
  
    // Add heading
    document.querySelector('#activities-view h2').innerHTML = game_data['title'];

    // view.append(
    //   createElement('h2', 'game-heading', capitalize_str(game_data['title']))
    // );
  
    // Load select level button
    const divLevel = document.createElement('div');
    divLevel.className = 'level-btn-container';
  
    // Add Level 1 button
    const btnL1 = createGameBtn('Level 1', function() {
      level = '1';
      switch (game_data['title']) {
        case 'Addition':
        case 'Subtraction':
        case 'Multiplication':
        case 'Division':
          loadMathGamePage(level, game_data);
          break;
  
        case 'spelling':
          loadSpellingView(level, game_data);
          break;
  
        case 'memory':
          loadMemoryView(level, game_data);
          break;
      }
    });
    divLevel.append(btnL1);
  
    // Add Level 2 button
    const btnL2 = createGameBtn('Level 2', function() {
      level = '2';
      switch (game) {
        case 'Addition':
        case 'Subtraction':
        case 'Multiplication':
        case 'Division':
          loadMathGamePage(level, game_data);
          break;
  
        case 'spelling':
          loadSpellingView(game, level);
          break;
  
        case 'memory':
          loadMemoryView(game, level);
          break;
      }
    });
    divLevel.append(btnL2);
    
    // Add Level 3 button
    const btnL3 = createGameBtn('Level 3', function() {
      level = '3';
      switch (game) {
        case 'Addition':
        case 'Subtraction':
        case 'Multiplication':
        case 'Division':
          loadMathGamePage(level, game_data);
          break;
  
        case 'spelling':
          loadSpellingView(game, level);
          break;
  
        case 'memory':
          loadMemoryView(game, level);
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
    displayView('#activities-view');
  })
}

export { loadLevelView }