let activeUser = JSON.parse(localStorage.getItem('activeUser'));
let firstLogin = JSON.parse(localStorage.getItem('firstLogin'));

function init() {
    setActiveUserInitials();
}

function removeFirstLogin() {
    localStorage.removeItem('firstLogin');
    firstLogin = JSON.parse(localStorage.getItem('firstLogin'));
    setTimeout(checkFirstLogin, 10); 
}

function checkFirstLogin() {
    if (!firstLogin) {
        document.getElementById('greeting-overlay-responsive').classList.add('d-none');
        document.getElementById('time-of-the-day').classList.add('d-none');
        document.getElementById('name').classList.add('d-none');
    }
}

function saveActiveUserToLocalStorage(user) {
    localStorage.setItem('activeUser', JSON.stringify(user));
}

function guestLogInOrLogOut() {
    localStorage.removeItem('activeUser');
    localStorage.setItem('firstLogin', JSON.stringify('firstLogin'));
    window.location.href='login.html';
}

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

function generateInitials (name){
    let words = name.split(' ');
    let firstInitial = words[0].charAt(0).toUpperCase();
    let lastInitial = [];
    if(words.length > 1){
        lastInitial = words[words.length - 1].charAt(0).toUpperCase();
    }
    return firstInitial + lastInitial;      
}

function showProfileDropDownMenu() {
    document.getElementById('dropdown-profile').classList.toggle('show');
}