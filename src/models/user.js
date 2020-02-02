const { Schema, model } = require('mongoose')

const schema = new Schema({
  id: {
    type: Number,
    index: true,
    unique: true
  },
  refreshToken: {
    type: String
  }
})

module.exports = model('User', schema)
