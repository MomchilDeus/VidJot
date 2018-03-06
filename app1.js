const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Map global promise = get rid of warning
mongoose.Promise = global.Promise;

// Connect Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
.then( () => console.log('MongoDB connected...'))
.catch( err => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// How middleware works
// app.use( (req, res, next) => {
//     req.name = 'Request name property set';
//     next();
// })

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Index route
app.get('/', (req, res) => {
    res.render('index');
});

// About route
app.get('/about', (req, res) => {
    res.render('about');
});

// Add Idea Form route
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
})

// Ideas route
app.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.title){
        errors.push( {text: 'Please add a title.'});
    }

    if (!req.body.details){
        errors.push( {text: 'Please add details.'});
    }

    if (errors.length){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        }); 
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        const testUser = new Idea(newUser);
        testUser.save()
        .then(idea => {
            console.log('newUser underneath');
            console.log(newUser);
            console.log('testUser underneath');
            console.log(testUser);
            console.log('idea underneath');
            console.log(idea);
            res.redirect('/ideas')
        })
    }
});



const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});