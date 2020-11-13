function onDelete(id) {
	confirm('정말로 삭제하시겠습니까?') ? location.href='/board/delete/'+id : "";
}

function fileRemove(id){
	if(confirm('첨부파일을 삭제하시겠습니까? 삭제 시 영구삭제 됩니다.')){
		$.get('/board/fileRemove/'+id, function(r) { //ajax통신으로 받음
			if(r.code == 200) {//통신에 성공했따면
				$(".file-wrap").remove();
				alert('첨부파일이 삭제되었습니다.');
			} 
			else {
				console.log(r.err);
				alert('삭제에 실패하였습니다. 관리자에게 문의하세요');
			}
		});
	}
}