const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  name: { type: String },
  logo: { type: String },
  icon: [{
    name: { type: String },
    icon: { type: String },
    link: { type: String },
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Blog', schema)