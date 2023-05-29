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
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(\d{2,3}-\d{6,})$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'User phone number required']
  }
})

// Degining a model method
contactSchema.statics.findByNameAndUpdate = function (name, update) {
  return this.findOneAndUpdate(
    { name },
    update,
    {new: true, runValidators: true, context: 'query' }
  )
}

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)
