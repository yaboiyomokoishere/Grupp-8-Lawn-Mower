const express = require ('express')
const app = express()
app.use(express.json())
app.get('/api', (req, res) => res.send('Hello World!'))
app.listen(3000, () => console.log('Example app listening on port 3000!'))


