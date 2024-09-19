CONTACT_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/contacts.json'


function init() {
    renderContacts();
}


async function getContacts() {
    let response = await fetch(CONTACT_URL);
    let contacts = await response.json();
    return contacts;
}


async function renderContacts() {
    let allContacts = Object.values(await getContacts());
    allContacts.sort((a, b) => a.name.localeCompare(b.name));
    document.getElementById('contacts').innerHTML = addNewContactsContent();
    allContacts.forEach((contact, index) =>{
        checkForExistingLetter(contact, index);
        document.getElementById('contacts').innerHTML += contactContent(index); 
        setDataOfContact(contact, index);
    })   
}


function setDataOfContact(contact, index) {
    document.getElementById(`initials${index}`).innerText = generateInitials(contact.name);
    document.getElementById(`contactName${index}`).innerText = contact.name;
    document.getElementById(`contactMail${index}`).textContent = contact.email;
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


function checkForExistingLetter(contact, index) {
    let name = contact.name.charAt(0);
    let nameHeader = document.getElementById(name);
    if(!nameHeader) {
        document.getElementById('contacts').innerHTML += nameHeaderContent(name);
    };
}


function contactContent (index){
    return `
        <div onclick ="openContact('${index}')" class="single-contact">
          <div class="initials-container">
            <span id="initials${index}"></span>
          </div>
          <div class="contact-data">
            <h4 id="contactName${index}"></h4>
            <a href="mailto:" id="contactMail${index}"></a>
          </div>
        </div>
    `;
}


function nameHeaderContent(letter) {
    return`
        <div class="nameHeader" id ="${letter}">
            <h3>${letter}</h3>
        </div>
        <div class="seperator">
            <div class="line">
            </div>
        </div>
    `
}


function addNewContactsContent () {
    return `
        <div class="add-new-contacts">
            <button onclick="addNewContact()">Add new contact<img src="../assets/icons/person_add.png"></img></button>
        </div>
    `
}