const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const Schema = require('./models/shortener');
const config = require('./config.json');
const makeID = require('./utils/makeID');
const chalk = require('chalk');
if (!config.mongoURI) {
  // eslint-disable-next-line max-len
  console.error(chalk.red('You did not provide a mongoURI, is your config file still called config.example.json? Is your config file wrong?'));
  process.exit(0);
}
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/u/:ID', async (req, res) => {
  const ID = req.params.ID;
  const find = await Schema.findOne({_id: ID});
  if (!find) return res.status(404).render('404.ejs');
  res.render('redir.ejs', {url: find.url});
});

app.post('/u/create', async (req, res) => {
  if (!req.body.url) return res.status(400).render('400.ejs');
  const id = `${makeID(2)}_${makeID(7)}`;
  // eslint-disable-next-line max-len
  const FoundCheck = await Schema.findOne({url: req.body.url}).then((doc) => doc);
  if (config.check && FoundCheck) {
    return res.status(409).render('exists.ejs', {
      id: FoundCheck.id,
    });
  }
  const s = new Schema({
    url: req.body.url,
    _id: id,
  });
  s.save();
  res.status(201).render('created.ejs', {
    id: id,
  });
});

app.all('*', (req, res) => {
  res.render('404.ejs');
});

app.listen(config.port ? config.port : 8080, () => {
  // eslint-disable-next-line max-len
  console.log(chalk.green(`[SUCCESS] URL Shortener now listening on ${config.port ? config.port : 8080}`));
});
