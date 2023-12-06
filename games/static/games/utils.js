function getRandomArbitrary(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
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


function capitalize_str(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export { getRandomArbitrary, shuffle, capitalize_str }