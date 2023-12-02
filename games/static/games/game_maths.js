'use strict'

import { createGameBtn, createElement, createInput } from './create.js';
import { displayView, gameResultView, fadeOut, fadeIn } from './display.js';
import { getRandomArbitrary } from './content_gen.js';
import { gameData, gameLog } from './game_api.js';

// Load the structure of Addition game page
function loadMathGamePage(level, game_data) {
  // Declare game variables
  const init_score = { '1': 3, '2': 2, '3': 1 };
  var score = init_score[level];
  var attempt = 0;
  var counter = 0;

  const view = document.querySelector('#activities-view > div');

  // Start timer
  function count() {
    counter++;
    console.log(counter);
  }
  let gameTime = setInterval(count, 1000);

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
      createElement('div', 'game-quiz', 'quiz')
    );
    
    // Add input
    view.append(
      createInput('game-input', 'integer', '', 'Answer')
    );
  
    // Display score
    view.append(
      createElement('div', 'game-score', '')
    );
  
    const scoreView = document.querySelector('#activities-view div div.game-score');
    scoreView.append(
      createElement('div', 'score-sub', `Score: `)
    );
    scoreView.append(
      createElement('div', 'score-sub', `x`)
    );
  
    // Add Back button
    const btnBack = createGameBtn('Back', function() {
      clearInterval(gameTime);
      if (attempt > 0) {
        gameLog(game_data['id'], level, score, attempt, counter);
      }
      displayView('#activities-content-view');
    });
    const btnBackDiv = document.createElement('div');
    btnBackDiv.append(btnBack);
    
    view.append(btnBackDiv);
  
    gameMaths();

    fadeIn(view, '');
  });


  function gameMaths() {
    const quizView = document.querySelector('#activities-view div div.game-quiz');
    const scoreValueView = document.querySelectorAll('#activities-view div div.game-score div.score-sub')[1];
    const gameInput = document.querySelector('#activities-view div input.game-input');
    let quiz_num;
    let quiz_num1;
    let quiz_num2;
    let quiz_answer;
    let operator;
    let inputHandler;
    
    // Generate quiz
    switch (game_data['title']) {
      case 'Addition':
        quiz_num = generateAdditionQuiz(level);
        operator = '+';
        break;
  
      case 'Subtraction':
        quiz_num = generateSubtractionQuiz(level);
        operator = '-';
        break;
  
      case 'Multiplication':
        quiz_num = generateMultiplicationQuiz(level);
        operator = 'x';
        break;
  
      case 'Division':
        quiz_num = generateDivisionQuiz(level);
        operator = '÷';
        break;
    }
  
    // Display quiz
    quiz_num1 = quiz_num[0];
    quiz_num2 = quiz_num[1];
    quiz_answer = quiz_num[2];
    quizView.innerHTML = `${quiz_num1} ${operator} ${quiz_num2}`;
    quizView.classList.remove('incorrect');
    scoreValueView.innerHTML = `${score}`;
  
    // Clean up input field
    gameInput.value = '';
    gameInput.autofocus = true;
  
    // Define event handler on answer input
    gameInput.addEventListener('keyup', inputHandler = (event) => {
      var answer_input;
      if (event.key === "Enter") {
        answer_input = parseInt(gameInput.value);
        attempt += 1;
        
        // Check answer
        if (answer_input === quiz_answer) {
          score += 1;
          scoreValueView.classList.add('score_up');
          scoreValueView.addEventListener('animationend', () => {
            scoreValueView.classList.remove('score_up');
          })
        } else {
          score -= 1;
          quizView.classList.add('incorrect');
          scoreValueView.classList.add('score_down');
          scoreValueView.addEventListener('animationend', () => {
            scoreValueView.classList.remove('score_down');
          })
        }

        // Score change animation
        scoreValueView.innerHTML = `${score}`;
    
        if (score === 10) {
          // Game completed
          clearInterval(gameTime);
          // Log game data
          gameLog(game_data['id'], level, score, attempt, counter);
          // Display Win View
          gameResultView('win');
        } else {
          if (score < 0) {
            // Game over
            clearInterval(gameTime);
            // Log game data
            gameLog(game_data['id'], level, 0, attempt, counter);
            // Display Lose View
            gameResultView('lose');
          } else {
            if (answer_input === quiz_answer) {
              // Next quiz
              gameInput.removeEventListener('keyup', inputHandler);
              gameMaths(); // game_data, level, score, attempt
            } else {
              // Try again
              gameInput.value = '';
            }
          }
        }
      }
    });
  }
}


function generateAdditionQuiz(level) {
  let num1, num2, answer;
  if (level === '1') {
    num1 = getRandomArbitrary(1, 5),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '2') {
    num1 = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '3') {
    num1 = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(6, 10)
  }
  answer = num1 + num2;
  return [num1, num2, answer]
}

function generateSubtractionQuiz(level) {
  let num1, num2, answer;
  if (level === '1') {
    answer = getRandomArbitrary(1, 5),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '2') {
    answer = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '3') {
    answer = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(6, 10)
  }
  num1 = answer + num2;
  return [num1, num2, answer]
}

function generateMultiplicationQuiz(level) {
  let num1, num2, answer;
  if (level === '1') {
    num1 = getRandomArbitrary(1, 5),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '2') {
    num1 = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '3') {
    num1 = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(6, 10)
  }
  answer = num1 * num2;
  return [num1, num2, answer]
}

function generateDivisionQuiz(level) {
  let num1, num2, answer;
  if (level === '1') {
    answer = getRandomArbitrary(1, 5),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '2') {
    answer = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(1, 5)
  }

  if (level === '3') {
    answer = getRandomArbitrary(6, 10),
    num2 = getRandomArbitrary(6, 10)
  }
  num1 = answer * num2;
  return [num1, num2, answer]
}

export { loadMathGamePage }

