// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};

// object for us to keep track of the last Cat we made and dynamically update it sometimes
let lastAdded = new Cat(defaultData);

const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const readAllCats = (req, res, callback) => {
  Cat.find(callback);
};

// Function to get all dogs
const readAllDogs = (req, res, callback) => {
  Dog.find(callback);
};

const readCat = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.json({ err });
    }

    return res.json(doc);
  };

  Cat.findByName(name1, callback);
};

const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    return res.render('page1', { cats: docs });
  };

  readAllCats(req, res, callback);
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

// Function to render page4
const hostPage4 = (req, res) => {
  const callback = (err, docs) => {
// Return the error if there is one
    if (err) {
      return res.json({ err });
    }

    return res.render('page4', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};

const getName = (req, res) => {
  res.json({ name: lastAdded.name });
};

const setName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  // dummy JSON to insert into database
  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  const savePromise = newCat.save();

  savePromise.then(() => {
    lastAdded = newCat;
    res.json({ name: lastAdded.name, beds: lastAdded.bedsOwned });
  });

  savePromise.catch(err => res.json({ err }));

  return res;
};


const searchName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Cat.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    if (!doc) {
      return res.json({ error: 'No cats found' });
    }

    return res.json({ name: doc.name, beds: doc.bedsOwned });
  });
};

const updateLast = (req, res) => {
  lastAdded.bedsOwned++;

  const savePromise = lastAdded.save();

  savePromise.then(() => res.json({ name: lastAdded.name, beds: lastAdded.bedsOwned }));

  savePromise.catch(err => res.json({ err }));
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// Function to create a new dog
const createDog = (req, res) => {
// Check data in body
  if (!req.body.name || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'name, breed, and age are all required.' });
  }

// Make an object that will be used to create the dog document for the collection
  const dogData = {
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
  };

// Create the document for the collection
  const newDog = new Dog(dogData);

// Save the document to the collection/to the database
  const savePromise = newDog.save();

// This is like a try in a try/catch
// Send the data saved in the response
  savePromise.then(() => {
    res.json({ name: newDog.name, breed: newDog.breed, age: newDog.age });
  });

// This is like a catch in a try/catch
// Send the error in the response
  savePromise.catch((err) => {
    res.json({ err });
  });

  return res;
};

// Function to find a dog by its name
const findDogAndIncreaseAge = (req, res) => {
// Check body for valid data
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required to perform a search.' });
  }

// Perform the lookup
  return Dog.findByName(req.body.name, (err, doc) => {
    if (err) {
// Error occurred in the database
      return res.json({ err });
    } else if (!doc) {
// No dogs with the name was found
      return res.json({ error: 'No dogs were found with that name.' });
    }

// Increase age of the found dog
    const foundDog = doc;
    foundDog.age++;

// Save it back to the collection/database
    const savePromise = foundDog.save();

// Like a try in a try/catch
// Return the dog with its increased age
    savePromise.then(() => {
      res.json({ name: foundDog.name, breed: foundDog.breed, age: foundDog.age });
    });

// Like a catch in a try/catch
// Return the error
    savePromise.catch((saveErr) => {
      res.json({ saveErr });
    });

    return res;
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readCat,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
  createDog,
  increaseAge: findDogAndIncreaseAge,
};
