const BASE_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/users';

function init() {
    getActiveUser();
    greeting();
    setActiveUserInitials();
}

async function getActiveUser() {
    let response = await fetch(BASE_URL + '/activeUser.json');
    let activeUser = await response.json();
    if (activeUser) {
        document.getElementById('name').innerHTML = activeUser.activeName;
        return activeUser;
    }
}

async function setActiveUserInitials() {
    let response =  await fetch(BASE_URL + '/activeUser.json')
    let user = await response.json();
    let activeUserName = user.activeName
    let initials = await generateInitials(activeUserName);
    document.getElementById('user-initials').innerHTML = `<p>${initials}</p>`
}

async function deleteActiveUser() {
    response =  await fetch(BASE_URL + '/activeUser.json', {
        method: "DELETE",
    });
    window.location.href= "login.html";
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

function createLogOutDiv() {

}
