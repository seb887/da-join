CONTACT_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/contacts.json'

let contacts = [];
let animationActive = false;

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
    let id = Object.keys(await getContacts());
    contacts = [];
    allContacts.forEach((element, index) => {element.id = id[index]});
    allContacts.sort((a, b) => a.name.localeCompare(b.name));
    document.getElementById('contacts').innerHTML = addNewContactsContent();
    allContacts.forEach((contact, index) =>{
        contacts.push(contact);
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


function openContact(index) {
    let container = document.getElementById('contactInformation');
    if(document.getElementById('contactName').innerText == contacts[index].name){
        container.classList.toggle('contactFadeAndSlideIn');
    }else{
        container.classList.remove('contactFadeAndSlideIn');
        setTimeout(() => {
            container.classList.add('contactFadeAndSlideIn');
        }, 50);
    }
    setContactInformation(index)
}


async function setContactInformation(index) {
    document.getElementById('bgInitials').style.backgroundColor = contacts[index].color;
    document.getElementById('contactName').innerText = contacts[index].name
    document.getElementById('mailAddress').innerText = contacts[index].email
    document.getElementById('phoneNumber').innerText = contacts[index].phone
    document.getElementById('initialsArticle').innerText = generateInitials(contacts[index].name) 
    document.getElementById('delContact').onclick = () => {deleteContact(contacts[index].id)}
    setSelectedContactBackground(index);   
}


function setSelectedContactBackground(index) {
    let allContactDivs = document.querySelectorAll('.single-contact');
    let selectedContactDiv = document.querySelectorAll('.single-contact')[index];
    allContactDivs.forEach(div => {
        div.style.backgroundColor ='white'
        div.style.color ='black'
    });
    selectedContactDiv.style.backgroundColor ='#2A3647';
    selectedContactDiv.style.color ='white'
}


function openAndCloseAddContact() {
    let modal = document.getElementById('addContact');  
    modal.style.display ='flex';
    document.getElementById('modalBackground').style.display = 'flex';
    checkIfAnimationActive()
    animationActive = !animationActive;
}


function checkIfAnimationActive() {
    let modal = document.getElementById('addContact'); 
    if (animationActive) {
        modal.classList.remove('animation-slide-in');
        modal.classList.add('animation-slide-out');
        setTimeout(() => {
            modal.style.display ='none';
            document.getElementById('modalBackground').style.display = 'none';
        }, 250);
      } else {
        modal.classList.remove('animation-slide-out');
        modal.classList.add('animation-slide-in');
        document.getElementById('modalBackground').classList.add('change-opacity');
      }
}



async function createContact() {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    let response = await fetch(CONTACT_URL, {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
            "name" :  document.getElementById('inputContactName').value,
            "email" : document.getElementById('inputMailAddress').value,
            "phone" : document.getElementById('inputPhoneNumber').value,
            "color" : randomColor
        }) 
    })
    closeAndClear();
}


async function closeAndClear(){
    openAndCloseAddContact();
    document.getElementById('inputContactName').value = '';
    document.getElementById('inputMailAddress').value = '';
    document.getElementById('inputPhoneNumber').value = '';

}


async function deleteContact(id) {
    let response = await fetch(`https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/contacts/${id}.json`, {
        method: "DELETE"
    })
    console.log(`${id} wurde gelöscht!`);
    renderContacts();
    document.getElementById('contactInformation').classList.toggle('contactFadeAndSlideIn');
}


function contactContent(index) {
    return `
        <div onclick ="openContact('${index}')" class="single-contact">
          <div class="initials-container">
            <span id="initials${index}"></span>
          </div>
          <div class="contact-data">
            <h4 id="contactName${index}"></h4>
            <a href="#" id="contactMail${index}"></a>
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
            <button onclick="openAndCloseAddContact()">Add new contact<img src="../assets/icons/person_add.png"></img></button>
        </div>
    `
}