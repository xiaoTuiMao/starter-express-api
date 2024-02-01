const email = require('../controller/email');

const main = (app) => {
  app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo! here is xiaoTuiMao')
  });

  email.setup(app);
};

module.exports = main;
