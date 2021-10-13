require('dotenv').config();
/** 1) Install & Set up mongoose */
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const customerSchema = new mongoose.Schema({
  username: String,
});

const Customer = mongoose.model('Customer', customerSchema);

const create = (params, done) => {
  const customer = new Customer(params);
  customer.save((err, data) => {
    if(err) done(err);
    done(null, data);
  });
};

