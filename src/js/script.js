const commentUrl = 'https://my-json-server.typicode.com/NataliiaNechyporenko/TestTask/comments';
const comments = document.querySelector('.comments');
let count = 5;
let commentsData = [];
let currentUser = {
  id: 1,
};

let buttons = {
  "replyBtn": (event) => {
    const replyBtn = parseInt(event.target.id);
    const addReplyBlock = document.getElementById(`${replyBtn}addreplyTo`);
    addReplyBlock.style.display = "flex";
  },
  "cancelReplyBtn": (event) => {
    const cancelReplyBtn = parseInt(event.target.id);
    const addReplyBlock = document.getElementById(`${cancelReplyBtn}addreplyTo`);
    const cancelEditBlock = document.getElementById(`${cancelReplyBtn}editBlock`);
    console.log(addReplyBlock);
    addReplyBlock.style.display = "none";
    cancelEditBlock.style.display = "none";
  },
  "addCommentBtn": (event) => {
    addComment(event);
  },
  "deleteBtn": (event) => {
    deleteComment(event);
  },
  "editBtn": (event) => {
    let commentId = parseInt(event.target.id);
    const editCommentBlock = document.getElementById(`${commentId}editBlock`);
    editCommentBlock.style.display = "flex";
    let content = document.getElementById(`${commentId}editCommentText`);
    let commentToEdit = commentsData.filter(comment => comment.id === commentId);

    content.value = commentToEdit[0].content;
  },
  "sendEditComment": (event) => {
    editComment(event)
  },
  "load-more": (event) => {
    count += 5;
    getComments();
  },
};

let btnHandler = () => {
  let target = event.target;
  for (let key in buttons) {
       if(target.className.includes(key)) {
          buttons[key](event);
       }
   };
};

function isCurrentUser(comment) {
  let btnEdit = document.getElementById(`${comment.id}Edit`);
  let btnDelete = document.getElementById(`${comment.id}Delete`);

  if (comment.author.id !== currentUser.id) {
    btnEdit.style.display = "none";
    btnDelete.style.display = "none";
  };
};

function renderComment(comment) {
  if (comment.children) {
    let replyes = comment.children.map(reply => {
      reply.to = comment.author.name;
      return renderReply(reply);
    }).join('');
    comment.replyes = replyes;
  }

  const tmpl = _.template(document.getElementById('comment-template').innerHTML);
  let compiled = tmpl(comment);
  let div = document.createElement("div");

  div.setAttribute("id", ("comment-" + comment.id));
  div.innerHTML = compiled;
  comments.appendChild(div);
};

function renderReply(reply) {
  const replyTmpl = _.template(document.getElementById('reply-template').innerHTML);
  let replyWrapper = document.createElement("div");

  replyWrapper.setAttribute("id", ("reply-" + reply.id));
  replyWrapper.innerHTML = replyTmpl(reply);
  return replyWrapper.innerHTML;
};

const getComments = () => {
  comments.innerHTML = '';
  document.querySelector('#commentText').value = '';
  
  fetch(`${commentUrl}?count=${count}`)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Error fetching' + response.statusText);
        })
        .then(data => {
          commentsData = data.slice();

          data.map((comment) => {
              renderComment(comment);
              isCurrentUser(comment);
          });
        })
        .catch(err => console.log(err))
};

function addComment(event) {
  let parentCommentId = parseInt(event.target.id);
  console.log(parentCommentId);
  let newComment = {};
  let content = document.querySelector('#commentText').value;
  let replyTextarea = document.getElementById(`${parentCommentId}addReply`);
  let replyContent = '';
  if (!isNaN(parentCommentId)) {
    replyContent = replyTextarea.value;
  };
  
  if (content || replyContent) {
    newComment.headers = {
      'Content-Type': 'application/json'
    };
    newComment.method = "POST";

    if (!isNaN(parentCommentId)) {
      newComment.body = JSON.stringify({
        "content": replyContent,
        "parent": parentCommentId,
      });
    } else {
      newComment.body = JSON.stringify({
        "content": content,
      });
    };

    fetch(commentUrl, newComment)
    .then(response => {
      if (response.ok) {
        response.json();
      } else {
        throw new Error("Error fetching data. Response status: " + response.status + " : " + response.statusText);
      }
    })
    .then(getComments)
    .catch(err => {
      console.error("Error: ", error);
    });
  };
};

function deleteComment(event) {
  let commentId = parseInt(event.target.id);

  fetch(`${commentUrl}/${commentId}`, {
    method: 'delete',
  })
  .then(response => {
    if (response.ok) {
      getComments();
    } else {
      throw new Error("Error fetching data. Response status: " + response.status + " : " + response.statusText);
    }
  })
  .catch(err => {
    console.error("Error: ", err);
  });
};

function editComment(event) {
  let editedComment = {};
  let commentId = parseInt(event.target.id);
  let content = document.getElementById(`${commentId}editCommentText`).value;

  if (content) {
    editedComment.headers = {
      'Content-Type': 'application/json'
    };
    editedComment.method = "PUT";
    editedComment.body = JSON.stringify({
        "content": content,
      });
  };

  fetch(`${commentUrl}/${commentId}`, editedComment)
  .then(response => {
    if (response.ok) {
      getComments()
    } else {
      throw new Error("Error fetching data. Response status: " + response.status + " : " + response.statusText);
    }
  })
  .catch(err => {
    console.error("Error: ", err);
  });
};

window.onload = getComments();
document.addEventListener("click", btnHandler);

