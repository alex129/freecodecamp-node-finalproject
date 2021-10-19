require('dotenv').config();
/** 1) Install & Set up mongoose */
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const exerciceSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: Date
});

const customerSchema = new mongoose.Schema({
  username: String,
  exercices: [exerciceSchema]
});

const Exercice = mongoose.model('Exercice', exerciceSchema);
const Customer = mongoose.model('Customer', customerSchema);

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
    const exercice = new Exercice(params);
    customer.exercices.push(params);
    customer.save();
    done(null, customer);
  });
}

exports.create = create;
exports.addExercice = addExercice;