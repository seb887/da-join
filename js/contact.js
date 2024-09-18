CONTACT_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/contacts.json'


async function getContacts() {
    let response = await fetch(CONTACT_URL);
    let contacts = await response.json();
    return contacts
}


async function renderContacts() {
    let allContacts = Object.values(await getContacts());
    document.getElementById('contacts').innerHTML = '';
    allContacts.forEach((contact, index) =>{
        document.getElementById('contacts').innerHTML += contactContent(index); 
        setDataOfContact(contact, index);
    })   
}


async function setDataOfContact(contact, index) {
    
}


function contactContent (index){
    return `
        <div class="single-contact">
          <div class="initials-container">
            <span id="initials${index}"></span>
          </div>
          <div class="contact-data">
            <h4 id="contactName${index}"></h4>
            <a href="mailto:" id="contactMail${index}"></a>
          </div>
        </div>
    `
}

