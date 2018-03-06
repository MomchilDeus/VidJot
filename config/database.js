if (process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: 'mongodb://kolev:kolev@ds259258.mlab.com:59258/vidjot-prod'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}