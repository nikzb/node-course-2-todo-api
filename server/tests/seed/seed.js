const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'niko@bc.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'niko2@bb.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];

// const populateTodos = (done) => {
//   Todo.remove({}).then(() => {
//     return Todo.insertMany(todos);
//   }).then(() => done());
// };

const populateTodos = async () => {
  await Todo.remove({});
  await Todo.insertMany(todos);
};

// const populateUsers = (done) => {
//   User.remove({}).then(() => {
//     const userOne = new User(users[0]).save();
//     const userTwo = new User(users[1]).save();
//
//     return Promise.all([userOne, userTwo]);
//   }).then(() => done());
// };

const populateUsers = async () => {
  await User.remove({})

  await Promise.all([
    new User(users[0]).save(),
    new User(users[1]).save()
  ])
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
