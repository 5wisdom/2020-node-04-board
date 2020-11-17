//let pagers = pager(2, 90, {listCnt: 5, pagerCnt: 5})
//let pagers = pager(2, 90)

const pager = (page, totalRecord, obj) => {
  page = Number(page);
  totalRecord = Number(totalRecord);
  let { listCnt=5, pagerCnt=3 } = obj || {}; //false라면 {} 빈객체를 넣어 오류를 잡아준다.
  let totalPage = Math.ceil(totalRecord / listCnt);
	let startIdx = (page - 1) * listCnt;
	let startPage = Math.floor((page - 1) / pagerCnt) * pagerCnt + 1;
  let endPage = startPage + pagerCnt - 1 > totalPage ? totalPage : startPage + pagerCnt - 1;
  let nextPage = page + 1 > totalPage ? 0 : page + 1; //0이면 disabled가 뜨므로 으로 넣어 값처리를 한다. 0이면 값이 끝까지 갔을때이다
  let prevPage = page - 1;
  // let firstPage = 1;
  // let lastPage = total;
	return { page, totalRecord, listCnt, pagerCnt, totalPage, startIdx, startPage, endPage, nextPage, prevPage };
}

module.exports = pager;

