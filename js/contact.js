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


async function renderContacts(newContact) {
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
    console.log(newContact); 
}


function setDataOfContact(contact, index) {
    document.getElementById(`initials${index}`).innerText = generateInitials(contact.name);
    document.getElementById(`contactName${index}`).innerText = contact.name;
    document.getElementById(`contactMail${index}`).textContent = contact.email;
    document.getElementById(`initialsContainer${index}`).style.backgroundColor = contacts[index].color;
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
    document.getElementById('editContact').onclick = () => {editContact(index)}
    setSelectedContactBackground(index);   
}


function setSelectedContactBackground(index) {
    let allContactDivs = document.querySelectorAll('.single-contact');
    let selectedContactDiv = document.querySelectorAll('.single-contact')[index];
    if(selectedContactDiv.style.backgroundColor == 'rgb(42, 54, 71)'){
        selectedContactDiv.style.backgroundColor ='white';
        selectedContactDiv.style.color ='black'
        return
    }
    allContactDivs.forEach(div => {
        div.style.backgroundColor ='white'
        div.style.color ='black'
    });
        selectedContactDiv.style.backgroundColor = 'rgb(42, 54, 71)';
        selectedContactDiv.style.color ='white'
}


function openAndCloseAddContact(){ 
    let modal = document.getElementById('addContact');
    modal.innerHTML = '';
    modal.innerHTML = addContactCardContent();  
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
    selectCreatedContact(document.getElementById('inputContactName').value);
    showInfoToast('Contact succesfully created')
}


async function selectCreatedContact(contactName){
    try {
       await renderContacts();
        closeAndClear();
        const index = contacts.findIndex(contact => contact.name == contactName)
        updateAndRenderContacts(index);
        openAndCloseAddContact();
    } catch (error) {
        console.log(error);
    }
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
    animationActive ? openAndCloseAddContact() : null ;
    showInfoToast('Contact deleted');
}


async function editContact(index) {
    let content = document.getElementById('addContact');
    let initials = generateInitials(contacts[index].name);
    openAndCloseAddContact();
    content.innerHTML = '';
    content.innerHTML = editContactCardContent(contacts[index],initials, index);
}


async function saveChangesOnContact(id, index) {
    let response = await fetch(`https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/contacts/${id}.json`, {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
            "name" :  document.getElementById('inputContactName').value,
            "email" : document.getElementById('inputMailAddress').value,
            "phone" : document.getElementById('inputPhoneNumber').value,
            "color" : document.getElementById('bgInitials').style.backgroundColor
        })
    })
    updateAndRenderContacts(index);
    showInfoToast('Contact changes saved');
}


async function updateAndRenderContacts (index) {
    try {
        await renderContacts(contacts[index].name);
        openContact(index)
        openAndCloseAddContact();
       } catch (error) {
        console.log(error);
       } 
}


function showInfoToast(text) {
    const toast = document.getElementById("info-toast");
    toast.innerText = text;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 1500);
}


function contactContent(index) {
    return `
        <div onclick ="openContact('${index}')" class="single-contact">
        <div id="initialsContainer${index}" class="initials-container">
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

function addContactCardContent(){
    return ` 
        <div class="modal-header-logo-left">
          <div class="logo-modal">
            <img src="../assets/img/logo-white.png" alt="logo-white">
          </div>
          <div class="header-modal">
            <h1>Add Contact</h1>
            <h2>Tasks are better with a team!</h2>
            <div class="header-seperator"></div>
          </div>
        </div>
        <div class="add-contact-modal-right">   
          <div class="add-contact-modal-person">
            <img src="../assets/icons/add-contact-person.png" alt="profile-add-contact">
          </div>
          <div class="input-field-right">
              <button  id="closeAddContact"><img onclick="openAndCloseAddContact()" src="../assets/icons/close.png" alt="close-button"></button>
              <form onsubmit="event.preventDefault();createContact()" class="input-fields" action="">
                  <input placeholder="Name" id="inputContactName" type="text" required>
                  <input placeholder="Email" id="inputMailAddress" type="email" required>
                  <input placeholder="Phone" id="inputPhoneNumber" type="text" required>
                <div class="add-contact-button-bottom">
                  <button type="button" onclick="openAndCloseAddContact()">Cancel</button>
                  <button type="submit">Create contact</button>
                </div>
              </form>
          </div>
        </div>
    `
}

function editContactCardContent(contact, initials, index){
    return `
        <div class="modal-header-logo-left">
          <div class="logo-modal">
            <img src="../assets/img/logo-white.png" alt="logo-white">
          </div>
          <div class="header-modal">
            <h1>Edit Contact</h1>
            <h2></h2>
            <div class="header-seperator"></div>
          </div>
        </div>
        <div class="add-contact-modal-right">   
          <div id="bgInitials" class="initials-container" style="background-color: ${contact.color}; width:120px; height:120px; margin:0 80px;">
          <span style="font-size:47px;" id="initialsArticle">${initials}</span>
        </div>
          <div class="input-field-right">
              <button type ="button" id="closeAddContact"><img onclick="openAndCloseAddContact()" src="../assets/icons/close.png" alt="close-button"></button>
              <form onsubmit="event.preventDefault();saveChangesOnContact('${contact.id}','${index}')" class="input-fields" action="">
                  <input placeholder="Name" value = "${contact.name}" id="inputContactName" type="text" required>
                  <input placeholder="Email" value = "${contact.email}" id="inputMailAddress" type="email" required>
                  <input placeholder="Phone" value = "${contact.phone}" id="inputPhoneNumber" type="text" required>
                <div class="add-contact-button-bottom">
                  <button style="background-image: none; text-align: center;" type ="button"onclick="deleteContact('${contact.id}')">Delete</button>
                  <button style="width: 111px;" type="submit">Save</button>
                </div>
              </form>
          </div>
        </div>
    `
}