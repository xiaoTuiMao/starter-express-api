const express = require('express')
const router = require('./router');
const app = express()

router(app);
app.listen(process.env.PORT || 9999)