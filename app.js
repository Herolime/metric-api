const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const cleaningTime = 3600000
let metricData = {}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/metric/:key/sum', (req, res) => res.send(`${isNaN(metricData[req.params.key]) ? 0 : metricData[req.params.key]}`))

app.post('/metric/:key', (req, res) => {
    let {value} = req.body
    const {key} = req.params
    if (isNaN(value)) {
        res.status(400).send('value should be a number');
    }
    if (value < 0) {
        res.status(400).send('value should be a postive number');
    }
    if (!Number.isInteger(value)) {
        value = Math.floor(value);
    }
    metricData[key] = isNaN(metricData[key]) ?  value : metricData[key] + value
    return res.send({})
})

app.listen(port, () => console.log(`Metric app listening at http://localhost:${port}`))
setInterval(() => metricData = {}, cleaningTime)
