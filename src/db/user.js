const database = require('../database')
const inputValidator = require('../input_validator')

const InvalidUsernameException = class extends Error {}
const InvalidEmailException = class extends Error {}
const InsecurePasswordException = class extends Error {}

const User = class {
  constructor (id) {
    this._id = id
  }

  get id () {
    return this._id
  }

  get name () {
    return this._select('name')
  }

  set name (name) {
    if (!inputValidator.is_valid_user_name(name)) { throw new InvalidUsernameException() }
    this._update('name', name)
  }

  get email () {
    return this._select('email')
  }

  set email (email) {
    if (!inputValidator.is_valid_email(email)) { throw new InvalidEmailException() }
    this._update('email', email)
  }

  get telephone () {
    return this._select('telephone')
  }

  set telephone (telephone) {
    this._update('telephone', telephone)
  }

  get password () {
    return this._select('password')
  }

  set password (password) {
    this._update('password', password)
  }

  get picture () {
    return this._select('picture')
  }

  set picture (picture) {
    this._update('picture', picture)
  }

  _select (property) {
    return database.query('SELECT ' + property + ' FROM User WHERE id = :id', {
      id: this._id
    })[0][property]
  }

  _update (property, value) {
    database.query('UPDATE User SET ' + property + ' = :value WHERE id = :id', {
      value: value,
      id: this._id
    }, null)
  }
}

function getUser (property, value) {
  const result = database.query('SELECT id FROM User WHERE ' + property + ' = :value', {
    value: value
  })
  console.log(result)
  return new User(result[0].id)
}

function byId (id) {
  return getUser('id', id)
}

function byName (name) {
  return getUser('name', name)
}

function byEmail (email) {
  return getUser('email', email)
}

function create (name, email, telephone, password) {
  database.query('INSERT INTO User (name, email, telephone, password) VALUES (:name, :email, :telephone, :password)', {
    name: name,
    email: email,
    telephone: telephone,
    password: password,
    salt: require('../account_util').generate_random_string(64)
  })
}

module.exports = {
  by_id: byId,
  by_name: byName,
  by_email: byEmail,
  create: create,
  InvalidUsernameException: InvalidUsernameException,
  InvalidEmailException: InvalidEmailException,
  InsecurePasswordException: InsecurePasswordException
}
