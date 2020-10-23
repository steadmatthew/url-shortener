const mongoose = require('mongoose');

const ShortenerSchema = new mongoose.Schema({
  url: {
    type: String,
  },
  _id: {
    type: String,
  },
});

module.exports = mongoose.model('Shortener', ShortenerSchema);
