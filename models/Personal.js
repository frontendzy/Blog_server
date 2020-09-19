const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  avatar: { type: String },
  name: { type: String },
  signature: { type: String },
  contact: [{
    name: { type: String },
    icon: { type: String },
    link: { type: String },
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Personal', schema)