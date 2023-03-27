/* 질문(query) 전송 기능 */
sending = function (say) {
	var newTalkbox = $('<div>')
		.addClass('chatbox');
	var today = new Date();     // 시간 추가
	var hour = today.getHours();
	if (hour > 12) {
		hour = "오후 " + (hour - 12);
	}
	else if (hour == 12) {
		hour = "오후 " + hour;
	}
	else {
		hour = "오전 " + hour;
	}
	now = /*today.getFullYear() +"년 " + today.getMonth()+"월 " + today.getDate() +"일 "+ */hour + "시 " + today.getMinutes() + "분 ";
	var time = $('<p>')
		.html(now)
		.addClass('time')
		.appendTo(newTalkbox);

	var newTalk = $('<p>')  // 내용 추가
		.text(say)
		.addClass('chat')
		.appendTo(newTalkbox);

	newTalkbox.css('float', 'right'); // * 우측에 표시 * //
	newTalkbox.appendTo($('.chat-body'));  // 채팅창에 추가
	reply(say);
	$(".chat-body").scrollTop($(".chat-body")[0].scrollHeight);  //스크롤바 자동 내리기
}

/* AI 자연어 intent 파악 기능 */
var accessToken = "9f54910feca14024bbc68dfcbbfc351c";
var baseUrl = "https://api.api.ai/v1/";
ai = function (qry) {
	var text = qry;
	$.ajax({
		type: "POST",
		url: baseUrl + "query?v=20150910",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: false,
		headers: {
			"Authorization": "Bearer " + accessToken
		},
		data: JSON.stringify({ query: text, lang: "ko", sessionId: "772" }),

		success: function (data) {
			result = JSON.stringify(data['result']['fulfillment']['speech'], undefined, 2);
		},
		error: function () {
			alert("Internal Server Error");
		}
	});
	return result;
}

