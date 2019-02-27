// document.addEventListener("DOMContentLoaded", function() {});
const BASE_URL = "http://localhost:3000"
const BOOKS_URL = `${BASE_URL}/books`
const USERS_URL = `${BASE_URL}/users`

// ways to refract look at storing the books once you make the first request.

const bookList = document.querySelector('#list')
const showPanel = document.querySelector('#show-panel')
let selectedBook = undefined;

const currentUser = {
  "id": 1,
  "username": "pouros"
}



function initialize(){

  fetchBooks().then(renderBookslist)

}

// fetch books and users from server.
function fetchBooks(){

  return fetch(BOOKS_URL)
    .then(resp => resp.json())

  //  .then(resp => console.log(JSON.stringify(resp.length)))
}

function renderBookinList(book){

      const bookLi = document.createElement('li')
      bookLi.dataset.bookId = book.id

      bookLi.innerText = `${book.title}`

      bookList.appendChild(bookLi)


  }

function renderBookslist(books){

    books.forEach(renderBookinList)


  }

bookList.addEventListener('click',findBookId)

function findBookId(event){

  const bookId = event.target.attributes['data-book-id'].value
  getBookfromServer(bookId)


}

function getBookfromServer(bookId){

  fetch(BOOKS_URL + `/${bookId}`)
  .then(resp => resp.json())
  .then(displayBook)

}


function displayBook(book){

    showPanel.innerHTML = `<h2> ${book.title} </h2>
    <img src="${book.img_url}">
    <p>${book.description} </p>
    <ul class="user-list"> </ul>
    <button data-book-id="${book.id}">Read Book</button>
    `
    selectedBook = book
    populateUsers(book)

}


function populateUsers(book){

  for(const user of book.users){
      createuserList(user)
  }


}


function createuserList(user){
  const userList = document.querySelector('.user-list')
  const userLi = document.createElement('li')

    userLi.dataset.userId = user.id
    userLi.className = "user-item"
    userLi.innerText = user.username

    userList.appendChild(userLi)

}

showPanel.addEventListener('click',(event) => checkWhatwasClicked(selectedBook,event))


function checkWhatwasClicked(book, event){

  const button = event.target
  //console.log(button.innerHTML)

  if( button.innerHTML === "Read Book"){
      // add user
      // const bookId = event.target.attributes['data-book-id'].value
      // console.log('trying to add')
       addNewUser(book)

  } else if (button.className === "user-item"){

    // delete user
    const userId = event.target.attributes['data-user-id'].value

   deleteUserLike(book)
  // console.log(userId)

  }


}

function deleteUserLike(book){



   if(book.users.map(user => user.id).includes(currentUser.id)){
       book.users = book.users.filter(user => user.id  !== currentUser.id)
       updateLikesOnServer(book)
        // renderUserList(book.users)
  }

}



function addNewUser(book) {

    let users = book.users
    // if(!users.map(user => user.id).includes(currentUser.id)){
  //   book.users.push(user)
  // } else {
  //   book.users = book.users.filter(u => u.id  !== currentUser.id)
  // }


    if(!users.map(user => user.id).includes(currentUser.id)){
      book.users.push(currentUser)
      updateLikesOnServer(book)
    } else {
      alert("You have already liked this book");
    }

}

function updateLikesOnServer(book){
  const newUrl = BOOKS_URL + `/${book.id}`


  options = {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(book)

  }

  fetch(newUrl, options)
  .then(resp => resp.json())
  .then(displayBook)

  // change to just append name to end of list

}







initialize()

// <div id="list-panel">
//   <ul id="list">
//
//   </ul>
