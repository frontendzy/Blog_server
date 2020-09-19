const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  title: { type: String },
  belong: { type: mongoose.SchemaTypes.ObjectId, ref: 'Classification' },
  description: { type: String },
  image: { type: String },
  body: { type: String },
}, {
  timestamps: true
})

module.exports = mongoose.model('Article', schema)