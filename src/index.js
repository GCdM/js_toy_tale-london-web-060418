const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyCollection = document.querySelector('#toy-collection')

const baseUrl = 'http://localhost:3000'
const toysUrl = baseUrl + '/toys'

const state = {
  toys: [],
  addToy: false,
}

// YOUR CODE HERE
document.addEventListener('DOMContentLoaded', () => {

  // Fetch all toys and render
  fetch(toysUrl)
  .then( resp => resp.json() )
  .then( toys => {
    state.toys = toys
    toys.forEach( toy => renderToyCard(toy) )
  })
})

addBtn.addEventListener('click', event => {
  const { addToy } = state
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})

toyForm.addEventListener('submit', event =>{
  event.preventDefault()

  toyInfo = {
    name: event.target.name.value,
    image: event.target.image.value,
    likes: 0,
  }

  fetch(toysUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(toyInfo)
  })
  .then( resp => resp.json() )
  .then( renderToyCard )
})

const renderToyCard = toy => {
  newToyCard = document.createElement('div')
  newToyCard.className = "card"
  newToyCard.dataset.id = toy.id

  newToyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar"></img>
    <p>${toy.likes} Likes</p>
    <button class="like-btn">Like <3</button>
  `
  newToyCard.querySelector('button').addEventListener('click', increaseLikes)

  toyCollection.appendChild(newToyCard)
}

const increaseLikes = event => {
  const toyId = event.target.parentElement.dataset.id
  const targetToy = state.toys.find( toy => toy.id == toyId )

  fetch(toysUrl + `/${toyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ likes: ++targetToy.likes })
  })
  .then( resp => resp.json() )
  
  event.target.parentElement.querySelector('p').innerText = `${targetToy.likes} Likes`
}

