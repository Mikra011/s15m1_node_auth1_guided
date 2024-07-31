async function protect(req, res, next) {
    console.log('protecting')
    next()
}

module.exports = {
    protect
}