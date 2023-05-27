const mongoose = require('mongoose')

const length = process.argv.length
console.log(length)
if (length != 5 && length != 3) {
  console.log('node mongo.js password name number')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://edubas128:${password}@cluster0.z7mvppr.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

if (length == 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const Contact = mongoose.model('Contact', contactSchema)

  const contact = new Contact({
    name,
    number,
  })

  contact.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  const Contact = mongoose.model('Contact', contactSchema)

  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
      mongoose.connection.close()
    })
  })
}
