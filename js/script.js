function init() {
    setActiveUserInitials();
}


async function setActiveUserInitials() {
    let response =  await fetch('https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/users/activeUser.json')
    let user = await response.json();
    let activeUserName = user.activeName
    let initials = await generateInitials(activeUserName);
    document.getElementById('user-initials').innerHTML = `<p>${initials}</p>`
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
    const container = document.getElementById('dropdown-profile').classList.toggle('show')
}