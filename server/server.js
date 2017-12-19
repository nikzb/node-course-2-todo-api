require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

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
  const id = req.params.id;

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

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// app.post('/users', (req, res) => {
//   const body = _.pick(req.body, ['email', 'password']);
//
//   console.log(body);
//   console.log(req.body);
//   // const bo
//   const user = new User(body);
//
//   user.save().then((userDoc) => {
//     res.send(userDoc);
//   }).catch((e) => {
//     res.status(400).send(e);
//   });
// });

// POST /users
app.post('/users', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  try {
    // const user = await user.save();
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch(e) {
    res.status(400).send(e);
  }
});

// POST /users/login
app.post('/users/login', async (req, res) => {
  console.log('in post users/login');
  const body = _.pick(req.body, ['email', 'password']);

  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }

  // try {
  //   const user = await User.findOne({ email: body.email });
  //   console.log(user);
  //
  //   const response = await bcrypt.compare(body.password, user.password); //, (err, res) => {
  //     console.log('response: ' + response);
  //
  //     if (response) {
  //       return res.status(200).send(body);
  //     }
  //
  //     return res.status(400).send('Fail');
  //
  // }
  // catch (e) {
  //   res.status(400).send(e);
  // }
});


app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
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
