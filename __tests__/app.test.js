require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns todos', async() => {

      const expectation = [];

      const data = await fakeRequest(app)
        .get('/api/todos')
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    test('post todos', async() => {

      const expectation =  [{
        id:7,
        todo: 'clean car', 
        completed: false, 
        owner_id:2
      }];

      const data = await fakeRequest(app)
        .post('/api/todos')
        .send({
          todo: 'clean car', 
          completed: expect.any(String), 
        })
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('puts a todo', async()=> {
      const expectation = {
        id: expect.any(Number), 
        todo: 'clean car', 
        completed: true,
        owner_id: expect.any(Number)
      };
      const data = await fakeRequest(app)
        .put('/api/todos/7')
        .send({
          completed: true
        })
        .set('Authorization', token)
        .expect('Content-Type', /json/);
        //.expect(200);

      expect(data.body).toEqual(expectation);
    }); 
  });
});

