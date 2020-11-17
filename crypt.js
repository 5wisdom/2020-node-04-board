//crypt : 단방향 암호화 //복호화가 안됨
//cipher : 양방향 암복호화 //sha1, sha256, sha512(이거만 아직 안뚫림)
//session : 서버가 가지는 전역변수
//cookie : 클라이언트가 가지는 전역변수
//CORS (Cross Origin Resourse Share) : 통신규칙
//proxy - forwrd proxy 
//proxy - reverse proxy

//비밀번호저장하는 방법
const crypto = require('crypto');
let password = 'abcd1234';
let salt = 'asdf1234' //나만이 알수 있는 소금 , salt만 뚫리지 않으면 해커가 해킹할 수 없음
let hash = crypto.createHash('sha512').update(password+salt).digest('base64');//암호화된것을 hash에 보통 넣음
hash = crypto.createHash('sha512').update(hash).digest('base64');//해킹방지위해 여러번 돌리기도 함
hash = crypto.createHash('sha512').update(hash).digest('base64');
hash = crypto.createHash('sha512').update(hash).digest('base64');
console.log(hash);

//https: 평문으로 보내지 못하게 하는것 http:평문은 하이재킹 당하기 쉽다

//암호화
let cipher = crypto.createCipher('aes-256-cbc', salt);//(인증서 256으로 묶음, 개발자만아는 salt)
let result = cipher.update('아버지를 아버지라...', 'utf-8', 'base64'); //base64 바이너리 데이타를 텍스트로 변경해중
result += cipher.final('base64');
console.log(result);

//복호화
let decipher = crypto.createDecipher('aes-256-cbc', salt);
let result2 = decipher.update(result, 'base64', 'utf-8');
result2 += decipher.final('utf-8');
console.log(result2);
