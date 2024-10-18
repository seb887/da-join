CONTACT_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/contacts.json'

let contactsArray = [];
let animationActive = false;

function initContacts() {
    document.getElementById('goBackToList').classList.add('hide-z-index-responsive');
    document.getElementById('contact-information-responsive').classList.add('hide-info-responsive');
    renderContacts();
    setActiveUserInitials();
}


async function getContacts() {
    let response = await fetch(CONTACT_URL);
    let contacts = await response.json();
    return contacts;
}


async function renderContacts(newContact) {
    let allContacts = Object.values(await getContacts());
    let id = Object.keys(await getContacts());
    contactsArray = [];
    allContacts.forEach((element, index) => {element.id = id[index]});
    allContacts.sort((a, b) => a.name.localeCompare(b.name));
    document.getElementById('contacts').innerHTML = addNewContactsContent();
    allContacts.forEach((contact, index) =>{
        contactsArray.push(contact);
        checkForExistingLetter(contact, index);
        document.getElementById('contacts').innerHTML += contactContent(index); 
        setDataOfContact(contact, index);
    })
}


function setDataOfContact(contact, index) {
    document.getElementById(`initials${index}`).innerText = generateInitials(contact.name);
    document.getElementById(`contactName${index}`).innerText = contact.name;
    document.getElementById(`contactMail${index}`).textContent = contact.email;
    document.getElementById(`initialsContainer${index}`).style.backgroundColor = contactsArray[index].color;
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
    let responsiveButtonBottom = document.getElementById('responsive-button-bottom');
    if(document.getElementById('contactName').innerText == contactsArray[index].name){
        container.classList.toggle('contactFadeAndSlideIn');
        document.getElementById('contact-information-responsive').classList.toggle('fadeAndSlideInResponsive');
        responsiveButtonBottom.src = '../assets/icons/more.png';
        document.getElementById('goBackToList').classList.remove('hide-z-index-responsive');
    } else { 
        container.classList.remove('contactFadeAndSlideIn');
        document.getElementById('contact-information-responsive').classList.remove('fadeAndSlideInResponsive');
        responsiveButtonBottom.src = '../assets/icons/more.png';
        setTimeout(() => {
            container.classList.add('contactFadeAndSlideIn');
            document.getElementById('contact-information-responsive').classList.add('fadeAndSlideInResponsive');
            document.getElementById('goBackToList').classList.remove('hide-z-index-responsive');
        }, 50);
    }
    setContactInformation(index)
}

async function setContactInformation(index) {
    document.getElementById('bgInitials').style.backgroundColor = contactsArray[index].color;
    document.getElementById('contactName').innerText = contactsArray[index].name;
    document.getElementById('mailAddress').innerText = contactsArray[index].email;
    document.getElementById('phoneNumber').innerText = contactsArray[index].phone;
    document.getElementById('initialsArticle').innerText = generateInitials(contactsArray[index].name);
    document.getElementById('delContact').onclick = () => {deleteContact(contactsArray[index].id)};
    document.getElementById('editContact').onclick = () => {editContact(index)};
    document.getElementById('edit-contact-responsive').onclick = () => {editContact(index)};
    document.getElementById('del-contact-responsive').onclick = () => {deleteContact(contactsArray[index].id)};
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

function openContactOrOpenMore() {
    let responsiveButtonBottom = document.getElementById('responsive-button-bottom');
    let srcFilename = responsiveButtonBottom.src.split('/').pop();
    let editDelContact = document.getElementById('edit-del-contact-responsive');
    if (srcFilename === 'more.png') {
        if (editDelContact.style.display === 'flex') {
            editDelContact.style.display = 'none';
        } else {
            editDelContact.style.display = 'flex';
        }
    } else {
        openAndCloseAddContact();
    }
}

function checkIfAnimationActive() {
    let modal = document.getElementById('addContact'); 
    if (animationActive) {
        document.body.style.overflowY = 'visible';
        modal.classList.remove('animation-slide-in');
        modal.classList.add('animation-slide-out');
        setTimeout(() => {
            modal.style.display ='none';
            document.getElementById('modalBackground').style.display = 'none';
        }, 250);
      } else {
        modal.classList.remove('animation-slide-out');
        modal.classList.add('animation-slide-in');
        document.body.style.overflowY = 'hidden';
        document.getElementById('modalBackground').classList.add('change-opacity');
      }
}

async function createContact() {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const initials = generateInitials(document.getElementById('inputContactName').value);
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
            "color" : randomColor,
            "initials": initials
        }) 
    })
    selectCreatedContact(document.getElementById('inputContactName').value);
    showInfoToast('Contact succesfully created')
}

