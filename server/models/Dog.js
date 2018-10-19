// Requires
const mongoose = require('mongoose');

// Set the promise for mongoose to use
mongoose.Promise = global.Promise;

// Variable to be used for the dog model
let DogModel = {};

// Set Schema for Collection
const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  breed: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Static function to look up an individual dog by its name
DogSchema.statics.findByName = (name, callback) => {
// Create object to perform search with
  const search = {
    name,
  };

// Perform search
  return DogModel.findOne(search, callback);
};

// IMPORTANT: set up the dog model after you're completely finished with the schema
// Set up the dog model
DogModel = mongoose.model('Dog', DogSchema);

// Export the model and the schema (make them public)
module.exports.DogModel = DogModel;
module.exports.DogSchema = DogSchema;
