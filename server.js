const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const routes = require('./routes');
const authRouter = require('./routes/auth');

const app = express();

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://suyogsbrfiles:5UopwrN3R487PuwN@cluster0.mfjm9p5.mongodb.net/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log('Error connecting to MongoDB:', error);
});

// Set the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use auth routes
app.use('/auth', authRouter);

// Use other routes
app.use('/', routes);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});