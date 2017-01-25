const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(3000, () => {
  console.log('Started on port 3000');
});

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
