const multer = require('multer');
const moment = require('moment');
const path = require('path');
const fs = require('fs'); //filesystem
const { v4: uuidv4 } = require('uuid');

const makeFolder = () => {
  let result = { err: null }; //result에 null 이 있어요
  let folder = path.join(__dirname, '../uploads', moment().format('YYMMDD')) //uploads폴더에 201105라는 이름으로 만들어라
  result.folder = folder; 
  if(!fs.existsSync(folder)) { //폴더가 존재하지 않는다면
    fs.mkdir(folder, (err) => { //폴더만들기가 끝나면 function을 실행해라 (err)에 에러를 담음 실패했다면 밑에 if를 실행
      if(err) result.err = err; //폴더만들기에 실패(디스토리지가 꽉찼다던가,동시에같은명령이 온경우)
      return result; 
    });
  }
  else return result; //폴더만들기에 성공
}

var storage = multer.diskStorage({ 
  destination: function (req, file, cb) {//경로
    const result = makeFolder();
    result.err ? cb(err) : cb(null, result.folder); //에러가 존재하니 ? cb(에러, 성공(에러없고 폴더는 이거예요)). 에러는 쓰면 에러 null이면 없는거임
  },
  filename: function (req, file, cb) { //파일명
    let ext = path.extname(file.originalname); // aa.jpg => .jpg 내가준파일명에서 .jpg만 추출
    let saveName = moment().format('YYMMDD') + '=' + uuidv4() + ext; //201105dfhuahfjakdhfjdh
    cb(null, saveName);
  }
});

const upload = multer({ storage: storage })

module.exports = {upload};