const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/modules/task')
const { userOne, userTwo, taskOne, setup } = require('./fixtures/db.js')

beforeEach(setup)

test('should create a task', async () => {
    const respone = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "creating a test"
        })
        .expect(201)

    const task = await Task.findById(respone.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('should get tasks', async () => {
    const respone = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    expect(respone.body.length).toBe(2)
})

test('should not delete other tasks', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})