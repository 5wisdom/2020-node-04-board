const alert = (msg, loc=null) => {
	var html = `<script>alert('${msg}');`;
	if(loc) html += `location.href='${loc}'`;
	html += `</script>`;
	return html;
}


module.exports = {alert}; 
//객체형태로 보내주면 필요한 것만 구조분해할당으로 가져올수 있음