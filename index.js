'use strict';

const STORE = [
  {name: 'apples', checked: false},
  {name: 'oranges', checked: false},
  {name: 'milk', checked: true},
  {name: 'bread', checked: false},
  {name: 'butter', checked: true}
];

function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
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
  console.log('Generating shopping list element');
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

function renderShoppingList(list = STORE) {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(list);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();

    const newItemName = $('.js-shopping-list-entry').val();
    console.log(newItemName);
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();

  });
  // console.log('`handleNewItemSubmit` ran');
  
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index'  + itemIndex);
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}


function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // alert('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteItemFromShoppingList(itemIndex);
    renderShoppingList();
  });
}

function deleteItemFromShoppingList(itemIndex){
  STORE.splice(itemIndex,1);
}

function handleFilterList(){
  $('input[type=checkbox]').on('change', function(){
    console.log($(this).is(':checked'));
    if ($(this).is(':checked') === true) {
      $('.shopping-item__checked').closest('li').hide('slow');
    }
    else {
      $('.shopping-item__checked').closest('li').show('slow');
    }
  });
}

// Filter items by keyword or partial
function handleFilterSearch(){
  $('#filter-search-form').submit(function(event) {
    event.preventDefault();

    const searchName = $('.js-filter-search').val();
    console.log(searchName);

    if (searchName === '') {
      renderShoppingList();
    } 
    else {
      let filteredList = STORE.filter(STORE => STORE.name.includes(searchName));
      renderShoppingList(filteredList);
    }
  });

}

//Edit item names 
function editItemName(index, input) {
  console.log(`Item name changed to ${input}`);
  STORE[index].name = input;
}

function handleEditItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    const index = getItemIndexFromElement(event.currentTarget);
    const input = prompt('Edit item text');
    editItemName(index, input);
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
  handleFilterList();
  handleFilterSearch();
  handleEditItemClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);