require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const sql = require('mssql')

const app = express()

const morganOption = (NODE_ENV === 'production' ? 'tiny' : 'common')

var sqlconfig = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE
}
app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.get('/', (req, res) => {
    res.send('Hello, boilerplate!')
})
app.get('/logins', function (req, res) {
    sql.connect(sqlconfig, function() {
        var request = new sql.Request();
        request.query('select * from logins', function(err, recordset) {
            if (err) console.log(err)
            res.end(JSON.stringify(recordset))
        })
    })
})
app.get('/masterlogins', function(req, res) {
    sql.connect(sqlconfig, function() {
        var request = new sql.Request();
        request.query('select * FROM master_login', function(err, recordset) {
            if (err) console.log(err)
            res.end(JSON.stringify(recordset))
        })
    })
})
app.use(function errorHandler(error, req, res, next) {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    }
    else {
        console.log(error)
        response = { message: error.message, error}
    }
    res.status(500).json(response)
})
module.exports = app