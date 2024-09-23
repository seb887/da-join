function init() {
    setTimeout(playLogoAnimation, 250);
    document.getElementById("whole-body-id").innerHTML = renderLogIn();
}

function playLogoAnimation() {
    document.getElementById("logo").classList.remove("loading-logo-animation");
    document.getElementById("logo").classList.add("loading-logo-animation");
    document.getElementById("loading-overlay-id").classList.add("loading-overlay-animation");
}

function renderLogIn() {
    return `
    <div class="login-mask">
            <b class="login-signup-title">Log in</b>
            <div class="login-seperator"></div>
            <div class="login-form">
                <form>
                    <input class="email-input" type="email" placeholder="Email" required> 
                    <input class="password-input" type="text" placeholder="Password" required>
                    <div class="remember">
                        <div onclick="rememberMe()" class="remember-true"></div>
                        <span>Remember me</span>
                    </div>
                    <div class="what-kind-of-login">
                        <a class="just-login" href="">Log in</a>
                        <a class="guest-login" style="color: black;" href="">Guest Log in</a>
                    </div>
                </form>
            </div>
    </div>
    `;
}

function signUp() {
    document.getElementById("sign-up-top-right-id").classList.add("d-none");
    document.getElementById("whole-body-id").innerHTML = renderSignUp();
    document.querySelector('.sign-up-title img').addEventListener('click', renderLogIn);

}

function renderSignUp() {

    return `
       <div class="sign-up-mask">
       <div class="sign-up-title">
            <img onclick="renderLogIn()" src="/assets/icons/back.png">
            <b class="login-signup-title">Sign Up</b>
       </div>

        <div class="login-seperator"></div>
        <div class="login-form">
            <form>
                <input class="name-input" type="text" placeholder="Name" required> 
                <input class="email-input" type="email" placeholder="Email" required> 
                <input class="password-input" type="text" placeholder="Password" required>
                <input class="password-input" type="text" placeholder="Confirm Password" required>
                <div class="remember">
                    <div onclick="rememberMe()" class="remember-true"></div>
                    <span>I accept the Privacy Policy</span>
                </div>
                <div class="what-kind-of-login">
                    <a class="just-login" href="">Sign Up</a>
                </div>
            </form>
        </div>
    `;
}