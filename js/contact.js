CONTACT_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/contacts.json'


async function getContacts() {
    let response = await fetch(CONTACT_URL);
    let contacts = await response.json()
    
    return contacts
}



async function addNewContact() {
    let allContacts = Object.values(await getContacts());
    allContacts.forEach((contact) =>{
        console.log(contact.name);
        
    })
    
}
addNewContact()