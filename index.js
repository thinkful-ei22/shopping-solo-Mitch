'use strict';

const STORE = {
  items: [
    {id: cuid(), name: 'apples', checked: false},
    {id: cuid(), name: 'oranges', checked: false},
    {id: cuid(), name: 'milk', checked: true},
    {id: cuid(), name: 'bread', checked: false},
    {id: cuid(), name: 'butter', checked: true}
  ],
  hideChecked: false
};

function generateItemElement(item) {
  return `
    <li class="js-item-index-element" data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
          <span class="button-label">edit</span>
        </button>
      </div>
    </li>`;
}

function generateShoppingItemsString(shoppingList) {
  //console.log("Generating shopping list element");
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join('');
}

function renderShoppingList(list = STORE.items) {
  // render the shopping list in the DOM
  //console.log('`renderShoppingList` ran');
  if (STORE.hideChecked === true) {
    let filteredItems = list.filter(item => item.checked === false);
    let filteredItemsChecked = generateShoppingItemsString(filteredItems);
    $('.js-shopping-list').html(filteredItemsChecked); 
  } else {
    const shoppingListItemsString = generateShoppingItemsString(list);
    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);  
  }
}

function findItemByID(id) {
  return STORE.items.find(x => x.id === id);
}

function addItemToShoppingList(itemName) {
  //console.log(`Adding "${itemName}" to shopping list`);
  //how to handle NEXT ID
  STORE.items.push({id: cuid(), name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    console.log('this is ' + newItemName);
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();

  });
  // console.log('`handleNewItemSubmit` ran');
  
}

function toggleCheckedForListItem(id) {
  //console.log('Toggling checked property for item at id ' + id);
  findItemByID(id).checked = !findItemByID(id).checked;
}

function getItemIDFromElement(item) {
  return $(item).closest('.js-item-index-element').data('item-id');
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    //console.log('`handleItemCheckClicked` ran');
    const id = getItemIDFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    renderShoppingList();
  });
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // alert('`handleDeleteItemClicked` ran');
    const id = getItemIDFromElement(event.currentTarget);
    deleteItemFromShoppingList(id);
    console.log(id);
    renderShoppingList();
  });
}

function deleteItemFromShoppingList(id){
  const item = findItemByID(id);
  STORE.items.splice(item, 1);
}


// Filter items with toggle switch
function handleFilterSwitch(){
  $('input[type=checkbox]').on('change', function(){
    console.log($(this).is(':checked'));
    event.preventDefault();
    if ($(this).is(':checked') === true) {
      STORE.hideChecked = true;
      //renderShoppingList();
    }
    else {
      STORE.hideChecked = false;
      //renderShoppingList();
    }
    renderShoppingList();
  });
}

// Filter items by keyword or partial
function handleFilterSearch(){
  $('#filter-search-form').submit(function(event) {
    event.preventDefault();
    const searchName = $('.js-filter-search').val();
    //console.log(searchName);
    if (searchName === '') {
      renderShoppingList();
    } 
    else {
      let filteredList = STORE.items.filter(STORE => STORE.name.includes(searchName));
      renderShoppingList(filteredList);
    }
  });

}

// Edit item names
function editItemName(id, input) {
  //console.log(`Item name changed to ${input}`);
  findItemByID(id).name = input;
}

function handleEditItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    const id = getItemIDFromElement(event.currentTarget);
    const input = prompt('Edit item text:');
    editItemName(id, input);
    renderShoppingList();
  });
}



// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleFilterSwitch();
  handleFilterSearch();
  handleEditItemClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);