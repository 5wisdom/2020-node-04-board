// node_nodules
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

//modules 모듈들 불러오는곳
const {pool} = require('./modules/mysql-conn');
const boardRouter = require('./routes/board');
const galleryRouter = require('./routes/gallery');

//포트설정
app.listen(process.env.PORT, () => {
  console.log(`http://127.0.0.1:${process.env.PORT}`);
});

//Initialize 최초세팅
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
app.locals.pretty = true;

// middleware req가 지나가면서 json형식으로 변경해줌
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/', express.static(path.join(__dirname, './public')));

//routers 라우터세팅
app.use('/', express.static(path.join(__dirname, './public')));
app.use('/board', boardRouter);
app.use('/gallery', galleryRouter);