const mysql = require('mysql2/promise');
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
	port: process.env.DB_PORT,
	waitForConnections: true,
	connectionLimit: 10
});

//sql generator
// mode = 'I', 'U', 'S', 'D'
// table = 'tableName';
// field = ['title','writer','content']
// data = {title: 'A', content: 'B'} //req.body
// file = {filename: '201113-.jpg', originalname: 'abc.jpg', size: 1234} //req.file
// key = id값

//null 은 값이 비어있음 undefinded는 변수 선언하고 값을 안넣어줌
//Nan :not a number라는 타입
const sqlGen = async(table, obj) => { //객체쏜것을 여기서 받음
  let {mode=null, field=[], data={}, file=null, id=null, desc=null} = obj;
	let sql=null, values=[], connect=null, rs=null;
	let temp = Object.entries(data).filter(v => field.includes(v[0]));
    //field정보 //entries는 오브젝트를 깨서 값들을 key value를 배열로 넣어준다.//포함하고 있니? indexof[0]> -1 과 같다


  switch(mode) {
    case 'I':
      sql = `INSERT INTO ${table} SET `;
      break;
    case 'U':
      sql = `UPDATE ${table} SET `;
      break;
    case 'D':
      sql = `DELETE FROM ${table} WHERE id=${id} `;
      break;
    case 'S':
      sql = `SELECT ${field.length == 0 ? '*' : field.toString()} FROM ${table} `;
      if(id) sql += ` WHERE id=${id} `;
      if(desc) sql += ` ${desc} `;
      break;
  }

	for(let v of temp) {
		sql += `${v[0]}=?,`;
		values.push(v[1]);
	}


	if(file) { //파일을 보내줬다면
		sql += `savefile=?,realfile=?,`;
		values.push(file.filename);
		values.push(file.originalname);
	}
  sql = sql.substr(0, sql.length - 1); //전체길이에서 제일 뒤에 , 만 
  
  if(mode == 'I', mode == 'U') sql += ` WHERE id=${id}`;
  connect = await pool.getConnection();
  rs = await connect.query( sql, values );
  connect.release();
  return rs;
}


module.exports = { mysql, pool, sqlGen };