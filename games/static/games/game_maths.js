'use strict'

import { createGameBtn, createElement, createInput } from './create.js';
import { displayView, gameResultView } from './display.js';
import { getRandomArbitrary, capitalize_str } from './content_gen.js';
import { gameData, gameLog } from './game_api.js';

// Load the structure of Addition game page
function loadMathGamePage(level, game_data) {
  const view = document.querySelector('#activities-view');
  view.innerHTML = '';
  
  // Add heading
  view.append(
    createElement('h2', 'game-heading', capitalize_str(game_data['title']))
  );

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
    createElement('div', 'game-score', `Score: `)
  );

  // Declare game variables
  const init_score = { '1': 3, '2': 2, '3': 1 };
  var score = init_score[level];
  var attempt = 0;
  let counter = 0;

  // Add Back button
  const btnBack = createGameBtn('Back', function() {
    if (attempt > 0) {
      gameLog(game_data['id'], level, score, attempt, counter);
    }
    displayView('#activities-content-view');
  });
  const btnBackDiv = document.createElement('div');
  btnBackDiv.append(btnBack);
  
  view.append(btnBackDiv);

  
  // Initiate game
  // Start timer
  function count() {
      counter++;
  }
  let gameTime = setInterval(count, 1000);

  gameMaths(); //game_data, level, init_score[level], 0
  
  // game_data, level, score, attempt
  function gameMaths() {
    console.log(`Counter: ${counter}`);
    console.log(`Score: ${score}`);
    console.log(`Attempt: ${attempt}`);
    const view = document.querySelector('#activities-view');
    const quizView = document.querySelector('.game-quiz');
    const scoreView = document.querySelector('#activities-view > .game-score');
    const gameInput = document.querySelector('#activities-view > .game-input');
    var quiz_num;
    var quiz_num1;
    var quiz_num2;
    var quiz_answer;
    var operator;
    let inputHandler;
  
    // Clean up input field
    gameInput.value = '';
  
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
    scoreView.innerHTML = `Score: ${score}`;
  
    // Define event handler on answer input
    gameInput.addEventListener('keyup', inputHandler = (event) => {
      var answer_input;
      if (event.key === "Enter") {
        answer_input = parseInt(gameInput.value);
        attempt += 1;
        
        if (answer_input === quiz_answer) {
          score += 1;
          scoreView.innerHTML = `Score: ${score}`;
        } else {
          score -= 1;
          scoreView.innerHTML = `Score: ${score}`;
        }
    
        if (score === 10) {
          // Game completed
          clearInterval(gameTime);
          console.log(`Counter: ${counter}`);
          // Log game data
          gameLog(game_data['id'], level, score, attempt, counter);
          // Display Win View
          gameResultView(view, 'You Win!')
        } else {
          if (score < 0) {
            // Game over
            clearInterval(gameTime);
            // Log game data
            gameLog(game_data['id'], level, 0, attempt, counter);
            // Display Lose View
            gameResultView(view, 'You Lose!')
          } else {
            // Next quiz
            gameInput.removeEventListener('keyup', inputHandler);
            gameMaths(); // game_data, level, score, attempt
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

