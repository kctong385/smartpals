
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}


function createNewEle(tag, clsName, content) {
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


function addWrappingDiv(inputEle, clsName) {
  const element = document.createElement('div');
  element.className = clsName;
  element.append(inputEle);
  return element;
}
  

function generateTable(tableData) {
  // Create a table element
  var table = document.createElement('table');

  // Create a table header
  var thead = document.createElement('thead');
  var headerRow = document.createElement('tr');

  // Extract header column names from the first data row
  var headerColumns = Object.keys(tableData[0]);

  // Create header cells and append them to the header row
  headerColumns.forEach(function (columnName) {
    var th = document.createElement('th');
    th.textContent = columnName.replace('_', ' ');
    headerRow.appendChild(th);
  });

  // Append the header row to the table header
  thead.appendChild(headerRow);

  // Append the table header to the table
  table.appendChild(thead);

  // Create a table body
  var tbody = document.createElement('tbody');

  // Create rows and cells for the table body
  tableData.forEach(function (rowData) {
    var row = document.createElement('tr');

    // Populate cells with data
    headerColumns.forEach(function (columnName) {
      var cell = document.createElement('td');
      cell.textContent = rowData[columnName];
      row.appendChild(cell);
    });

    // Append the row to the table body
    tbody.appendChild(row);
  });

  // Append the table body to the table
  table.appendChild(tbody);

  return table;
}


export { getCookie, createNewEle, createInput, addWrappingDiv, generateTable }