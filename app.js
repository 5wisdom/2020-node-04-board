// node_nodules
require('dotenv').config(); //환경변수에 불러옴
const express = require('express');
const { readyException } = require('jquery');
const app = express();
const path = require('path');
const { upload } = require('./modules/multer-conn');
//const upload = multer({ dest: path.join(__dirname, './uploads/') });
//const { v4: uuidv4 } = require('uuid');
//var uid = uuidv4();


//const는 가비지컬렉션인 안된다 함수안에 있는 var let은 가비지컬렉션이 되기 쉬움 따라서 항상써야하므로 const로 써준다


//modules 모듈들 불러오는곳
//const {pool} = require('./modules/mysql-conn');
const logger = require('./modules/morgan-conn'); //미들웨어
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

//app.use(logger); //미들웨어 그냥 이렇게 쓰면됨 안에 req,res,next를 다 가지고 있음 안에서 req,res하다가 next로 다음으로 보냄
app.use(logger, express.json(), express.urlencoded({extended: false})); ////미들웨어 한방에 쓸수도 있음
app.use((req,res,next) => {
  express.text = "aaa"
  express.json()(req, res, next)
})
//app.use(express.json());
app.use(express.urlencoded({extended: false})); //포스트방식을 읽어주게함

//routers 라우터세팅, 라우터가 있는 미들웨어
app.use('/', express.static(path.join(__dirname, './public')));
app.use('/storage', express.static(path.join(__dirname, './uploads')));//해킹위험방지위해 이름 바꿈
app.use('/board', boardRouter);
app.use('/gallery', galleryRouter);


app.get('/test/upload', (req, res, next) => {
	res.render('test/upload');
});

// test/save로 들어오면 multer 미들웨어를 태우고 다음을 실행함
app.post('/test/save', upload.single("upfile"), (req, res, next) => {
 res.json(req.file);
  
});




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