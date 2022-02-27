const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());
app.use(express.raw());
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

const router = express.Router();

const getAllUsers = require("./customer.js").getAll;
router.get('/users', (req, res, next) => {
  getAllUsers((err, data) => {
    //GET ALL USERS API ENDPOINT V2
    if(err) return next(err);
    res.json(data);
  });
});

const createCustomer = require("./customer.js").create;
//FIXED
router.post('/users', (req, res, next) => {
  createCustomer(req.body, (err, data) => {
    if(err) return next(err);
    res.json(data);
  });
});

const addExercice = require("./customer.js").addExercice;
router.post('/users/:id/exercises', (req, res, next) => {
  addExercice(req.params.id, req.body, (err, data) => {
    if(err) return next(err);
    res.json(data);
  });
});

const getLog = require("./customer.js").getLog;
router.get('/users/:id/logs', (req, res, next) => {
  getLog(req.params.id, req.query, (err, data) => {
    if(err) return next(err);
    res.json(data);
  });
});

app.use('/api', router);
