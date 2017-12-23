const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', () => {
    const text = 'Test todo text';

    return request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .then(async (response) => {
        try {
          const todos = await Todo.find({text});
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
        } catch (e) {
          throw new Error('Could not get all todos');
        }
      }).catch((err) => {
        throw new Error('Could not get all todos');
      });
  });

  it('should not create todo with invalid body data', () => {
    return request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .then(async (response) => {
        try {
          const todos = await Todo.find();
          expect(todos.length).toBe(2);
        } catch (e) {
          throw new Error(e);
        }
      }).catch((err) => {
        throw new Error(err);
      });
  });
});

// describe('GET /todos', () => {
//   it('should get all todos', (done) => {
//     request(app)
//       .get('/todos')
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todos.length).toBe(1);
//       })
//       .end(done);
//   });
// });

describe('GET /todos', () => {
  it('should get all todos', () => {
    return request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .catch((e) => { throw new Error(e); });
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', () => {
    const hexId = todos[1]._id.toHexString();

    return request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .then(async (response) => {
        try {
          const todo = await Todo.findById(hexId);
          expect(todo).toBeFalsy();
        } catch (e) {
          throw new Error('Todo was not deleted');
        }
      }).catch((e) => {
        throw new Error('Todo was not deleted');
      });
  });

  it('should not remove a todo for other user', () => {
    const hexId = todos[0]._id.toHexString();

    return request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .then(async (response) => {
        try {
          const todo = await Todo.findById(hexId);
          expect(todo).toBeTruthy();

        } catch (e) {
          throw new Error(e);
        }
      }).catch((err) => {
        throw new Error(err);
      });
  });

  it('should return 404 if todo not found', (done) => {
    const hexId = new ObjectID().toHexString();
    console.log(hexId);
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .delete(`/todos/123abc`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    const id = todos[0]._id.toHexString();
    const newText = 'New todo text';
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({text: newText, completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(newText);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should not update the todo created by another user', (done) => {
    const id = todos[0]._id.toHexString();
    const newText = 'New todo text';
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({text: newText, completed: true})
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    const id = todos[1]._id.toHexString();
    const newText = 'New todo text';
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({text: newText, completed: false})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(newText);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
})

describe('POST /users', () => {
  it('should create a user', () => {
    const email = 'example@example.com';
    const password = '123mnb!';

    return request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .then (async (response) => {
        try {
          const user = await User.findOne({email});
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
        } catch (e) {
          throw new Error(e);
        }
      }).catch((err) => {
        throw new Error(err);
      });
  });

  it('should return validation errors if request invalid', (done) => {
    const email = 'hi';
    const password = 'yo';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    const email = users[0].email;
    const password = users[0].password;
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
})

describe('POST /users/login', () => {
  it('should login user and return auth token', () => {
    return request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .then(async (response) => {
        try {
          const user = await User.findById(users[1]._id);
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: response.headers['x-auth']
          });
        } catch (e) {
          throw new Error(e);
        }
      }).catch((e) => {
        throw new Error(e);
      });
  });

  it('should reject invalid login', () => {
    return request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .then(async (response) => {
        try {
          const user = await User.findById(users[1]._id);
          expect(user.tokens.length).toBe(1);
        } catch (e) {
          throw new Error(e);
        }
      }).catch(e => { throw new Error(e) });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', () => {
    return request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .then(async (response) => {
        try {
          const user = await User.findById(users[0]._id);
          expect(user.tokens.length).toBe(0);
        } catch (e) {
          throw new Error(e);
        }
      }).catch(e => { throw new Error(e) });
  });
});
