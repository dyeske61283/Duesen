const uri = 'api/Posts';
let posts = [];

function getPosts() {
  fetch(uri)
    .then(response => response.json())
    .then(data => _displayPosts(data))
    .catch(error => console.error('Unable to get posts.', error));
}

function addPost() {
  const addHeadingTextbox = document.getElementById('add-heading');
  const addAuthorTextbox = document.getElementById('add-author');
  const addTagsTextbox = document.getElementById('add-tags');
  const addCategoriesTextbox = document.getElementById('add-categories');
  const addContentTextbox = document.getElementById('add-content');
  const createdDateTime = new Date();
  let id = 0;
  posts.forEach(post => {
	  id = Math.max(parseInt(post.Id, 10), id);
  });
  id++;
  const post = {
	Id: id.toString(),
	Heading: addHeadingTextbox.value.trim(),
	Author: addAuthorTextbox.value.trim(),
	Tags: addTagsTextbox.value.trim(),
	Categories: addCategoriesTextbox.value.trim(),
	Content: addContentTextbox.value.trim(),
	Created: createdDateTime,
	LastModified: createdDateTime
  };

  fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(post)
  })
    .then(response => response.json())
    .then(() => {
      	getPosts();
        addHeadingTextbox.value = '';
	  	addAuthorTextbox.value = '';
		addTagsTextbox.value = '';
		addCategoriesTextbox.value = '';
		addContentTextbox.value = '';
    })
    .catch(error => console.error('Unable to add post.', error));
}

function deletePost(id) {
  fetch(`${uri}/${id}`, {
    method: 'DELETE'
  })
  .then(() => getPosts())
  .catch(error => console.error('Unable to delete post.', error));
}

function displayEditForm(id) {
  const post = posts.find(post => post.id === id.toString());
  
  document.getElementById('edit-heading').value = post.heading;
  document.getElementById('edit-author').value = post.author;
  document.getElementById('edit-tags').value = post.tags;
  document.getElementById('edit-categories').value = post.categories;
  document.getElementById('edit-content').value = post.content;
  document.getElementById('edit-id').value = post.id;
  document.getElementById('editForm').style.display = 'block';
  
}

function updatePost() {
  const postId = document.getElementById('edit-id').value;
  const postOld = posts.find(post => post.id === postId);
  const creationDate = postOld.Created;
  const modifiedDate = new Date();
  const post = {
    id: postId,
	Heading: document.getElementById('edit-heading').value.trim(),
	Author: document.getElementById('edit-author').value.trim(),
	Tags: document.getElementById('edit-tags').value.trim(),
	Categories: document.getElementById('edit-categories').value.trim(),
	Content: document.getElementById('edit-content').value.trim(),
	Created: creationDate,
	LastModified: modifiedDate
  };

  fetch(`${uri}/${postId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(post)
  })
  .then(() => getPosts())
  .catch(error => console.error('Unable to update post.', error));

  closeInput();

  return false;
}

function closeInput() {
  document.getElementById('editForm').style.display = 'none';
}

function _displayCount(postCount) {
  const name = (postCount === 1) ? 'Post' : 'Posts';

  document.getElementById('counter').innerText = `${postCount} ${name}`;
}

function _displayPosts(data) {
  const tBody = document.getElementById('Posts');
  tBody.innerHTML = '';

  _displayCount(data.length);

  const button = document.createElement('button');

  data.forEach(post => {

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.setAttribute('onclick', `displayEditForm(${post.id})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
	deleteButton.setAttribute('onclick', `deletePost(${post.id})`);

    let tr = tBody.insertRow();
    
	let td1 = tr.insertCell(0);
	let headingNode = document.createTextNode(post.heading);
    td1.appendChild(headingNode);

    let td2 = tr.insertCell(1);
    let authorNode = document.createTextNode(post.author);
    td2.appendChild(authorNode);

    let td3 = tr.insertCell(2);
    td3.appendChild(editButton);

    let td4 = tr.insertCell(3);
    td4.appendChild(deleteButton);
  });

  posts = data;
}