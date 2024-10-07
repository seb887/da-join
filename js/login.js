const BASE_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/users';

function init() {
    document.getElementById("signed-up-overlay").classList.add("d-none");
    document.getElementById("signed-up-overlay").style.zIndex = -5;
    setTimeout(playLogoAnimation, 250);
    document.getElementById("whole-body-id").innerHTML = renderLogIn();
}

function playLogoAnimation() {
    document.getElementById("logo").classList.remove("loading-logo-animation");
    document.getElementById("logo").classList.add("loading-logo-animation");
    document.getElementById("logo-white").classList.remove("loading-logo-animation");
    document.getElementById("logo-white").classList.add("loading-logo-animation");
    document.getElementById("loading-overlay-id").classList.add("loading-overlay-animation");
}

function goToLogin() {
    document.getElementById("whole-body-id").innerHTML = renderLogIn();
    document.getElementById("sign-up-top-right-id").classList.remove("d-none");
    renderLogIn();
}

function goTosignUp() {
    document.getElementById("sign-up-top-right-id").classList.add("d-none");
    document.getElementById("whole-body-id").innerHTML = renderSignUp();
}

async function logIn() {
    let email = document.querySelector('input[type="email"]').value;
    let password = document.getElementById('current-password').value;
    let response = await fetch(BASE_URL + ".json");
    let users = await response.json();
    for (let key in users) {
        if (users[key].email === email && users[key].password === password) {
            document.getElementById('login-error').innerHTML = '';
            saveActiveUserToLocalStorage(users[key]);
            window.location.href = 'summary.html';
            break;
    } else
        document.getElementById('login-error').innerHTML = 'Wrong E-Mail or Password';
    }
}

function signUp() {
    let password = document.getElementById('password-id-sign-up');
    let passwordConfirm = document.getElementById('password-id-confirm');
    let checkBox = document.getElementById("check-box-accept");
    if (password.value === passwordConfirm.value) {
        document.getElementById('sign-up-error').innerHTML = '';
        if (checkBox.src.includes('checkbox-checked.svg')) {
            checkUser();
        } else {
            document.getElementById('sign-up-error').innerHTML = 'Please accept the Privacy Policy';
        }
    } else {
        document.getElementById('sign-up-error').innerHTML = 'Passwords do not match';
    }
}

async function checkUser() {
    let name = document.querySelector('input[type="text"]').value;
    let response = await fetch(BASE_URL + ".json");
    let users = await response.json();
    let nameExists = false;
    for (let key in users) {
        if (users[key].name === name) {
            nameExists = true;
            document.getElementById('sign-up-error').innerHTML='Username already in use';
            break;
        }}
        if (!nameExists) {
            document.getElementById('sign-up-error').innerHTML = '';
            checkEmail();
        }
}

async function checkEmail() {
    let email = document.querySelector('input[type="email"]').value;
    let response = await fetch(BASE_URL + ".json");
    let users = await response.json();
    let emailExists = false;
    for (let key in users) {
        if (users[key].email === email) {
            emailExists = true;
            document.getElementById('sign-up-error').innerHTML='E-Mail already in use';
            break;
        }}
        if (!emailExists) {
            document.getElementById('sign-up-error').innerHTML = '';
            await postUser();
            playSignedUpAnimation();
        }
}

async function postUser() {
    let response = await fetch(BASE_URL + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "name" :  document.getElementById('name').value,
            "email" : document.getElementById('email-address').value,
            "password" : document.getElementById('password-id-sign-up').value,
        })
    });
    return responseToJson = await response.json();
}

function playSignedUpAnimation() {
    document.getElementById("signed-up-overlay").classList.remove("d-none");
    document.getElementById("signed-up-overlay").style.zIndex = 5;
    document.getElementById("signed-up-overlay").classList.add("signed-up-animation-overlay");
    document.getElementById("signed-up-container").classList.add("signed-up-animation-container");
    setTimeout(function() {window.location.href = 'login.html';}, 1500);
}

function toggleLoginPasswordVisibility() {
    let passwordField = document.getElementById("current-password");
    if (passwordField.type === "password") {
        showLoginPassword();
    } else {
        hideLoginPassword();
    }
}

function toggleSignUpPasswordVisibility() {
    let passwordField = document.getElementById("password-id-sign-up", "password-id-confirm");
    if (passwordField.type === "password") {
        showSignUpPassword();
    } else {
        hideSignUpPassword();
    }
}

