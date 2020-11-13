require('dotenv').config(); //환경변수에 불러옴
const express = require('express');
const { readyException } = require('jquery');
const app = express();
const path = require('path');
const createError = require('http-errors');

app.listen(process.env.PORT, () => {
  console.log(`http://127.0.0.1:${process.env.PORT}`);
});

const first = (req, res, next) => { //미들웨어
  console.log('First');
  next();
}

const third = (value) => {
  return (req, res, next) => {
    console.log(value);
    next();
  }
}

//미들웨어가 필요한 이유: req, res에 마음대로 접근할 수 있도록하기 위해서
//중간에 first 넣으면 간단히 미들웨어가 되어버린다 
app.get('/', isLogged, third('THIRD'), (req, res, next) => {
  console.log('SECOND');
  res.send('<h1>hello</h1>');
});