/* 답장 오는 기능 */
reply = function (say) {
	/* 선택지를 터치한 경우 답변 처리 */
	if (say == '오늘의 미담') {
		replymsg('오늘의 미담을 보내드립니다.');
		hyperlink(["코로나19 극복, 강원 경찰 미담 잇달아", "수원서 신변 비관 극단적 선택 시도한 50대, 경찰 도움으로 목숨 구해"], ['https://news.bbsi.co.kr/news/articleView.html?idxno=978949', "http://www.joongboo.com/news/articleView.html?idxno=363445219"]);
	}
	else if (say == '순찰 신청' || say == '동네 순찰 신청') {
		replymsg("'탄력순찰'은 온라인이나 오프라인을 통해 국민 여러분께서 순찰을 희망하는 시간과 장소를 직접 선택해주시면 경찰이 순찰서비스를 제공해주는 새로운 순찰방식입니다.");
		hyperlink(["탄력순찰 신문고 메인페이지", "탄력순찰 신청 (지도방식)", "탄력순찰 신청 (게시판)"], ["http://patrol.police.go.kr/usr/main.do#", "http://patrol.police.go.kr/map/map.do", "http://patrol.police.go.kr/cop/bbs/anonymous/selectBoardList.do?bbsId=BBSMSTR_000000000001"]);
	}
	else if (say == '주변 경찰서 위치' || say == '인근 경찰서 전화') {
		map_init();
		replymsg("내 위치와 가장 가까운 경찰서는 " + closest_data[2] + "입니다.");
		hyperreply([closest_data[2] + '(으)로 전화연결', closest_data[2] +"(으)로 길 안내"]);
	}
	else if (say == '분실 신고') {
		var situation = "분실물을 습득하셨군요. ";
		map_init();
		replymsg(situation + "현재 위치와 가까운 경찰서는 " + closest_data[2] + "입니다. 무엇을 도와드릴까요?");
		hyperreply([closest_data[2] + "(으)로 길 안내", closest_data[2] + "(으)로 전화연결"]);
	}

	else if (say == '중앙선 침범') {
		find_closest();
		replymsg("중앙선 침범시 범칙금(과태료)는 승합차 등: 7만원(10만원), 승용차 등: 6만원(9만원), 이륜차 등: 4만원, 자전거 등: 3만원입니다. ");
		hyperreply(["교통법규위반 신고 페이지로 이동", closest_data[2] + "(으)로 길 안내", closest_data[2] + "(으)로 전화연결"]);
	}
	else if (say == '교통법규위반 신고 페이지로 이동') {
		replymsg("교통법규위반 신고 페이지로 이동합니다. ");
		var url = "http://onetouch.police.go.kr/";
		window.open(url, "_blank");
	}
	else if (say == '운전면허 갱신') {
		replymsg("운전면허 갱신에 관해 알려드립니다. 궁금하신 것을 말씀해주세요.");
		hyperreply(["운전면허 갱신 신청", "운전면허 시험장 안내", "안전운전 통합민원으로 전화연결"]);
	}
	else if (say == '안전운전 통합민원으로 전화연결') {
		window.open('tel:1577-1120');
	}

	/* 위치 권한 허용 방법 튜토리얼 */
	else if (say == '위치 권한 허용 튜토리얼') {
		replymsg('아래 그림처럼 따라하세요');
		replypic("./image/permission_pc.gif");
	}
	/* GPS 이용 길 안내 및 전화연결 기능 */
	else if (say.slice(-9) == "(으)로 길 안내") {
		var url = "https://map.kakao.com/link/to/" + closest_data[2] + "," + closest_data[0] + "," + closest_data[1];
		window.open(url, "_blank");
	}
	else if (say.slice(-9) == '(으)로 전화연결') {
		var index = say.indexOf("(으)");
		var tellnumber = closest_data[3];
		window.open('tel:' + tellnumber);
	}
	/* 단순 선택지 클릭이 아닌 ML를 활용해 질문의 Intent를 파악하여 답변*/
	else {
		say = ai(say); // 내 질문의 의도 파악
		say = say.slice(1, say.length - 1);

		/* 의도 별 답변처리 */
		if (say == '밤길 무서움') {
			replymsg("아래 항목 중 찾으시는게 있으신가요?");
			hyperreply(["동네 순찰 신청", "인근 경찰서 전화"]);
		}
		else if (say == '안녕하세요') {
			find_closest();
			replymsg("안녕하세요. " + closest_data[2] + "입니다. 무엇을 도와드릴까요?");
			hyperreply(["순찰 신청", closest_data[2] + "(으)로 전화연결", closest_data[2] + "(으)로 길 안내"]);
		}
		else if (say == '운전면허 갱신 신청') {
			replymsg("운전면허 갱신 신청 페이지로 이동합니다. ");
			var url = "https://www.gov.kr/main?a=AA020InfoCappViewApp&HighCtgCD=A08004&CappBizCD=13200000030";
			window.open(url, "_blank");
		}
		else if (say == '운전면허 시험장 안내') {
			replymsg("운전면허 시험장 안내 페이지로 이동합니다. ");
			var url = "https://www.safedriving.or.kr/guide/rerGuide05View.do?menuCode=MN-PO-1115";
			window.open(url, "_blank");
		}
		else if (say == '담당부서 연결') {
			replymsg(say + "관련 지원을 도와드리겠습니다. 아래 전화연결을 누르시면 민원봉사실로 연결됩니다.");
			hyperreply([closest_data[2] + "(으)로 길 안내", closest_data[2] + "(으)로 전화연결"]);
		}
		else if (say == '음주 운전') {
			find_closest();
			replymsg("음주운전으로 적발되면 운전자는 보험료 인상과 자기부담금과 같은 민사적 책임, 5년 이하의 징역 또는 2000만원 이하의 벌금과 같은 형사적 책임, 운전면허 정지나 취소와 같은 행정책임을 모두 져야 합니다.");
			hyperreply(["교통법규위반 신고 페이지로 이동", closest_data[2] + "(으)로 길 안내", closest_data[2] + "(으)로 전화연결"]);
		}
		else if (say == '범죄 신고') {
			find_closest();
			replymsg("범죄를 신고합니다. 신고할 내용을 보내시거나 아래 항목에서 고르세요.");
			hyperreply(["강도", "성범죄", "사기", closest_data[2] + "(으)로 길 안내", closest_data[2] + "(으)로 전화연결"]);
		}
		else if (say == '교통법규위반 신고') {
			find_closest();
			replymsg("교통법규위반을 목격하셨군요 신고할 내용을 보내시거나 아래 항목에서 고르세요.");
			hyperreply(["중앙선 침범", "음주 운전", closest_data[2] + "(으)로 길 안내", closest_data[2] + "(으)로 전화연결"]);
		}
		else if (say == '강도') {
			find_closest();
			replymsg("강도피해 시 대처요령입니다. 1. 신체의 안전을 위해 일단 가해자로부터 피한다. 2. 112에 신고해 경찰의 도움을 요청한다. 3. 긴급구호(임시숙소, 병원 후송)를 받은 다음 법적 대응(형사고소, 민사 손해배상 청구)을 준비한다. 4. 피해자전담경찰관과 피해 회복 및 지원에 대하여 상담한다. 5. 신체 피해에 대하여 즉시 치료를 받는다. 6. 증거자료를 확보하여 보존한다.(진료기록, 피해부위 사진촬영 등) 7. 피해자 조사시 증거자료 제출 및 범죄사실·범인특정을 위해 피해상황에 대하여 자세히 진술한다.");
			hyperreply([closest_data[2] + "(으)로 길 안내", closest_data[2] + "(으)로 전화연결"]);
		}
		else if (say == '성범죄') {
			find_closest();
			replymsg("1. 성폭력 피해를 입었다면 성폭력 상담소, 원스톱 지원센터 등 성폭력피해자 통합지원센터, 여성긴급전화 1366센터 등으로 전화하여 경찰에 신고를 해야할지, 다른 도움 받을 곳이 있는지에 대하여 상담한다. 2. 신체 및 정신적으로 피해를 입은 상태이므로 진료를 받으러 병원으로 간다. 3. 성폭력이 발생한 자리는 그대로를 보존한다. 4. 성폭력 피해 당시 입었던 옷이나 다른 증거물은 모아 습기가 차지 않도록 코팅되지 않은 종이봉투에 보관한다. 5. 몸에 멍이나 상처가 있을 경우 사진을 찍어 놓는다. 6. 주위사람이나 지인에게 도움을 요청한다.");
			hyperreply([closest_data[2] + "(으)로 길 안내", closest_data[2] + "(으)로 전화연결"]);
		}
		else if (say == '사기') {
			replymsg("사기를 당하셨을 경우 아래 전화연결로 유형별 대처방법을 설명받으세요.");
			hyperreply([closest_data[2] + "(으)로 길 안내", closest_data[2] + "(으)로 전화연결"]);
		}
		else if (say == 'howto') {
			replymsg("안녕하세요. 문의사항을 자유롭게 채팅하시거나, 왼쪽 하단 메뉴를 눌러 폴리챗에서 제공하는 서비스를 확인해보세요.");
		}

		else if (say == '분실물 습득') {
			map_init();
			replymsg("분실물을 습득하셨군요. 현재 위치와 가까운 경찰서는 " + closest_data[2] + "입니다. 무엇을 도와드릴까요?");
			hyperreply([closest_data[2] + "(으)로 길 안내", closest_data[2] + "(으)로 전화연결"]);
		}
		else if (say == 'fallback') {
			find_closest();
			replymsg("죄송해요. 말씀을 잘 이해하지 못했어요. 폴리챗은 현재 베타 버전으로 분실물 습득 신고, 밤길 순찰 서비스, 교통법규위반 신고, 강도 등 범죄 신고 안내를 하고 있습니다. 앞으로 더 많은 문의를 이해하고 답변할 수 있도록 발전하겠습니다! 더 궁금하신 사항은 아래 전화연결을 누르셔서 상담 받아보세요.");
			hyperreply([closest_data[2] + "(으)로 전화연결"]);
		}
		else {
			replymsg(say);
		}
	}
}

