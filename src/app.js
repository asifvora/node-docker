const express = require('express');
const requestValidator = require('express-validator');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const helmet = require('helmet')
const swaggerDocument = require('./swagger.json');

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

// custom modules
const allRoutes = require('./routes');

// db connection
require('./db');

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.disable('x-powered-by');
app.use(requestValidator());

app.get('/', (req, res) => {
  res.status(200).json({
    msg: 'Welcome',
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(allRoutes);

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}.`);
});

module.exports = app;
