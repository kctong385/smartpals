'use strict'

import { displayView, gameResultView, fadeOut, fadeIn } from './display.js';
import { shuffle, createGameBtn, createElement } from './utils.js';
import { gameLog } from './game_api.js';

// Load the structure of Memory game page
function loadMemoryView(level, game_data) {
  // Declare game variables
  var colorMap = [
    'blue', 'red', 'green', 'purple', 'gray', 
    'yellow', 'cyan', 'brown', 'navy', 'coral', 
    'lavender', 'pink', 'teal', 'maroon', 'khaki'
  ]

  var attempt = 0;
  var counter = 0;
  var score = 0;

  // Start timer
  function count() {
    counter++;
  }
  var gameTime = setInterval(count, 1000);

  // Function to disable click
  var freezeClic = false;
  document.addEventListener("click", freezeClicFn, true);
  function freezeClicFn(e) {
    if (freezeClic) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  const view = document.querySelector('#activities-view div');

  fadeOut(view, () => {
    view.innerHTML = '';
  
    // Add instruction
    view.append(
      createElement('div', 'game-instruction', game_data['instruction'])
    );
    
    // Add level indication
    view.append(
      createElement('div', 'game-indication', `Level ${level}`)
    );
    
    // Add quiz
    view.append(
      createElement('div', 'memory-quiz', 'quiz')
    );

    // Add Back button
    const btnBack = createGameBtn('Back', function() {
      if (attempt > 0) {
        gameLog(game_data['id'], level, score, attempt, counter);
      }
      displayView('#activities-content-view');
      history.pushState(null, null, `/games`);
    });
    const btnBackDiv = document.createElement('div');
    btnBackDiv.append(btnBack);
    view.append(btnBackDiv);
  
    // Initialize game
    gameMemory();
  
    fadeIn(view, '');
  });

  function gameMemory() {
    var quizView = document.querySelector('#activities-view div div.memory-quiz');
    var quiz_set = generateMemoryQuiz(level);
    quizView.innerHTML = '';

    var rows = quiz_set.rows;
    var cols = quiz_set.cols;
    createGrid(quizView, rows, cols, quiz_set.grid);

    var choiceHandler;
    function checkAnswer() {
      const choices = document.querySelectorAll('div.memory-active-cell');
    
      if (choices.length === 2) {
        freezeClic = true;
        attempt += 1;

        const color1 = choices[0].children[0].children[1].style.backgroundColor;
        const color2 = choices[1].children[0].children[1].style.backgroundColor;

        // if correct
        if (color1 === color2) {
          score += 1;
          setTimeout(() => {
            choices.forEach(choice => {
              choice.classList.remove('memory-active-cell');
              choice.classList.add('memory-correct-cell');
              choice.removeEventListener('click', choiceHandler);
              checkGameComplete();
              freezeClic = false;
            })
          }, 1000);
        } else {
          // if wrong
          setTimeout(() => {
            choices.forEach(choice => {
              const flipCard = choice.children[0];
              choice.classList.remove('memory-active-cell');
              flipCard.classList.remove('is-flipped');
              freezeClic = false;
            })
          }, 2000);
        }    
      }
    }

    function checkGameComplete() {
      // Check if game is complete
      const correntChoices = document.querySelectorAll('div.memory-correct-cell');
      if (correntChoices.length === rows * cols) {
        // Game is completed
        clearInterval(gameTime);
        // Log game data
        gameLog(game_data['id'], level, score, attempt, counter);
        // Display Win View
        setTimeout(() => {
          gameResultView('win');
        }, 500);
      }
    }
    
    function createGrid(container, rows, cols, quizGrid) {
      container.style.setProperty('--grid-rows', rows);
      container.style.setProperty('--grid-cols', cols);
      var n = rows * cols;

      for (let c = 0; c < n; c++) {
        let cell = document.createElement('div');
        let colorIndex = quizGrid[c];

        if (colorIndex + 1 > n / 2) {
          colorIndex -= (n / 2);
        }

        const flipCard = createFlipCard(colorMap[colorIndex]);
        cell.append(flipCard);

        flipCard.addEventListener('click', choiceHandler = () => {
          flipCard.classList.add('is-flipped');
          if (!cell.classList.contains("memory-correct-cell")) {
            cell.classList.add('memory-active-cell');
          }
          checkAnswer();
        })
        container.appendChild(cell).className = "grid-item";
      };
    };
  }
}

function generateMemoryQuiz(level) {
  var grid = [];
  var rows;
  var columns;

  switch (level) {
    case '1':
      // Grid = 4 x 4
      rows = 4;
      columns = 4;
      break;

    case '2':
      // Grid = 4 x 6
      rows = 4;
      columns = 6;
      break;

    case '3':
      // Grid = 5 x 6
      rows = 5;
      columns = 6;
      break;

    default:
      break;
  }

  grid = [...Array(rows * columns).keys()];

  return {
    'rows': rows, 
    'cols': columns, 
    'grid': shuffle(grid)
  };
}

function createFlipCard(color) {
  const card = createElement('div', 'card', '');

  const frontCard = createElement('div', 'cardFace cardFaceFront', '')
  const backCard = createElement('div', 'cardFace cardFaceBack', '')
  backCard.style.backgroundColor = color;

  card.append(frontCard);
  card.append(backCard);

  return card;
}


export { loadMemoryView }
