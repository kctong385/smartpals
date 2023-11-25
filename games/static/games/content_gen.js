function getRandomArbitrary(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}


function capitalize_str(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export { getRandomArbitrary, capitalize_str }