'use strict'

import { displayView, gameResultView, fadeOut, fadeIn } from './display.js';
import { getRandomArbitrary, createGameBtn, createElement, createInput } from './utils.js';
import { gameLog } from './game_api.js';

// Load the structure of Addition game page
function loadMathGamePage(level, game_data) {
  // Declare game variables
  const init_score = { '1': 0, '2': 0, '3': 0 };
  var score = init_score[level];
  var attempt = 0;
  var counter = 0;

  const view = document.querySelector('#activities-view div');

  // Start timer
  function count() {
    counter++;
  }
  var gameTime = setInterval(count, 1000);

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
      createInput('game-input', 'number', '', 'Answer')
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
      createElement('div', 'score-sub', ``)
    );
  
    // Add Answer button
    const btnAnswer = createGameBtn('Answer', '');
    // Add Answer button div
    const btnAnswerDiv = document.createElement('div');
    btnAnswerDiv.append(btnAnswer);
    
    view.append(btnAnswerDiv);

    // Add Back button
    const btnBack = createGameBtn('Back', function() {
      clearInterval(gameTime);
      if (attempt > 0) {
        gameLog(game_data['id'], level, score, attempt, counter);
      }
      displayView('#activities-content-view');
      history.pushState(null, null, `/games`);
    });
    const btnBackDiv = document.createElement('div');
    btnBackDiv.append(btnBack);
    
    view.append(btnBackDiv);
  
    gameMaths();

    fadeIn(view, '');
  });


  function gameMaths() {
    var quizView = document.querySelector('#activities-view div div.game-quiz');
    var scoreValueView = document.querySelectorAll('#activities-view div div.game-score div.score-sub')[1];
    var gameInput = document.querySelector('#activities-view div input.game-input');
    const answerBtn = document.querySelectorAll('#activities-view div div button')[0];
    let quiz_set;
    let operator;
    
    // Generate quiz
    switch (game_data['title']) {
      case 'Addition':
        quiz_set = generateAdditionQuiz(level);
        operator = '+';
        break;
  
      case 'Subtraction':
        quiz_set = generateSubtractionQuiz(level);
        operator = '-';
        break;
  
      case 'Multiplication':
        quiz_set = generateMultiplicationQuiz(level);
        operator = 'x';
        break;
  
      case 'Division':
        quiz_set = generateDivisionQuiz(level);
        operator = '÷';
        break;
    }
  
    // Display quiz
    let quiz_num1 = quiz_set[0];
    let quiz_num2 = quiz_set[1];
    var quiz_answer = quiz_set[2];
    quizView.innerHTML = `${quiz_num1} ${operator} ${quiz_num2}`;
    quizView.classList.remove('incorrect');
    scoreValueView.innerHTML = `${score}`;
  
    // Clean up input field
    gameInput.value = '';
    gameInput.autofocus = true;
  
    // Define event handler on answer input
    var inputHandler;
    gameInput.addEventListener('keyup', inputHandler = (event) => {
      if (event.key === "Enter") {
        answeringActions();
      }
    });

    var btnEventHandler;
    answerBtn.addEventListener('click', btnEventHandler = () => {
      answeringActions();
    })

    function answeringActions() {
      const answer_input = parseInt(gameInput.value);
        
      // Check answer, score update and effect
      checkAnswer(answer_input);

      // Follow up action according to score result
      followUpAction(answer_input);
    }

    function checkAnswer(answer) {
      attempt += 1;
      // Check answer, score update and effect
      if (answer === quiz_answer) {
        score += 1;
        // Score change animation
        scoreValueView.classList.add('score_up');
        scoreValueView.addEventListener('animationend', () => {
          scoreValueView.classList.remove('score_up');
        })
      } else {
        score -= 1;
        if (score < 0) {
          score = 0;
        }
        // Score down effect
        quizView.classList.add('incorrect');
        // Score change animation
        scoreValueView.classList.add('score_down');
        scoreValueView.addEventListener('animationend', () => {
          scoreValueView.classList.remove('score_down');
        })
      }
      scoreValueView.innerHTML = `${score}`;
    }

    function followUpAction(answer) {
      // Follow up action according to score result
      switch (true) {
        case (score === 10):
          // Game completed
          clearInterval(gameTime);
          // Log game data
          gameLog(game_data['id'], level, score, attempt, counter);
          // Display Win View
          gameResultView('win');
          break;

        // case (score < 0):
        //   // Game is over
        //   clearInterval(gameTime);
        //   // Log game data
        //   gameLog(game_data['id'], level, 0, attempt, counter);
        //   // Display Lose View
        //   gameResultView('lose');
        //   break;

        default:
          if (answer === quiz_answer) {
            // Next quiz
            removeAnswerHandlers();
            gameMaths();
          } else {
            // Try again
            gameInput.value = '';
          }
          break;
      }
    }

    function removeAnswerHandlers() {
      gameInput.removeEventListener('keyup', inputHandler);
      answerBtn.removeEventListener('click', btnEventHandler);
    }

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

