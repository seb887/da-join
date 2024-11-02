let activeUser = JSON.parse(localStorage.getItem('activeUser'));
let firstLogin = JSON.parse(localStorage.getItem('firstLogin'));

/**
 * This function sets the initials of the user who is logged in
 */
function init() {
    setActiveUserInitials();
}

/**
 * After logging in, the firstLogin is set as an item in the localStorage. This function
 * prevents the greeting message from showing up in responsive, if the user visits a different
 * page than the summary
 */
function removeFirstLogin() {
    localStorage.removeItem('firstLogin');
    firstLogin = JSON.parse(localStorage.getItem('firstLogin'));
    setTimeout(checkFirstLogin, 10); 
}

/**
 * This function checks if the user just logged in
 */
function checkFirstLogin() {
    if (!firstLogin) {
        document.getElementById('greeting-overlay-responsive').classList.add('d-none');
        document.getElementById('time-of-the-day').classList.add('d-none');
        document.getElementById('name').classList.add('d-none');
    }
}

/**
 * This function sets an active user to the storage, meaning the initials of the
 * current user can show up in every page
 */
function saveActiveUserToLocalStorage(user) {
    localStorage.setItem('activeUser', JSON.stringify(user));
}

/**
 * Active user is removed from the local storage. This function serves as a log out function
 * If the user chooses to log in as a guest, the firstLogin is added to the localStorage
 */
function guestLogInOrLogOut() {
    localStorage.removeItem('activeUser');
    localStorage.setItem('firstLogin', JSON.stringify('firstLogin'));
    window.location.href='login.html';
}

/**
 * Sets the initials of the active user in the UI. If an active user is present, 
 * it generates and displays their initials in the HTML element with the ID `user-initials`. 
 * If an element with the ID `name` is present, it also updates it to show the active user’s full name.
 * If no active user exists, it displays "G" to indicate a guest user.
 * 
 * This function also handles the user login state, updating local storage if 
 * the user logs in as a guest.
 */
function setActiveUserInitials() {
    if (activeUser) {
        let initials = generateInitials(activeUser.name);
        document.getElementById('user-initials').innerHTML = `<p>${initials}</p>`
        if (document.getElementById('name')) {
            document.getElementById('name').innerHTML = activeUser.name;
        }
    } else {
        document.getElementById('user-initials').innerHTML = `<p>G</p>`
    }
}

/**
 * This function sets initials of a user
 * 
 * @param {string} name - The initials are the 2 first starting letters of an username (name)
 */
function generateInitials (name){
    let words = name.split(' ');
    let firstInitial = words[0].charAt(0).toUpperCase();
    let lastInitial = [];
    if(words.length > 1){
        lastInitial = words[words.length - 1].charAt(0).toUpperCase();
    }
    return firstInitial + lastInitial;      
}

/**
 * This function toggles between showing and hiding the dropdown-profile, which is a div
 * right under the user initials in the right top corner. The div contains different links
 * which direct the user to the next pages
 */
function showProfileDropDownMenu() {
    document.getElementById('dropdown-profile').classList.toggle('show');
}

/**
 * This function gets you back to the previous page you visited
 */
function goBack() {
    window.history.back();
}

/**
 * The footer disappears once you scrolled down to the bottom of the page, making some
 * content of the body visible
 * 
 * @param {Event} ev - The scroll event triggered when the user scrolls the page.
 */
window.onscroll = function (ev) {
    const scrollPosition = window.innerHeight + Math.round(window.scrollY);
    const totalHeight = document.documentElement.scrollHeight;
    if (scrollPosition >= totalHeight) {
      document.getElementById('footer').classList.add('footer-animation');
    } else {
      document.getElementById('footer').classList.remove('footer-animation');
    }
  };