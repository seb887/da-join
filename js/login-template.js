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