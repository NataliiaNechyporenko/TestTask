console.log('hello!');
const commentUrl = 'http://frontend-test.pingbull.com/pages/ns.nechyporenko@gmail.com/comments';
const comments = document.querySelector('.comments');

let buttons = {
  "replyBtn": (event) => {
    const replyBtn = event.target.id;
    const addReplyBlock = document.getElementById(`add${replyBtn}`);
    addReplyBlock.style.display = "flex";
  },
  "cancelReplyBtn": (event) => {
    const cancelReplyBtn = event.target.id.slice(11);
    const addReplyBlock = document.getElementById(`addreplyTo${cancelReplyBtn}`);
    console.log(addReplyBlock);
    addReplyBlock.style.display = "none";
  },
  "addCommentBtn": (event) => {
    addComment(event);
  }
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
    fetch(commentUrl)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Error fetching' + response.statusText);
        })
        .then(data => {
          comments.innerHTML = '';
          document.querySelector('#commentText').innerHTML = '';
          data.forEach((comment) => {
              renderComment(comment);
          });
        })
        .catch(err => console.log(err))
  };

let btnHandler = () => {
  let target = event.target;
  for (let key in buttons) {
       if(target.className.includes(key)) {
          buttons[key](event);
       }
   };
};

document.addEventListener("click", btnHandler);

function addComment() {
  console.log('clicked send')
  let newComment = {};
  let content = document.querySelector('#commentText').value;
  if (content) {
    newComment.headers = {
      'Content-Type': 'application/json'
    };
    newComment.method = "POST";
    newComment.body = JSON.stringify({
      "content": content,
    });

    fetch(commentUrl, newComment)
    .then(response => {
      if (response.ok) {
        response.json();
      } else {
        throw new Error("Error fetching data. Response status: " + response.status + " : " + response.statusText);
      }
    })
    .then(getComments()).then(window.location.reload())
    .catch(err => {
      console.error("Error: ", err);
    });
  };
};

getComments();
