const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  // make sure id is valid
  if (!ObjectID.isValid(id)) {
    // if not valid, respond with 404 - send back empty send
    return res.status(404).send();
  }

  // findById - look for matching document
  Todo.findById(id).then((todo) => {
    if (todo) {
      res.send({todo});
    } else {
      res.status(404).send();
    }
  }).catch((e) => {
    res.status(400).send();
  });
    // success
      // if found, send it back
      // if not, send back 404 with empty body
    // Error
      // 400 - and send empty body back
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = { app };
// const user1 = new User({
//   email: 'nikob@mail.org'
// });
//
// user1.save().then((doc) => {
//   console.log('Saved user ' + doc);
// }, (e) => {
//   console.log('Could not save user');
// });

// var newTodo = new Todo({
//   text: 'Cook dinner'
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved todo', doc);
// }, (e) => {
//   console.log('Unable to save todo');
// });

// const todo2 = new Todo({
//   text: 'Go to sleep',
//   completed: true,
//   completedAt: 9
// });
//
// todo2.save().then((doc) => {
//   console.log('Saved todo', doc);
// }, (e) => {
//   console.log('Could not save');
// });
