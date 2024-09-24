function init() {
    setTimeout(playLogoAnimation, 250);
    document.getElementById("whole-body-id").innerHTML = renderLogIn();
}

function playLogoAnimation() {
    document.getElementById("logo").classList.remove("loading-logo-animation");
    document.getElementById("logo").classList.add("loading-logo-animation");
    document.getElementById("loading-overlay-id").classList.add("loading-overlay-animation");
}

function login() {
    document.getElementById("whole-body-id").innerHTML = renderLogIn();
    document.getElementById("sign-up-top-right-id").classList.remove("d-none");
    renderLogIn();
}

function signUp() {
    document.getElementById("sign-up-top-right-id").classList.add("d-none");
    document.getElementById("whole-body-id").innerHTML = renderSignUp();
}

function renderLogIn() {
    return `
    <div class="login-mask">
            <b class="login-signup-title">Log in</b>
            <div class="login-seperator"></div>
            <div class="login-form">
                <form>
                    <input class="email-input" type="email" placeholder="Email" required> 
                    <div class="password-input-wrapper">
                        <input id="password-id" class="password-input" type="password" placeholder="Password" required>
                        <div id="icon-password" onclick="showLoginPassword()" class="password-icon"></div>
                    </div>
                    <div class="check-box">
                        <div onclick="rememberMe()" class="remember-true"></div>
                        <span>Remember me</span>
                    </div>
                    <div class="what-kind-of-login">
                        <a class="just-login" href="">Log in</a>
                        <a class="guest-login" style="color: black;" href="board.html">Guest Log in</a>
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
            <img onclick="login()" src="/assets/icons/back.png">
            <b class="login-signup-title">Sign Up</b>
       </div>
        <div class="login-seperator"></div>
        <div class="login-form">
            <form>
                <input class="name-input" type="text" placeholder="Name" required> 
                <input class="email-input" type="email" placeholder="Email" required> 
                    <div class="password-input-wrapper">
                        <input minlength="5" id="password-id" class="password-input" type="password" placeholder="Password" required>
                        <div id="icon-password" onclick="showSignUpPassword()" class="password-icon"></div>
                    </div>
                    <div class="password-input-wrapper">
                        <input minlength="5" id="password-id-confirm" class="password-input" type="password" placeholder="Confirm Password" required>
                        <div id="icon-password-confirm" onclick="showSignUpPassword()" class="password-icon"></div>
                    </div>
                <div class="check-box" style="padding-left: 0px; justify-content: center;">
                    <div onclick="rememberMe()" class="remember-true"></div>
                    <span class="sign-up-check-box">I accept the <a class="sign-up-check-box-privacy-policy" href="privacy-policy.html">Privacy Policy</a></span>
                </div>
                <div class="what-kind-of-login">
                    <a class="just-login" href="">Sign Up</a>
                </div>
            </form>
        </div>
    `;
}

function showLoginPassword() {
    document.getElementById("password-id").type = "text";
    document.getElementById("icon-password").classList.add("eye-password");
}

function showSignUpPassword() {
    document.getElementById("password-id").type = "text";
    document.getElementById("password-id-confirm").type = "text";
    document.getElementById("icon-password").classList.add("eye-password");
    document.getElementById("icon-password-confirm").classList.add("eye-password");
}