const express = require('express');
const bodyParser = require('body-parser');
const db = require('monk')('localhost/my-db');
const things = db.get('things');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
  return things.find({})
    .then(response => res.json(response))
    .catch((err) => next(err));
});

app.post('/', (req, res, next) => {
  return things.insert(req.body)
    .then(response => res.json({
      response,
      message: "success!"
    }))
    .catch((err) => next(err));
});

app.get('/:id', (req, res, next) => {
  return things.find({_id: req.params.id})
    .then(response => res.json(response))
    .catch((err) => next(err));
});

app.patch('/:id', (req, res, next) => {
  return things.update({_id: req.params.id}, {$set: req.body})
    .then(result => {
      res.json({
        result,
        message: 'updated!'
      });
    })
    .catch((err) => next(err));
});

app.delete('/:id', (req, res, next) => {
  return things.findOneAndDelete({_id:req.params.id})
    .then((response) => {
      res.json({
        response,
        message: '🗑'
      });
    });
});

app.listen(3000,()=> {
  console.log('listening on port 3000');
});
