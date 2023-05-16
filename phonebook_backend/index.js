const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('res-body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :res-body'))
app.use(express.json())

let persons = [
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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  response.json(person)
})

const generateId = () => {
  return Math.floor(Math.random() * 500) + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: 'content missing'
    })
  } else if (persons.map(person => person.name).includes(body.name)) {
    return response.status(404).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(newPerson) 
  response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id != id)
  response.status(204).end()
})

app.get('/info', (request, response) => {
  const currentDate = new Date()
  const formattedDate = currentDate.toDateString();

  const entries = persons.length
  const htmlResponse = `<h1>Phone has info for ${entries} people</h1>
                        <p>${formattedDate}</p>`
  return response.send(htmlResponse)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server is running at ${PORT}`)