async function selectCreatedContact(contactName){
    try {
       await renderContacts();
        closeAndClear();
        const index = contactsArray.findIndex(contact => contact.name == contactName)
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
    let initials = generateInitials(contactsArray[index].name);
    openAndCloseAddContact();
    content.innerHTML = '';
    content.innerHTML = editContactCardContent(contactsArray[index],initials, index);
}

async function saveChangesOnContact(id, index) {
    let initials = generateInitials(document.getElementById('inputContactName').value);
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
            "color" : document.getElementById('bgInitials').style.backgroundColor,
            "initials": initials
        })
    })
    updateAndRenderContacts(index);
    showInfoToast('Contact changes saved');
}

async function updateAndRenderContacts (index) {
    try {
        await renderContacts(contactsArray[index].name);
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

async function setActiveUserInitials() {
    let response =  await fetch('https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/users/activeUser.json')
    let user = await response.json();
    let activeUserName = user.activeName
    let initials = await generateInitials(activeUserName);
    document.getElementById('user-initials').innerHTML = `<p>${initials}</p>`
}

function goBackToList() {
    document.getElementById('goBackToList').classList.add('hide-z-index-responsive');
    let editDelContact = document.getElementById('edit-del-contact-responsive');
    let container = document.getElementById('contactInformation');
    let responsiveButtonBottom = document.getElementById('responsive-button-bottom');
    if(responsiveButtonBottom.src= '../assets/icons/more.png') {
        container.classList.remove('contactFadeAndSlideIn');
        document.getElementById('contact-information-responsive').classList.remove('fadeAndSlideInResponsive');
        responsiveButtonBottom.src = '../assets/icons/add-contact.png';
        editDelContact.style.display = 'none';
    }
    setTimeout(() => {
        container.classList.remove('fadeAndSlideIn');
        document.getElementById('contact-information-responsive').classList.remove('contactFadeAndSlideIn');
        responsiveButtonBottom.src = '../assets/icons/add-contact.png';
        editDelContact.style.display = 'none';
    }, 50);
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
              <div id="closeAddContact"><img onclick="openAndCloseAddContact()" src="../assets/icons/close.png" alt="close-button"></div>
              <form onsubmit="event.preventDefault();createContact()" class="input-fields" action="">
                  <input placeholder="Name" id="inputContactName" type="text" type="text" minlength="3" maxlength="24" required>
                  <input placeholder="Email" id="inputMailAddress"  minlength="3" maxlength="32" type="email" required>
                  <input placeholder="Phone" id="inputPhoneNumber" type="number" minlength="6" required>
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
          <div id="bgInitials" class="initials-container-edit" style="background-color: ${contact.color};">
          <span id="initialsArticle">${initials}</span>
        </div>
          <div class="input-field-right">
              <div id="closeAddContact"><img onclick="openAndCloseAddContact()" src="../assets/icons/close.png" alt="close-button"></div>
              <form onsubmit="event.preventDefault();saveChangesOnContact('${contact.id}','${index}')" class="input-fields" action="">
                  <input placeholder="Name" value = "${contact.name}" id="inputContactName" type="text" minlength="3" maxlength="24" required>
                  <input placeholder="Email" value = "${contact.email}" id="inputMailAddress" type="email" minlength="3" maxlength="32"  required>
                  <input placeholder="Phone" value = "${contact.phone}" id="inputPhoneNumber" type="number" minlength="6" required>
                <div class="add-contact-button-bottom">
                  <button style="background-image: none; justify-content: center; text-align: center;" type ="button"onclick="deleteContact('${contact.id}')">Delete</button>
                  <button style="justify-content: center; width: 111px;" type="submit">Save</button>
                </div>
              </form>
          </div>
        </div>
    `
}