function showLoginPassword() {
    document.getElementById("current-password").type = "text";
    document.getElementById("icon-password").classList.add("eye-password");
    document.getElementById("icon-password").classList.remove("eye-password-non-visible");
}

function showSignUpPassword() {
    document.getElementById("password-id-sign-up").type = "text";
    document.getElementById("password-id-confirm").type = "text";
    document.getElementById("icon-password").classList.add("eye-password");
    document.getElementById("icon-password").classList.remove("eye-password-non-visible");
    document.getElementById("icon-password-confirm").classList.add("eye-password");
    document.getElementById("icon-password-confirm").classList.remove("eye-password-non-visible");
}

function hideLoginPassword() {
    document.getElementById("current-password").type = "password";
    document.getElementById("icon-password").classList.add("eye-password-non-visible");
}

function hideSignUpPassword() {
    document.getElementById("password-id-sign-up").type = "password";
    document.getElementById("password-id-confirm").type = "password";
    document.getElementById("icon-password").classList.add("eye-password-non-visible");
    document.getElementById("icon-password-confirm").classList.add("eye-password-non-visible");
}

function disableSpacebar() {
    if (event.keyCode == 32) {
        return false;
    }
}

function toggleCheckBoxRemember() {
    let checkBox = document.getElementById("check-box");
    if (checkBox.src.includes('checkbox-empty.svg')) {
        checkBox.src = '../assets/icons/checkbox-checked.svg';
    } else {
        checkBox.src = '../assets/icons/checkbox-empty.svg';
    }
}

function toggleCheckBoxAccept() {
    let checkBox = document.getElementById("check-box-accept");
    if (checkBox.src.includes('checkbox-empty.svg')) {
        checkBox.src = '../assets/icons/checkbox-checked.svg';
    } else {
        checkBox.src = '../assets/icons/checkbox-empty.svg';
    }
}

function renderLogIn() {
    return `
    <div class="login-mask">
            <b class="login-signup-title">Log in</b>
            <div class="login-seperator"></div>
            <div class="login-form">
                <form onsubmit="logIn(); return false;">
                    <input onkeypress="return disableSpacebar()" autocomplete="email" class="email-input" type="email" placeholder="Email" required> 
                    <div class="password-input-wrapper">
                        <input onkeypress="return disableSpacebar()" autocomplete="current-password" id="current-password" class="password-input" type="password" placeholder="Password" required>
                        <div id="icon-password" onclick="toggleLoginPasswordVisibility()" class="password-icon"></div>
                    </div>
                    <div id='login-error'></div>
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

function renderSignUp() {
    return `
       <div class="sign-up-mask">
       <div class="sign-up-title">
            <img onclick="goToLogin()" src="../assets/icons/back.png">
            <b class="login-signup-title">Sign Up</b>
       </div>
        <div class="login-seperator"></div>
        <div class="login-form">
             <form id="form-inputs" onsubmit="signUp(); return false;">
                <input minlength="5" id="name" class="name-input" type="text" placeholder="Name" required> 
                <input id="email-address" onkeypress="return disableSpacebar()" class="email-input" type="email" placeholder="Email" required> 
                    <div class="password-input-wrapper">
                        <input onkeypress="return disableSpacebar()" minlength="5" id="password-id-sign-up" class="password-input" type="password" placeholder="Password" required>
                        <div id="icon-password" onclick="toggleSignUpPasswordVisibility()" class="password-icon"></div>
                    </div>
                    <div class="password-input-wrapper">
                        <input onkeypress="return disableSpacebar()" minlength="5" id="password-id-confirm" class="password-input" type="password" placeholder="Confirm Password" required>
                        <div id="icon-password-confirm" onclick="toggleSignUpPasswordVisibility()" class="password-icon"></div>
                    </div>
                    <div id='sign-up-error'></div>
                <div class="check-box" style="padding-left: 0px; justify-content: center;">
                    <div onclick="toggleCheckBoxAccept()" class="remember-true">
                    <img id="check-box-accept" src="../assets/icons/checkbox-empty.svg">
                    </div>
                    <span class="sign-up-check-box">I accept the <a class="sign-up-check-box-privacy-policy" href="privacy-policy.html">Privacy Policy</a></span>
                </div>
                <div class="what-kind-of-login">
                    <button class="just-login">Sign Up</button>
                </div>
            </form>
        </div>
    `;
}