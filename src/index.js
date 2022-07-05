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


const toysContainer = document.getElementById( "toy-collection" )

const toysUrl = 'http://localhost:3000/toys'

// example of 'dot-then' with old function syntax
// fetch( 'http://localhost:3000/toys' ).then( function(respObj) {} )


fetch( toysUrl )
	.then( respObj => respObj.json() )
	.then( toysArray => {
		toysArray.forEach( toyObj => {
			renderToy( toyObj )
		} )
	} )

function renderToy( theToyObj ) {
	const theDiv = document.createElement( 'div' )
	theDiv.className = 'card'
	
	const nameElement = document.createElement( 'h2' )
	nameElement.textContent = theToyObj.name

	const imageElement = document.createElement( 'img' )
	imageElement.src = theToyObj.image
	imageElement.className = 'toy-avatar'

	const likesElement = document.createElement( 'p' )
	
	
	//if we didn't want the whole splitting and joining solution
	//likesElement.innerHTML = `<span>${theToyObj.likes}</span> likes`

	const likeBtn = document.createElement( 'button' )
	likeBtn.textContent = 'Like ❤️'
	likeBtn.className = 'like-btn'
	likeBtn.id = theToyObj.id
	likeBtn.addEventListener( 'click', () => 
		addLike( likesElement, theToyObj ) )

	theDiv.append( nameElement, imageElement, likesElement, likeBtn )
	toysContainer.append( theDiv )
}

function addLike( theLikesElement, thatToyObj ) {
	//if we didn't want the whole splitting and joining solution
	// theLikesElement.querySelector( 'span' )


	// we need to get the current number of likes, from the DOM, because
	// when we update the DOM, that's the only place that knows the current
	// "new" number of likes
	const oldlikesNumber = parseInt(theLikesElement.textContent.split( ' ' )[0])
	const newLikesNumber = oldlikesNumber + 1
	const toyId = thatToyObj.id
	fetch( `http://localhost:3000/toys/${toyId}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify( {
			likes: newLikesNumber
		} )
	} )
		.then( resp => resp.json() )
		.then( ourNewlyUpdatedToy => {
			const theString = theLikesElement.textContent
			const ourSplitArray = theString.split( ' ' )
			ourSplitArray[0] = ourNewlyUpdatedToy.likes
			theLikesElement.textContent = ourSplitArray.join( ' ' )
		} )

}



const newToyForm = document.querySelector( 'form' )

newToyForm.addEventListener( 'submit', eventObj => {
	eventObj.preventDefault()
	
	const newToyObj = {
		name: eventObj.target.name.value,
		image: eventObj.target.image.value,
		likes: 0
	}

	fetch( toysUrl, {
		method: 'POST', 
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify( newToyObj )
	} )
		.then( respObj => respObj.json() )
		.then( aFreshNewToyObj => {
			renderToy( aFreshNewToyObj )
		} )


	// use our renderToy function perhaps?  :)
} )
