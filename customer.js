require('dotenv').config();
/** 1) Install & Set up mongoose */
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const exerciceSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: String
});

const customerSchema = new mongoose.Schema({
  username: String,
  log: [exerciceSchema]
});

const Exercice = mongoose.model('Exercice', exerciceSchema);
const Customer = mongoose.model('Customer', customerSchema);

const getAll = (done) => {
  Customer.find({}, (err, data) => {
    if(err) done(err);
    done(null, data);
  });
};

const create = (params, done) => {
  const customer = new Customer(params);
  customer.save((err, data) => {
    if(err) done(err);
    done(null, data);
  });
};

const addExercice = (customerId, params, done) => {
  console.log(customerId);
  Customer.findById(customerId, (err, customer) => {
    if(err) done(err);
    params.date = new Date(params.date);
    if (!isNaN(params.date.getTime())) {
      params.date = params.date.toDateString();
    } else {
      params.date = new Date().toDateString();
    }
    const exercice = new Exercice(params);
    customer.log.push(exercice);
    customer.save();
    console.log(customer);
    done(null, {
      _id: customer._id,
      username: customer.username,
      date: params.date,
      duration: parseInt(params.duration),
      description: params.description
    });
  });
}

const getLog = (userId, params, done) => {
  const filterOption = params.limit ? {log: {$slice: parseInt(params.limit) }} : {};
  Customer.findOne(    
    {_id: userId},
    filterOption,
    (err, user) => {
      if(err) done(err);
      let from = new Date(params.from);  
      let to = new Date(params.to); 

      if (!isNaN(from.getTime()))
        user.log = user.log.filter((log) => new Date(log.date) >= from)

      if (!isNaN(to.getTime()))
        user.log = user.log.filter((log) => new Date(log.date) <= to)

      user.log.map((log) => {
        log.duration = parseInt(log.duration);
      })   

      done(null, {
        _id: user._id,
        username: user.username,
        count: user.log.length,
        log: user.log
      });
  });
};

exports.getAll = getAll;
exports.create = create;
exports.addExercice = addExercice;
exports.getLog = getLog;