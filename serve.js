const express = require('express');
const app = express();
const sequelize = require('./config/connection');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const path = require('path');
const exphbs = require('express-handlebars');

const routes =  require('./controllers');

const helpers = require('./utils/helpers');

const hbs = exphbs.create({ helpers });

const PORT = process.env.PORT || 3001;

const sess = {
    secret: 'Secret',
    cookie: {}, 
    resave: false,
    saveUnitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

require('dotenv').config();

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(routes)

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'))
});