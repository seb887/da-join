const BASE_URL =
  'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/users';

/**
 * This function is active when the body loads. It sets up the whole login page
 */
function init() {
  document.getElementById('signed-up-overlay').classList.add('d-none');
  document.getElementById('signed-up-overlay').style.zIndex = -5;
  setTimeout(playLogoAnimation, 250);
  document.getElementById('whole-body-id').innerHTML = renderLogIn();
  localStorage.removeItem('firstLogin');
  firstLogin = JSON.parse(localStorage.getItem('firstLogin'));
}

/**
 * This function makes the animation of the JOIN logo play at the very beginning
 */
function playLogoAnimation() {
  document.getElementById('logo').classList.remove('loading-logo-animation');
  document.getElementById('logo').classList.add('loading-logo-animation');
  document
    .getElementById('logo-white')
    .classList.remove('loading-logo-animation');
  document.getElementById('logo-white').classList.add('loading-logo-animation');
  document
    .getElementById('loading-overlay-id')
    .classList.add('loading-overlay-animation');
}

/**
 * This function only works when you were trying to sign up and you want to go back to the login mask
 */
function goToLogin() {
  document.getElementById('whole-body-id').innerHTML = renderLogIn();
  document.getElementById('sign-up-top-right-id').classList.remove('d-none');
  renderLogIn();
}

/**
 * This function changes the login mask into a sign up mask
 */
function goTosignUp() {
  document.getElementById('sign-up-top-right-id').classList.add('d-none');
  document.getElementById('whole-body-id').innerHTML = renderSignUp();
}

/**
 * Logs the user in. An existing account in Firebase is required; otherwise, login will fail
 */
async function logIn() {
  let email = document.querySelector('input[type="email"]').value;
  let password = document.getElementById('current-password').value;
  let response = await fetch(BASE_URL + '.json');
  let users = await response.json();
  if (!validateEmail(email)) {
    document.getElementById('login-error').style.visibility = 'visible';
    document.getElementById('login-error').innerHTML = 'Please enter a email';
    document.querySelector('input[type="email"]').style.border =
      '1px solid #d22323';
    document.getElementById('current-password').style.border =
      '1px solid #d22323';
    return;
  } else if (password == '') {
    document.getElementById('login-error').innerHTML =
      'Please enter a password';
    return;
  }
  for (let key in users) {
    if (users[key].email === email && users[key].password === password) {
      document.getElementById('login-error').innerHTML = '';
      saveActiveUserToLocalStorage(users[key]);
      localStorage.setItem('firstLogin', JSON.stringify('firstLogin'));
      window.location.href = 'summary.html';
      break;
    } else
      document.getElementById('login-error').innerHTML =
        'Wrong E-Mail or Password';
  }
}

/**
 * Signs a new account up. The check mark about the privacy policy is required - the passwords need to be the same
 */
function signUp() {
  let password = document.getElementById('password-id-sign-up');
  let passwordConfirm = document.getElementById('password-id-confirm');
  let error = document.getElementById('sign-up-error');
  let isValid = true;
  checkNameValue();
  checkEmailValue();
  if(!checkPasswordValueEmptyInput(password, passwordConfirm, error)){ return };
  comparePasswords(password, passwordConfirm, error,isValid);
}

/**
 * Checks for empty name field
 * 
 * @returns isValid true or false
 */
function checkNameValue(){
  let name = document.getElementById('name');
  let signupErrorName = document.getElementById('sign-up-error-name');
  let isValid = true;
  if (name.value == '') {
    signupErrorName.style.visibility = 'visible';
    name.style.border = '1px solid #d22323';
    isValid = false;
  } else {
    signupErrorName.style.visibility = 'hidden';
    name.style.border = '1px solid #d1d1d1';
  }return isValid;
};

/**
 * Verifies if email input is not emtpy and has a correct email format
 * 
 */
function checkEmailValue(){
  let email = document.getElementById('email-address');
  let singupErrorMail = document.getElementById('sign-up-error-email');
  let isValid = true;
  if (!validateEmail(email.value)) {
    singupErrorMail.style.visibility = 'visible';
    email.style.border = '1px solid #d22323';
    isValid = false;
  } else {
    singupErrorMail.style.visibility = 'hidden';
    email.style.border = '1px solid #d1d1d1';
  }
};

/**
 * Checks for empty input fields and returns false on empty input fields
 * 
 * @param {element} password - DOM span element 
 * @param {element} passwordConfirm - DOM input element 
 * @param {element} error - DOM span element 
 * @returns false if password or passwordConfirnm input field is empty
 */
function checkPasswordValueEmptyInput(password, passwordConfirm, error){
  if (password.value == '' || passwordConfirm.value == '') {
    error.style.visibility = 'visible';
    password.style.border = '1px solid #d22323';
    passwordConfirm.style.border = '1px solid #d22323';
    error.innerHTML = 'Passwords do not match';
    return false;
  } else {
    error.style.visibility = 'hidden';
    password.style.border = '1px solid #d1d1d1';
    passwordConfirm.style.border = '1px solid #d1d1d1';
  }
};

