const express = require('express');
const router = express.Router();
const { pool } = require('../modules/mysql-conn');

router.get(['/', '/list'], (req, res, next) => {
  const pug = {title: '게시판 리스트', js: 'board', css: 'board'};
  res.render('./board/list.pug', pug);
});

router.get('/write', (req, res, next) => {
  const pug = {title: '게시판 리스트', js: 'board', css: 'board'};
  res.render('./board/write.pug', pug);
});

router.post('/save', async (req, res, next) => {
  const {title, content, writer} = req.body;
  var values = [title, content, writer];
  var sql = 'INSERT INTO board SET title=?, writer=?, content=?';
  try {
    const connect = await pool.getConnection(); //컨넥션 받아올때까지 기다려
    const rs = await connect.query(sql, values);
    connect.release();
    res.json(rs[0]);
  }
  catch(err){
    next(err);
  }
});

module.exports = router;