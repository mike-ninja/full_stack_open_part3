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

let contacts = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/contacts', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.post('/api/contacts', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'input missing' })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save().then(savedContact => {
    response.json(savedContact)
  })
})

app.get('/api/contacts/:id', (request, response) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).json({ error: 'contact not found' })
      }
    })
})

app.put('/api/contacts/:id', (request, response) => {
  const body = request.body

  const contact = {
    name: body.name,
    number: body.number,
  }

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => {
      response.status(404)
    })
})


app.delete('/api/contacts/:id', (request, response) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      console.error(error.message)
      response.status(500).end()
    })
})

app.get('/info', (request, response) => {
  const currentDate = new Date()
  const formattedDate = currentDate.toDateString();

  const entries = contacts.length
  const htmlResponse = `<h1>Phone has info for ${entries} people</h1>
                        <p>${formattedDate}</p>`
  return response.send(htmlResponse)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`)
})