/**
 * 
 * @param {element} password - DOM span element 
 * @param {element} passwordConfirm - DOM input element 
 * @param {element} error - DOM span element 
 * @param {boolean} isValid -Boolean
 */
function comparePasswords(password, passwordConfirm, error,isValid){
  let checkBox = document.getElementById('check-box-accept');
  if (password.value === passwordConfirm.value) {
    error.innerHTML = '';
    if (checkBox.src.includes('checkbox-checked.svg')) {
      isValid ? checkUser() : null;
    } else {
      error.innerHTML = 'Please accept the Privacy Policy';
      error.style.visibility = 'visible';
    }
  } else {
    error.innerHTML = 'Passwords do not match';
    error.style.visibility = 'visible';
  }
}

/**
 * Checks if the input is a correct email format and returns true or false
 *
 * @param {string} email - Value of the input field
 * @returns boolean
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * This function checks if the username already exists in the firebase
 */
async function checkUser() {
  let name = document.querySelector('input[type="text"]').value;
  let response = await fetch(BASE_URL + '.json');
  let users = await response.json();
  let nameExists = false;
  for (let key in users) {
    if (users[key].name === name) {
      nameExists = true;
      document.getElementById('sign-up-error').innerHTML =
        'Username already in use';
      break;
    }
  }
  if (!nameExists) {
    document.getElementById('sign-up-error').innerHTML = '';
    checkEmail();
  }
}

/**
 * This function checks if the E-Mail address already exists in the firebase
 */
async function checkEmail() {
  let email = document.querySelector('#email-address').value;
  let response = await fetch(BASE_URL + '.json');
  let users = await response.json();
  let emailExists = false;
  for (let key in users) {
    if (users[key].email === email) {
      emailExists = true;
      document.getElementById('sign-up-error').innerHTML =
        'E-Mail already in use';
      break;
    }
  }
  if (!emailExists) {
    document.getElementById('sign-up-error').innerHTML = '';
    await postUser();
    playSignedUpAnimation();
  }
}

/**
 * A new user is added to the firebase
 */
async function postUser() {
  let response = await fetch(BASE_URL + '.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: document.getElementById('name').value,
      email: document.getElementById('email-address').value,
      password: document.getElementById('password-id-sign-up').value,
    }),
  });
  return (responseToJson = await response.json());
}

/**
 * An animation of an info toast starts if signing up is successful. After that, the user is redirected to the login mask
 */
function playSignedUpAnimation() {
  document.getElementById('signed-up-overlay').classList.remove('d-none');
  document.getElementById('signed-up-overlay').style.zIndex = 5;
  document
    .getElementById('signed-up-overlay')
    .classList.add('signed-up-animation-overlay');
  document
    .getElementById('signed-up-container')
    .classList.add('signed-up-animation-container');
  setTimeout(function () {
    window.location.href = 'login.html';
  }, 1500);
}

/**
 * This function checks if the user wants to see the password in the login mask
 */
function toggleLoginPasswordVisibility() {
  let passwordField = document.getElementById('current-password');
  if (passwordField.type === 'password') {
    showLoginPassword();
  } else {
    hideLoginPassword();
  }
}

/**
 * This function checks if the user wants to see the password in the sign up mask
 */
function toggleSignUpPasswordVisibility() {
  let passwordField = document.getElementById(
    'password-id-sign-up',
    'password-id-confirm'
  );
  if (passwordField.type === 'password') {
    showSignUpPassword();
  } else {
    hideSignUpPassword();
  }
}

/**
 * This function makes the password visible in the login mask
 */
function showLoginPassword() {
  document.getElementById('current-password').type = 'text';
  document.getElementById('icon-password').classList.add('eye-password');
  document
    .getElementById('icon-password')
    .classList.remove('eye-password-non-visible');
}

/**
 * This function makes the password visible in the sign up mask
 */
function showSignUpPassword() {
  document.getElementById('password-id-sign-up').type = 'text';
  document.getElementById('password-id-confirm').type = 'text';
  document.getElementById('icon-password').classList.add('eye-password');
  document
    .getElementById('icon-password')
    .classList.remove('eye-password-non-visible');
  document
    .getElementById('icon-password-confirm')
    .classList.add('eye-password');
  document
    .getElementById('icon-password-confirm')
    .classList.remove('eye-password-non-visible');
}

/**
 * This function hides the password in the login mask
 */
function hideLoginPassword() {
  document.getElementById('current-password').type = 'password';
  document
    .getElementById('icon-password')
    .classList.add('eye-password-non-visible');
}

/**
 * This function hides the password in the sign up mask
 */
function hideSignUpPassword() {
  document.getElementById('password-id-sign-up').type = 'password';
  document.getElementById('password-id-confirm').type = 'password';
  document
    .getElementById('icon-password')
    .classList.add('eye-password-non-visible');
  document
    .getElementById('icon-password-confirm')
    .classList.add('eye-password-non-visible');
}

