const express = require('express')
const app = express()

app.get('*', (req, res) => {
  res.send('hullo werld')
})

let port = 8080

app.listen(port, () => {console.log('listening on port', port)})