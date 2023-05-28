require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('res-body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :res-body'))
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const Contact = require('./models/phonebook')

app.get('/api/contacts', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.post('/api/contacts', (request, response, next) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'input missing' })
  }

  Contact.findByNameAndUpdate(body.name, { number: body.number })
    .then(updatedContact => {
      if (updatedContact) {
        response.json(updatedContact)
      } else {
        const newContact = new Contact({
          name: body.name,
          number: body.number
        })

        newContact.save().then(savedContact => {
          response.json(savedContact)
        })
      }
    })
    .catch(error => next(error))
})

app.get('/api/contacts/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        console.log("Does it reach here?")
        response.json(contact)
      } else {
        response.status(404).json({ error: 'contact not found' })
      }
    })
    .catch(error => next(error))
})

app.put('/api/contacts/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    name: body.name,
    number: body.number,
  }

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})


app.delete('/api/contacts/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const currentDate = new Date()
  const formattedDate = currentDate.toDateString();
  const entries = contacts.length
  const htmlResponse = `<h1>Phone has info for ${entries} people</h1>
                        <p>${formattedDate}</p>`
  return response.send(htmlResponse)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`)
})
