const express = require('express');
const moment = require('moment');
const path = require('path');
const fs = require('fs-extra');
const createError = require('http-errors');
const router = express.Router();
const { pool, sqlGen } = require('../modules/mysql-conn'); //필요한것 구조분해할당으로 받음
const { alert, uploadFolder, imgFolder, extGen } = require('../modules/util');
const { upload, imgExt } = require('../modules/multer-conn');

router.get(['/', '/list'], async (req, res, next) => {
	let connect, rs, pug;
	pug = {title: '게시판 리스트', js: 'board', css: 'board'};
	try {
		let temp = sqlGen('board', { mode: 'S', desc: 'ORDER BY id DESC' });
		connect = await pool.getConnection();
		rs = await connect.query(temp.sql);
		connect.release();
		pug.lists = rs[0];
		pug.lists.forEach((v) => {
			v.wdate = moment(v.wdate).format('YYYY년 MM월 DD일');
		});
		res.render('./board/list.pug', pug);
	}
	catch(e) {
		if(connect) connect.release();
		next(createError(500, e.sqlMessage || e));
	}
});

router.get('/write', (req, res, next) => {
	const pug = {title: '게시글 작성', js: 'board', css: 'board'};
	res.render('./board/write.pug', pug);
});

router.post('/save', upload.single('upfile'), async (req, res, next) => {
	let connect, rs;
	try {
		if(req.allow === false) res.send(alert(`${req.ext}은(는) 업로드 할 수 없습니다.`, '/board')); //파일이 없는경우
		else {
			let temp = sqlGen('board', {
				mode: 'I', 
				field: ['title', 'writer', 'content'], 
				data: req.body,
				file: req.file
			});
			connect = await pool.getConnection();
			rs = await connect.query(temp.sql, temp.values);
			connect.release();
			res.redirect('/board');
		}
	}
	catch(e) {
		if(connect) connect.release();
		next(createError(500, e.sqlMessage || e));
	}
});

router.get('/view/:id', async (req, res) => {
	let connect, rs, pug;
	try {
		pug = {title: '게시글 보기', js: 'board', css: 'board'};
		let temp = sqlGen('board', {mode: 'S', id: req.params.id});
		connect = await pool.getConnection();
		rs = await connect.query(temp.sql);
    //res.json(rs); //여기에다가 디버그찍음
		connect.release();
		pug.list = rs[0][0];
		pug.list.wdate = moment(pug.list.wdate).format('YYYY-MM-DD HH:mm:ss');
		if(pug.list.savefile) {
			if(imgExt.includes(extGen(pug.list.savefile))) {
				pug.list.imgSrc = imgFolder(pug.list.savefile); //상대좌표
			}
		}
		res.render('./board/view.pug', pug);
	}
	catch(e) {
		if(connect) connect.release();
		next(createError(500, e.sqlMessage || e));
	}
});

router.get('/delete/:id', async (req, res, next) => {
	let connect, rs, temp;
	try {
		connect = await pool.getConnection();
		temp = sqlGen('board', {mode: 'S', id: req.params.id, field: ['savefile']});
		rs = await connect.query(temp.sql);
		if(rs[0][0].savefile) await fs.remove(uploadFolder(rs[0][0].savefile));
		temp = sqlGen('board', {mode: 'D', id: req.params.id});
		rs = await connect.query(temp.sql);
		connect.release();
		res.send(alert('삭제되었습니다', '/board'));
	}
	catch(e) {
		if(connect) connect.release();
		next(createError(500, e.sqlMessage || e));
	}
});


router.get('/update/:id', async (req, res, next) => {
	let connect, rs, pug, temp;
	try {
		pug = {title: '게시글 수정', js: 'board', css: 'board'};
		temp = sqlGen('board', {mode: 'S', id: req.params.id});
		connect = await pool.getConnection();
		rs = await connect.query(temp.sql);
		connect.release();
		pug.list = rs[0][0];
		res.render('./board/write.pug', pug);
	}
	catch(e) {
		if(connect) connect.release();
		next(createError(500, e.sqlMessage || e));
	}
});

router.post('/saveUpdate', upload.single('upfile'), async (req, res, next) => { //upload.single('upfile')이게 있어야 multer에 태워서 파일수정이 가능 
	let connect, rs, temp;
	try {
		if(req.allow === false) res.send(alert(`${req.ext}은(는) 업로드 할 수 없습니다.`, '/board')); 
		else {
			connect = await pool.getConnection();
			if(req.file) {
				temp = sqlGen('board', {mode: 'S', id: req.body.id, field: ['savefile']});
				rs = await connect.query(temp.sql);
				if(rs[0][0].savefile) await fs.remove(uploadFolder(rs[0][0].savefile));
			}
			temp = sqlGen('board', {
				mode: 'U', 
				id: req.body.id,  //post일 떄는 body로 접근
				field: ['title', 'writer', 'content'],
				data: req.body,
				file: req.file
			});
			rs =await connect.query(temp.sql, temp.values); //디버그시 여기에 찍음
			connect.release();
			res.send(alert('수정되었습니다', '/board'));
		}
	}
	catch(e) {
		if(connect) connect.release();
		next(createError(500, e.sqlMessage || e));
	}
});

router.get('/download', (req, res, next) => {
	let { file: saveFile, name: realFile } = req.query; //구조분해할당으로 req.query를 saveFile로 가져와라 saveFile은 리네임한거임
	res.download(uploadFolder(saveFile), realFile);
	 //saveFIle이경로에 있는 파일을 realFile이 이름으로 다운 받아줘 
});

	router.get('/fileRemove/:id', async (req, res, next) => {
	//res.json({code: 200}); //성공통신을 받음
	let connect, rs, temp;
	try {
		connect = await pool.getConnection();
		temp = sqlGen('board', {mode: 'S', id: req.params.id, field: ['savefile']});
		rs = await connect.query(temp.sql, );
		if(rs[0][0].savefile) await fs.remove(uploadFolder(rs[0][0].savefile));
		temp = sqlGen('board', {
			mode: 'U',
			id: req.params.id,
			field: ['realfile', 'savefile'],
			data: {realfile: null, savefile: null}
		});

		rs = await connect.query(temp.sql, temp.values);//쿼리던지기전에 중단점 찍음 await있는데서 찍으면됨
		connect.release();
		res.json({code: 200});
		
	}
	catch(e) {
		if(connect) connect.release();
		res.json({code: 500, err: e}); //api통신할떄는 next로 보내면 안되고 클라이언트한테 보내줘야한다
	}
});


module.exports = router;