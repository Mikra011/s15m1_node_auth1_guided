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
    res.json({ message: 'login works' })
})
router.get('/logout', async (req, res, next) => {
    res.json({ message: 'logout works' })
})

module.exports = router