const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log(`connecting to ${url}`)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log(`error connceting to MongoDD ${error.message}`)
  })

// Defining a schema for the model
const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Degining a model method
contactSchema.statics.findByNameAndUpdate = function (name, update) {
  console.log("It goes here")
  return this.findOneAndUpdate({ name }, update, {new: true})
  console.log("Here it goes")
}

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)
