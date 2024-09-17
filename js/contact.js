CONTACT_URL = 'https://da-join-789b8-default-rtdb.europe-west1.firebasedatabase.app/contacts.json'


async function getContacts() {
    let response = await fetch(CONTACT_URL);
    let contacts = await response.json();
    console.log(contacts);
    
    return contacts
}



async function addNewContact() {

}