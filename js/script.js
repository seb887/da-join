function init() {
    setActiveUserInitials();
}

function saveActiveUserToLocalStorage(user) {
    localStorage.setItem('activeUser', JSON.stringify(user));
}

let activeUser = JSON.parse(localStorage.getItem('activeUser'));

function setActiveUserInitials() {
    if (activeUser) {
        let initials = generateInitials(activeUser.name);
        document.getElementById('user-initials').innerHTML = `<p>${initials}</p>`
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