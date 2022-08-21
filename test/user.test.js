const request = require('supertest')
const app = require('../src/app')
const User = require('../src/modules/user')
const { userOneId, userOne, setup } = require('./fixtures/db.js')


beforeEach(setup)

// test('should sign up a new user', async () => {
//     const respone = await request(app).post('/users').send({
//         name: 'andrew',
//         email: "khaled@example.com",
//         password: "MyPass777!"
//     }).expect(201)

//     const user = await User.findById(respone.body.user._id)
//     expect(user).not.toBeNull()
// })

test('should log in existing user', async () => {
    const respone = await request(app).post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
    const user = await User.findById(respone.body.user._id)
    expect(respone.body.token).toBe(user.tokens[1].token)
})

test('should log in existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: "somerandomemail@example.com",
            password: userOne.password
        })
        .expect(400)
})

test('should get profile for the authorize user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not get profile for the nonauthorize user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

// test('should delete account for user', async () => {
//     await request(app)
//         .delete('/users/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200)
//     const user = await User.findById(userOne._id)
//     expect(user).toBeNull()
// })
test('should not delete account for nonauthorize user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('should update avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/p1.jpg')
        .expect(200)

    // const user = await User.findById(userOneId)
    // expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "khaled"
            , email: "something@something.com"
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toBe('khaled')
    expect(user.email).toBe("something@something.com")
})

test('should not update unvalid fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "khaled"
            , email: "something@something.com"
            , location: "south africa"
        })
        .expect(400)
    //not adding that will be over killed
    // const user = await User.findById(userOneId)
    // expect(user.name).toBe('mike')
    // expect(user.email).toBe("mike@example.com")
})