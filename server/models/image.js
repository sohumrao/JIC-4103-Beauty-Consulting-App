const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String,
});

module.exports = mongoose.model('Image', imageSchema);
