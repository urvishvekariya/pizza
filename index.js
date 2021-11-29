require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoStore = require('connect-mongo');
const passport = require('passport')
const Emitter = require('events')
const bodyParser = require('body-parser')

// Database connection

mongoose.connect(process.env.MONGO_CONNECTION_URLS, { useNewUrlParser: true, useUnifiedTopology: true, });
const connection = mongoose.connection
connection
    .once('open', () => console.log('connected to MongoDB!'))
    .on('error', err => console.error('connecting to MongoDB ' + err))

//event emiter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

//session confige    
app.use(session({
    secret: process.env.COOKIE_SECRET,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECTION_URLS }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(flash())
//passport config
const passportInit = require('./app/config/passport');
const { getEventListeners } = require('stream');
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

//assets
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

//global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    app.set('user', req.user)
    next()
})


// set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//routs
require('./routes/web')(app)

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

//socket io
const io = require('socket.io')(server)

//connection and make room on emit 
io.on('connection', (socket) => {
    //join 
    socket.on('join', (orderId) => {
        socket.join(orderId)
    })
})

//listen on emit and emit for task
eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})
eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})
eventEmitter.on('itemAdded', (data) => {
    io.to('productRoom').emit('itemAdded', data)
})
eventEmitter.on('itemUpdated', (data) => {
    io.to('productRoom').emit('itemUpdated', data)
})
eventEmitter.on('itemDeleted', (data) => {
    console.log(data)
    io.to('productRoom').emit('itemDeleted', data)
})


