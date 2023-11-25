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
    gameBtn.removeEventListener('click', gameBtnHandler);
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

export { createGameBtn, createElement, createInput }