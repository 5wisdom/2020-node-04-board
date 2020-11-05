const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');

//stream: 쪼개서 들어옴
//액세스라는 파일을 매일매일 logs라는 곳에 
const logStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, '../logs')
});

//stream시스템을 logStream으로 쓰겠습니다.
const logger = morgan('combined', {stream: logStream});

//로그기록이 자동으로 logs 파일을 생성해서 안에 기록을 한다
//누가 들어왓었는지 로그기록을 남김

module.exports = logger;