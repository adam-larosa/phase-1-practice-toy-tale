let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
	const addBtn = document.querySelector("#new-toy-btn");
	const toyFormContainer = document.querySelector(".container");
	addBtn.addEventListener("click", () => {
		// hide & seek with the form
		addToy = !addToy;
		if (addToy) {
			toyFormContainer.style.display = "block";
		} else {
			toyFormContainer.style.display = "none";
		}
	});
});



fetch( 'http://localhost:3000/toys' )
	.then( r => r.json() )
	.then( toysArray => {
		toysArray.forEach( toyObject => {
			renderToy( toyObject )
		} )
	} )


const toysContainer = document.getElementById( 'toy-collection' )
const newToyForm = document.querySelector( '.add-toy-form')



newToyForm.addEventListener( 'submit', e => {
	e.preventDefault()

	// what we send needs to look like what's in the database
	const newToyObj = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
    }
	
	fetch( 'http://localhost:3000/toys', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify( newToyObj )
	} )
		.then( r => r.json() )
		.then( freshToy => {
			renderToy( freshToy )
		} )
} ) // end of toyForm event listener



function renderToy( toyObj ) {

	const div = document.createElement( 'div' )
	div.className = 'card' 

	div.innerHTML = `
		<h2></h2>
		<img class="toy-avatar" />
		<p></p>
		<button class="like-btn">Like ❤️</button>
	`
	div.querySelector( 'h2' ).innerText = toyObj.name
	div.querySelector( 'img' ).src = toyObj.image
	div.querySelector( 'p' ).innerText = `${toyObj.likes} likes`
	const button = div.querySelector( 'button' )
	button.id = toyObj.id
	button.addEventListener( 'click', increaseLikes )

	// ...the one by one way....
	// const h2 = document.createElement( 'h2' )
	// h2.innerText = toyObj.name

	// const img = document.createElement( 'img' )
	// img.src = toyObj.image
	// img.className = 'toy-avatar'

	// div.append( h2, img )
	
	toysContainer.append( div )
}

function increaseLikes( e ) {

	const id = e.target.id

	const likesElement = e.target.parentElement.querySelector( 'p' )
	splitStringArray = likesElement.innerText.split( ' ' )
	const newNumber = parseInt( splitStringArray[0] ) + 1

	fetch( `http://localhost:3000/toys/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify( {
			likes: newNumber
		} )
	} )
		.then( r => r.json() )
		.then( someFreshToyObj => {
			likesElement.innerText = `${someFreshToyObj.likes} likes`
		} )
}