import { getCookie, createNewEle, createInput, addWrappingDiv } from './util.js';
import { createResponseBtn, createUnfriendBtn } from './friend.js';

// Preceeded by loadProfileView
function generateProfile(profile_id) {
  const target = document.querySelector('#user-info-section');
  target.innerHTML = '';

  fetch(`/profile/${profile_id}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    
    // Kid's name
    target.append(createNewEle(
      'div', // tag
      'profile_name',  // class
      `${data.first_name} ${data.last_name}` // innerHTML
      ));

    // Kid's age
    target.append(createNewEle(
      'div', // tag
      'profile_info',  // class
      `${data.age} years old` // innerHTML
      ));

    // Email address
    target.append(createNewEle(
      'div', // tag
      'profile_info',  // class
      data.email // innerHTML
      ));

    // Create Edit info button
    if (data.is_self) {
      const editBtn = createNewEle(
        'button', // tag
        'btn btn-primary btn-sm', // class
        'Edit'); // innerHTML
      editBtn.addEventListener('click', () => {
        generateEditForm(data, target);
      });
      target.append(editBtn);
    } else {
      // Create Friend / Unfriend button
      const friendBtn = createNewEle('button', 'btn btn-outline-primary btn-sm', '');
      if (data.is_friend) {
        friendBtn.innerHTML = 'Add Friend';
      } else {
        friendBtn.innerHTML = 'Unfriend';
      }

      // Add event handler
      friendBtn.addEventListener('click', () => {
        friendBtnHandler();
      })

      target.append(friendBtnSelection(data));
    }
  });
}


function generateEditForm(data, target) {
  // Empty target
  target.innerHTML = '';

  const editForm = document.createElement('form');

  // Create First Name Input
  const firstNameInput = createInput(
    'form-control', // class
    'text', // type
    data.first_name, // value
    'First Name', // placeholder
  );
  editForm.append(
    addWrappingDiv(firstNameInput, 'form-group')
  );

  // Create Last Name Input
  const lastNameInput = createInput(
    'form-control', // class
    'text', // type
    data.last_name, // value
    'Last Name', // placeholder
  );
  editForm.append(
    addWrappingDiv(lastNameInput, 'form-group')
  );

  // Create Date of Birth Input
  const dateOfBirthInput = createInput(
    'form-control', // class
    'date', // type
    data.date_of_birth, // value
    'Date of Birth', // placeholder
  );
  editForm.append(
    addWrappingDiv(dateOfBirthInput, 'form-group')
  );

  // Create save button
  const saveBtn = document.createElement('input');
  saveBtn.className = 'btn btn-primary btn-sm';
  saveBtn.type = 'button';
  saveBtn.value = 'Save';

  // Add event handler
  saveBtn.addEventListener('click', () => {
    console.log('Clicked save!');
    // Fetch data
    fetch(`/profile/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({
        first_name: firstNameInput.value,
        last_name: lastNameInput.value,
        date_of_birth: dateOfBirthInput.value,
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.log('Error', error);
    })

    // Refresh profile view
    setTimeout(loadProfileView, 100, data.id);

    // Prevent default submission
    return false;
  })

  editForm.append(saveBtn);

  target.append(editForm);
}


// Create Friend/Unfriend button
// Preceeded by generateProfile
function friendBtnSelection(data) {
  const clsName = 'btn btn-primary btn-sm';

  if (data.is_friend) {
    // Create unfriend button
    return createUnfriendBtn(
      data.id, 
      clsName,
      () => { generateProfile(data.id) },
      );

  } else {
    // No Existing Request: Add friend option
    if (data.friend_request_status === 'none') {
      return createAddFriendBtn(data.id, clsName);
    }

    // Request Sent: Button disable and display 'Pending'
    if (data.friend_request_status === 'sent') {
      const btn = createNewEle('button', clsName, 'Pending');
      btn.disabled = true;
      return btn;
    }

    // Request Received: Accept request option
    if (data.friend_request_status === 'received') {
      return createResponseBtn(
        data.friend_request, // Require request data
        '', 
        () => {generateProfile(data.id);}
        );
    }
  }
}


function createAddFriendBtn(profile_id, clsName) {
  const btn = createNewEle('button', clsName, '');
  btn.innerHTML = 'Add Friend';
  // Add event handler
  btn.addEventListener('click', () => {
    fetch(`/toggle_friend`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({
        friend_id: profile_id,
        action: 'addfriend',
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });
    setTimeout(generateProfile, 100, profile_id);
  });
  return btn;
}


export { generateProfile }