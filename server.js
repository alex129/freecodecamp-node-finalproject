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

const createCustomer = require("./customer.js").create;
router.post('/users', (req, res, next) => {
  createCustomer(req.body, (err, data) => {
    if(err) return next(err);
    res.json(data);
  });
});

app.use('/api', router);
