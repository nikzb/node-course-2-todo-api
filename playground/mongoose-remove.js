const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

// Todo.findOneAndRemove({_id: '588944e702101d0ad77d7c3a'}).then((todo) => {
//   console.log(todo);
// });
//
// Todo.findByIdAndRemove('588944e702101d0ad77d7c3a').then((todo) => {
//   console.log(todo);
// });