/**
 * This prevents the user from using space bar while typing in the password or something else
 */
function disableSpacebar() {
  if (event.keyCode == 32) {
    return false;
  }
}

/**
 * Toggles the "Remember Me" checkbox icon between checked and unchecked states
 * Updates the checkbox image source based on its current state
 */
function toggleCheckBoxRemember() {
  let checkBox = document.getElementById('check-box');
  if (checkBox.src.includes('checkbox-empty.svg')) {
    checkBox.src = '../assets/icons/checkbox-checked.svg';
  } else {
    checkBox.src = '../assets/icons/checkbox-empty.svg';
  }
}

/**
 * Toggles the "Accept Privacy Policy" checkbox icon between checked and unchecked states
 * Updates the checkbox image source based on its current state
 */
function toggleCheckBoxAccept() {
  let checkBox = document.getElementById('check-box-accept');
  if (checkBox.src.includes('checkbox-empty.svg')) {
    checkBox.src = '../assets/icons/checkbox-checked.svg';
  } else {
    checkBox.src = '../assets/icons/checkbox-empty.svg';
  }
}

/**
 * Renders the HTML markup for the login form, including inputs for email and password,
 * a "Remember me" checkbox, and options for logging in as a guest.
 * The function does not take any parameters and returns a string containing the HTML structure.
 * @returns {string} The HTML markup string for the login form.
 */
function renderLogIn() {
  return `
    <div class="login-mask">
            <b class="login-signup-title">Log in</b>
            <div class="login-seperator"></div>
            <div class="login-form">
                <form novalidate onsubmit="logIn(); return false;">
                  <input onkeypress="return disableSpacebar()" autocomplete="email" class="email-input" type="email" placeholder="Email" >
                  <div class="password-input-wrapper">
                      <input onkeypress="return disableSpacebar()" autocomplete="current-password" id="current-password" class="password-input" type="password" placeholder="Password">
                      <div id="icon-password" onclick="toggleLoginPasswordVisibility()" class="password-icon"></div>
                  </div>
                  <div style= "visibility:hidden" id='login-error'>Please enter a email</div>
                  <div class="check-box">
                    <div onclick="toggleCheckBoxRemember()" class="remember-true">
                      <img id="check-box" src="../assets/icons/checkbox-empty.svg">
                    </div>
                    <span>Remember me</span>
                  </div>
                  <div class="what-kind-of-login">
                    <button class="just-login">Log in</button>
                    <a onclick="guestLogInOrLogOut()" class="guest-login" style="color: black;" href="summary.html">Guest Log in</a>
                  </div>
                </form>
            </div>
    </div>
    `;
}

/**
 * Renders the HTML markup for the sign-up form, including inputs for name, email, password,
 * a password confirmation field, and a checkbox for accepting the Privacy Policy.
 * This function returns a string containing the HTML structure of the sign-up form.
 * @returns {string} The HTML markup string for the sign-up form.
 */
function renderSignUp() {
  return `
       <div class="sign-up-mask">
       <div class="sign-up-title">
            <img onclick="goToLogin()" src="../assets/icons/back.png">
            <b class="login-signup-title">Sign Up</b>
       </div>
        <div class="login-seperator"></div>
        <div class="login-form">
             <form novalidate id="form-inputs" onsubmit="signUp(); return false;">
                <input minlength="5" maxlength="18" id="name" class="name-input" type="text" placeholder="Name" >
                <div class="error" style= "visibility: hidden" id='sign-up-error-name'>Please enter a name.</div>
                <input id="email-address" onkeypress="return disableSpacebar()" class="email-input" type="text" placeholder="Email" >
                <div class="error" style= "visibility: hidden" id='sign-up-error-email'>Please enter an email.</div>
                    <div class="password-input-wrapper">
                        <input onkeypress="return disableSpacebar()" minlength="5" id="password-id-sign-up" class="password-input" type="password" placeholder="Password" >
                        <div id="icon-password" onclick="toggleSignUpPasswordVisibility()" class="password-icon"></div>
                    </div>
                    <div class="password-input-wrapper">
                        <input onkeypress="return disableSpacebar()" minlength="5" id="password-id-confirm" class="password-input" type="password" placeholder="Confirm Password" >
                        <div id="icon-password-confirm" onclick="toggleSignUpPasswordVisibility()" class="password-icon"></div>
                    </div>
                    <div class="error" style="visibility: hidden" id='sign-up-error'>Your password dont match. Please try again.</div>
                <div class="check-box" style="padding-left: 0px; justify-content: center;">
                    <div onclick="toggleCheckBoxAccept()" class="remember-true">
                    <img id="check-box-accept" src="../assets/icons/checkbox-empty.svg">
                    </div>
                    <span class="sign-up-check-box">I accept the <a class="sign-up-check-box-privacy-policy" href="privacy-policy-startpage.html" target="_blanc">Privacy Policy</a></span>
                </div>
                <div class="what-kind-of-login">
                    <button class="just-login">Sign Up</button>
                </div>
            </form>
        </div>
    `;
}
