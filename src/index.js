document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM has been fully loaded')
  // console.table(gifts)
  giftList = document.querySelector('.gift-list');

  gifts = "";
  giftId = "";

  fetch("http://localhost:3000/gifts")
    .then(rest => rest.json())
    .then(json => { gifts = json })
    .then(runAfterFetch); // created to run after items fetched, then takes a callback as an argument.


  document.querySelector('#filter-input').addEventListener('keyup', filter)
});




function runAfterFetch() {
  loadGifts(giftList);
  newGift();
}

function loadGifts(giftList) {

  if (gifts) {
    document.querySelector('.gift-list li').remove();

    gifts.forEach(function (gift) {
      let newElement = document.createElement('li');


      newElement.innerHTML = `<p> ${gift.name} </p> <img src=${gift.image}> `

      if (gift.id) {
        newElement.id = `${gift.id}`
        giftId = gift.id;
      }


      giftList.append(newElement);
      let deleteBtn = document.createElement('button');
      deleteBtn.innerText = 'delete';
      newElement.append(deleteBtn);
      deleteBtn.addEventListener('click', deleteGift);
    })
  }

}

function deleteGift(e) {
  let idToDelete = e.target.parentNode.id;
  fetch(`http://localhost:3000/gifts/${idToDelete}`, {
    method: 'DELETE'
  }).then(runAfterFetch)


}

function newGift(e) {
  let form = document.querySelector('#new-gift-form');

  form.addEventListener('submit', createGift);

}

function createGift(e) {
  e.preventDefault();
  newName = document.querySelector("#gift-name-input").value
  newImage = document.querySelector("#gift-image-input").value

  const giftList = document.querySelector('.gift-list');
  newLi = document.createElement('li');
  newLi.innerHTML = `<p>${newName} </p> <img src=${newImage}> `

  newLi.setAttribute('id', ++giftId)
  giftList.append(newLi);

  saveGift(newLi);

  let deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'delete';
  newLi.append(deleteBtn);
  deleteBtn.addEventListener('click', deleteGift);
}


function filter(e) {
  const text = e.target.value

  let allGifts = document.querySelectorAll('.gift-list li p');

  let allGiftsArray = Array.from(allGifts)

  allGiftsArray.forEach(function (gift, index) {
    if (gift.innerText.includes(text)) {
      allGifts[index].parentElement.style.display = 'block'
    } else {
      allGifts[index].parentElement.style.display = 'none';
    }
  });
}


function saveGift(gift) {
  fetch("http://localhost:3000/gifts", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: parseInt(gift.id),
      name: gift.querySelector('p').innerText,
      image: gift.querySelector('img').src
    })
  })
} 
