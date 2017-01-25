// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // // deleteMany - delete all the matches
  // db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });
  //
  // // deleteOne - only deletes the first match it finds
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });
  //
  // // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then(result) => {
  //   console.log(result);
  // });

  // Delete all the Nik's
  db.collection('Users').deleteMany({name: 'Nik'}).then((result) => {
    console.log(result);
  });

  // Delete and print the info for first record with Perry Hall
  db.collection('Users').findOneAndDelete({location: 'Perry Hall'}).then((result) => {
    console.log(result);
  });


  // db.close();
});
