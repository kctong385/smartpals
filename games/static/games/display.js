function displayView(selector) {
  // Hide all views
  document.querySelector('#activities-content-view').style.display = 'none';
  document.querySelector('#activities-view').style.display = 'none';
  document.querySelector('#activities-subtraction-view').style.display = 'none';
  document.querySelector('#activities-multiplication-view').style.display = 'none';
  document.querySelector('#activities-division-view').style.display = 'none';
  document.querySelector('#activities-spelling-view').style.display = 'none';
  document.querySelector('#activities-memory-view').style.display = 'none';

  // Display selected view
  document.querySelector(selector).style.display = 'block';
  console.log(`display ${selector}`)
}


export { displayView }