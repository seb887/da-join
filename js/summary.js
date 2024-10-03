const BASE_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/users';

function init() {
    getActiveUser();
    greeting();
}

async function getActiveUser() {
    let response = await fetch(BASE_URL + '/activeUser.json');
    let activeUser = await response.json();
    if (activeUser) {
        document.getElementById('name').innerHTML = activeUser.activeName;
        return activeUser;
    }
}

function greeting() {
    let myDate = new Date();
    let hrs = myDate.getHours();
    let greet;
    if (hrs < 12) {
        greet = 'Good Morning,';
    } else if (hrs >= 12 && hrs <= 17) {
        greet = 'Good afternoon,';
    } else if (hrs > 17 && hrs <= 24) {
        greet = 'Good Evening,';
    }
    document.getElementById('time-of-the-day').innerHTML = greet;
}
