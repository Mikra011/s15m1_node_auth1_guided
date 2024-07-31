const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../users/users-model')

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const hash = bcrypt.hashSync(password, 8) // number of salt rounds (2 ^ 8 = 256). 
        const newUser = { username, password: hash }
        const result = await User.add(newUser)
        res.status(201).json({
            message: `Welcome here ${result.username}!`
        })
    } catch (err) {
        next(err)
    }
})
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const [user] = await User.findBy({ username })
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user // important!!
            res.json({ message: `welcome back ${user.username}` })
        } else {
            next({
                status: 401,
                message: 'bad credentials'
            })
        }

    } catch (err) {
        next(err)
    }
})
router.get('/logout', async (req, res, next) => {
    if (req.session.user) {
        const { username } = req.session.user
        req.session.destroy(err => {
            if (err) {
                res.json({ message: `You can never leave ${username}`})
            } else {
                res.json({ message: `Goodbye ${username}`})
            }
        })
    } else {
        res.json({
            message: 'Sorry I don not know you'
        })
    }
})

module.exports = router