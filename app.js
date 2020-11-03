// node_nodules
require('dotenv').config(); //환경변수에 불러옴
const express = require('express');
const app = express();
const path = require('path');

//modules 모듈들 불러오는곳
//const {pool} = require('./modules/mysql-conn');
const boardRouter = require('./routes/board');
const galleryRouter = require('./routes/gallery');

//포트설정
app.listen(process.env.PORT, () => {
  console.log(`http://127.0.0.1:${process.env.PORT}`);
});

//Initialize 최초세팅
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
app.locals.pretty = true; //클라이언트한테 보낼때 정리할게요

// middleware req가 지나가면서 json형식으로 변경해줌
app.use(express.json());
app.use(express.urlencoded({extended: false})); //포스트방식을 읽어주게함

//routers 라우터세팅
app.use('/', express.static(path.join(__dirname, './public')));
app.use('/board', boardRouter);
app.use('/gallery', galleryRouter);

//예외처리 error
//404에러
app.use((req, res, next) => {
  const err = new Error();
  err.code = 404;
  err.msg = '요청하신 페이지를 찾을 수 없습니다.';
  next(err);
});

//모든에러는 여기로 수렴됨
//nest(err)은 여기로 받음 
//500에러
app.use((err, req, res, next) => {
  console.log(err); //enoent는 pug에러로 console로 err 잡을수 있음
  const code = err.code || 500;
  const msg = err.msg || '서버 내부 오류입니다. 관리자에게 문의하세요.'
  res.render('./error.pug', {code, msg});
});