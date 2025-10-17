const express = require('expresss');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB  = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const resturantRoutes  = require('./routes/resturantRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
const app = express();

connectDB();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('morgan');

app.get('/', (rew, res) => res.json({ok : true, service :  'swiggy-clone-api'}))
app.use('/api/auth', authRoutes)
app.use('/api/resturants',resturantRoutes ),
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('api is running on port 5000'));