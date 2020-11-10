const multer = require('multer'); //파일업로드
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises'); //filesystemPromises
const { v4: uuidv4 } = require('uuid'); //uuid: 유니크한 아이디 난수발생
const allowExt = ['jpg', 'jpeg', 'png', 'gif', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'hwp']; //업로도가 가능한 파일
const imgExt = ['jpg', 'jpeg', 'png', 'gif']; 


const makeFolder = () => {
  const result = { err: null }; //result에 null 이 있어요
  const folder = path.join(__dirname, '../uploads', moment().format('YYMMDD')) //uploads폴더에 201105라는 이름으로 만들어라
  result.folder = folder; 
  if(!fs.existsSync(folder)) fs.mkdirSync(folder);  //폴더만들기가 끝나면 function을 실행해라 (err)에 에러를 담음 실패했다면 밑에 if를 실행
  //폴더만들기에 실패(디스토리지가 꽉찼다던가,동시에같은명령이 온경우)
return result; //result = {err: null, folder: '경로'}
}  //폴더가 존재한다면 result 반환


//   if(!fs.existsSync(folder)) {
//     const err = await fsP.mkdir(folder);
//     if(err) result.err = err;
//     return result;
//   }
//   else return result;
  
// }


  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(".", ""); //ext:확장자 패스확장자를 가져다가 소문자로 만들고 점을 가져다가 없애버림
    if(allowExt.indexOf(ext) > -1) { //인덱스가 존재한다면
      req.allowUpload = {allow: true, ext};
      cb(null, true);
    }  
    else {
      req.allowUpload = {allow: false, ext};
      cb(null, false)
    }
  }


const storage = multer.diskStorage({ 
  destination: (req, file, cb) => {//폴더경로
    const result =  makeFolder();
    result.err ? cb(err) : cb(null, result.folder); //에러가 존재하니 ? cb(에러, 성공(에러없고 폴더는 이거예요)). 에러는 쓰면 에러 null이면 없는거임
  },
  filename: (req, file, cb) => { //파일명
    let ext = path.extname(file.originalname); // aa.jpg => .jpg 내가준파일명에서 확장자.jpg만 추출
    let saveName = moment().format('YYMMDD') + '=' + uuidv4() + ext; //201105dfhuahfjakdhfjdh
    cb(null, saveName);
  }
});

const upload = multer({ storage, fileFilter, limits: {fileSize: 20480000} }); // ={ storage: storage } 비구조할당 //fileSize: 20480000 20메가까지 올라감 

module.exports = {upload, allowExt, imgExt};