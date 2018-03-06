const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')

const app = express();

// Load routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// Passport Config
require('./config/passport')(passport)

// Database Config
const db = require('./config/database')

// Global promise use instead of mongoose's
mongoose.Promise = global.Promise

// Connect Mongoose
mongoose.connect(db.mongoURI)
.then( () => console.log('MongoDB connected..'))
.catch( err => console.log(err))

// Load Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Method Override middleware
app.use(methodOverride('_method'));

// Set public as express' static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// use Flash
app.use(flash())

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg') // whatever we set as a success_msg will be stored in this variable so that we can use it in our template
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next() // don't forget this part
})

// Index route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    })
})

// About route
app.get('/about', (req, res) => {
    res.render('about')
})

app.use('/ideas', ideas)
app.use('/users', users)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})