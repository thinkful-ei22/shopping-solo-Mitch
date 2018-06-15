'use strict';

// `STORE` is responsible for storing the underlying data
// that our app needs to keep track of in order to work.
//
// for a shopping list, our data model is pretty simple.
// we just have an array of shopping list items. each one
// is an object with a `name` and a `checked` property that
// indicates if it's checked off or not.
// we're pre-adding items to the shopping list so there's
// something to see when the page first loads.
const STORE = [
  {id: 1, name: "apples", checked: false},
  {name: "oranges", checked: false},
  {name: "milk", checked: true},
  {name: "bread", checked: false},
  {name: "butter", checked: true}
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
      </div>
    </li>`;
}

function generateShoppingItemsString(shoppingList) {
  // console.log("Generating shopping list element");
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

function renderShoppingList() {
  // render the shopping list in the DOM
  // console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE);
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
  // this function will be responsible for when users click the "check" button on
  // a shopping list item.
  // Listen for when a user clicks the 'check' button on an item.
  // Retrieve the item's index in STORE from the data attribute.
  // Toggle the checked property for the item at that index in STORE.
  // Re-render the shopping list.
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
      //alert('check');
      $('.shopping-item__checked').closest('li').hide('slow');
    }
    else {
      //alert('unchecked');
      $('.shopping-item__checked').closest('li').show('slow');
    }
  });
}

function handleFilterSearch(){
  $('#filter-search-form').submit(function(event) {
    event.preventDefault();

    const searchName = $('.js-filter-search').val();
    console.log(searchName);
    //$('.js-filter-search').val('');
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
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);