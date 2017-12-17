const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const password = '123abc!';

// const getHash = async function getHash(password) {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);
//
//     console.log(hash);
//   } catch (e) {
//     console.log(1, e);
//   }
// };
//
// getHash(password);

const hashedPassword = '$2a$10$mDPg6qsU2g5m1Iu5lSq3Tev4lfsG5BkILi/Zs/nhymypAZrbRz4P6';

bcrypt.compare('123', hashedPassword, (err, res) => {
  console.log(res);
});

// const data = {
//   id: 10
// };
//
// // inputs: data to hash, secret to use for salting
// const token = jwt.sign(data, '123abc');
// console.log(token);
//
// const decoded = jwt.verify(token, '123abcd');
// console.log('decoded', decoded);
// const message = 'I am user number 3';
//
// const hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// const data = {
//   id: 4
// };
//
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secret').toString()
// };
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// const resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust');
// }