/* 기본적인 텍스트 답장 */
replymsg = function (txt) {
	var newTalkBox = $('<div>')
		.addClass('chatbox');
	var newTalk = $('<p>')  // 내용 추가
		.text(txt)
		.addClass('reply')
		.appendTo(newTalkBox);
	newTalkBox.appendTo($('.chat-body'));
	$('#user-input').val('');

}

/* 기본적인 버튼형 선택지 답장 */
hyperreply = function (txtlist) {
	$('<div>').addClass('nextline')
		.appendTo('.chat-body');
	hypertxt(txtlist);
}

/* 버튼형 선택지 안의 텍스트 클릭 시 */
hypertxt = function (txt) {
	if (Array.isArray(txt)) {
		var lstcount = txt.length;
	}
	else {
		var lstcount = 1;
	}
	for (i = 0; i < lstcount; i++) {
		var newtalk = $('<p>')
			.addClass('linktext');
		if (lstcount == 1) {
			newtalk.text(txt);
			newtalk.appendTo($('.chat-body'))
				.click(function () {
					sending(txt);
				});
		}
		else {
			newtalk.text(txt[i]);
			newtalk.appendTo($('.chat-body'))
				.click(function () {
					var say = $(this).text();
					sending(say);
				});
		}
	}
}

/* 이미지파일 답장 함수 */
replypic = function (src) {
	var newTalkBox = $('<p>')
		.addClass('chatimgbox');
	var newpic = $('<img>')
		.addClass('chatimg')
		.attr('src', src);
	var newTalk = $('<p>')  // 내용 추가
		.addClass('reply')
		.append(newpic)
		.appendTo(newTalkBox);
	newTalkBox.appendTo($('.chat-body'));
	$('#user-input').val('');

}
/* 지도 답장 함수 */
replymap = function () {
	var newTalkBox = $('<div>')
		.addClass('chatbox');
	var newTalk = $('<div>')
		.addClass('map')
		.addClass('reply')
		.appendTo(newTalkBox);
	newTalkBox.appendTo($('.chat-body'));
	$('#user-input').val('');

}

