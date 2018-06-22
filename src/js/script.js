
const url = 'http://frontend-test.pingbull.com/pages/ns.nechyporenko@gmail.com/comments';
let comments = [];

const getComments = () => fetch(`${url}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
      throw new Error("Error fetching data. Response status: " + response.status + " : " + response.statusText);
  })
  .then(data => {
    console.log(data);
    comments = data;
    console.log(`comments`, comments);
  })
  .catch(err => console.log(err));

  getComments();


