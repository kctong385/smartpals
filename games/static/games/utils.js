function getRandomArbitrary(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}


function capitalize_str(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


function createGameBtn(btnName, handlerFunc) {
  const gameBtn = document.createElement('button');
  gameBtn.className = "gameBtn";

  const shadowSpan = document.createElement('span');
  shadowSpan.className = "gameBtnShadow";
  gameBtn.append(shadowSpan);

  const edgeSpan = document.createElement('span');
  edgeSpan.className = "gameBtnEdge";
  gameBtn.append(edgeSpan);

  const frontSpan = document.createElement('span');
  frontSpan.className = "gameBtnFront";
  frontSpan.innerHTML = btnName;
  gameBtn.append(frontSpan);

  let gameBtnHandler;
  gameBtn.addEventListener('click', gameBtnHandler = () => {
    setTimeout(handlerFunc, 100);
  });

  return gameBtn;
}


function createElement(tag, clsName, content) {
  const element = document.createElement(tag);
  element.className = clsName;
  element.innerHTML = content;
  return element;
}


function createInput(clsName, type, value, placeholder) {
  const element = document.createElement('input');
  element.className = clsName;
  element.type = type;
  element.value = value;
  element.placeholder = placeholder;
  return element
}


export { getRandomArbitrary, shuffle, capitalize_str, createGameBtn, createElement, createInput }