/* embed형 웹사이트 답장 함수 */
replyweb = function () {
	var newTalkBox = $('<div>')
		.addClass('chatbox');
	var newTalk = $('<div>')
		.addClass('web')
		.addClass('reply')
		.appendTo(newTalkBox);
	newTalkBox.appendTo($('.chat-body'));
	$('#user-input').val('');
}

/* 하이퍼링크 목록 답장 함수 */
hyperlink = function (text, link) {
	var hyperbox = $('<div>')
		.addClass('hyperbox');
	var table = $('<table></table>').addClass('linktable');
	// link list를 받을 방법 필요.
	if (Array.isArray(text)) {
		var lstcount = text.length;
	}
	else {
		var lstcount = 1;
	}
	for (i = 0; i < lstcount; i++) {
		var row = $('<tr></tr>')
			.addClass('linkrow');
		var a = $('<a>')
			.addClass('linkhref');
		var data = $('<td></td>')
			.addClass('linktext');
		if (lstcount == 1) {
			a.attr('href', link);
			data.text(text);
		}
		else {
			a.attr('href', link[i]);
			data.text(text[i]);
		}
		a.attr('target', '_blank');
		a.append(data);
		row.append(a);
		table.append(row);
	}
	table.appendTo(hyperbox);
	hyperbox.addClass('reply');
	hyperbox.appendTo($('.chat-body'));
}

