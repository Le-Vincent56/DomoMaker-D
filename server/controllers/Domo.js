// Imports
const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => {
  try {
    // Get the domos based on the account ID
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age').lean().exec();

    return res.render('app', { domos: docs });
  } catch (err) {
    // If there's an error, log it and return a status code
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const makeDomo = async (req, res) => {
  // Check if the Domo has a name and an age
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  // Create the Domo data
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  try {
    // Create and save the domo using the data and the domo model
    const newDomo = new Domo(domoData);
    await newDomo.save();

    // Once complete, redirect to the maker page
    return res.json({ redirect: '/maker' });
  } catch (err) {
    // If there's an error, log it
    console.log(err);

    // If the domo already exists, then return a status code
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }

    // Return a general status code
    return res.status(500).json({ error: 'An error occurred making a Domo!' });
  }
};

// Exports
module.exports = {
  makerPage,
  makeDomo,
};
