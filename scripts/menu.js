$(function () {
/* 화면 버튼별 기능 */
/* 전송 버튼 클릭 시*/
$('#send').click(function () {  
	if ($('#user-input').val() != '') {
		var say = $('#user-input').val();
		sending(say);
		$('#user-input').val(null);
	}
});
/* 메뉴 클릭 시 */
$('#menu').click(function () {
	if ($('#menu-body').is(':visible')) {
		$('#menu-body').hide();
		$('.chat-footer').css('bottom', '0px');
		$('.chat-body').css('bottom', '10%');
	}
	else {
		$('#menu-body').show();
		$('.chat-footer').css('bottom', '200px');
		$('.chat-body').css('bottom', '260px');
	}
});

/* 메뉴 안 버튼 */
/* 인덱스 */
getmenuindex = function () {
	totalmenu = $('.menu-item').length + 1; // 메뉴 갯수
	totalindex = Math.ceil(totalmenu / 8);
	var indexbox = $('<div>')
		.attr('id', 'indexbox');
	for (var i = 0; i < totalindex; i++) {
		var indexdot = $('<img>')
			.addClass('indexdot')
			.attr('src', './image/dot.png');
		indexbox.append(indexdot);
	}
	indexbox.prependTo('#menu-body');
	chooseindex(1);
}

/* 현재 인덱스 */
var currentindex;
chooseindex = function (num) {
	$('.indexdot').removeClass('indexdot-selected');
	$(".indexdot:nth-child(" + num + ")").addClass('indexdot-selected');
	$(".menu-item[index!=" + num + "]").hide();
	$(".menu-item[index=" + num + "]").show();
	currentindex = num;
}

/* 메뉴 추가 함수 */
addmenu = function (name, img) {
	totalmenu = $('.menu-item').length + 1; // 총 메뉴 갯수
	totalindex = Math.ceil(totalmenu / 8);
	if (totalindex > 1) {
		itemindex = totalindex;
	} else { itemindex = 1; }
	newitem = $('<div>')
		.addClass('menu-item')
		.attr('index', itemindex);
	itemimg = $('<img>')
		.attr('src', img)
		.addClass('item-img')
		.appendTo(newitem);
	itemtext = $('<div>')
		.text(name)
		.addClass('item-text')
		.appendTo(newitem);
	newitem.appendTo('#menu-body');
	newitem.click(function () {
		var say = $(this).text();
		sending(say);
	});
}

/* 메뉴 항목 추가 */
	addmenu("순찰 신청", "./image/m1.jpg");
	addmenu("오늘의 미담", "./image/m2.png");
	addmenu("주변 경찰서 위치", "./image/m3.jpg");
	addmenu("범죄 신고", "./image/m4.png");
	addmenu("분실 신고", "./image/m5.png");
	addmenu("교통법규위반 신고", "./image/m6.png");
	addmenu("운전면허 갱신", "./image/m7.png");
	addmenu("담당부서 연결", "./image/m8.png");
	addmenu("메뉴 추가 가능", "./image/m9.png");


	getmenuindex();
/* 오른쪽으로 스와이프 시 */
$('#menu-body').on('swiperight', $('#menu-body'), function (event) {
	var nextindex = currentindex - 1;
	if (nextindex < 1) {
		nextindex = 1;
	}
	chooseindex(nextindex);
});
/* 왼쪽으로 스와이프 시 */
$('#menu-body').on('swipeleft', $('#menu-body'), function (event) {
	var nextindex = currentindex + 1;
	if (nextindex > totalindex) {
		nextindex = totalindex;
	}

	chooseindex(nextindex);
});

/* 입력창에 키 입력시 동작 */
$('#user-input').on('keypress', function (event) {   //엔터
	if ($('#user-input').val() != '' && event.keyCode == 13) {
		var say = $('#user-input').val();
		sending(say);
	}
});

$('#user-input').on('keyup', function (event) {
	if (event.keyCode == 13) {
		$('#user-input').val('');
	}
});
/* 챗봇 페이지에서 나가려고 할 시 */
$(window).bind('beforeunload', function () {
	if ($('#menu-body').is(':visible')) {
		$('#menu-body').hide();
		$('.chat-footer').css('bottom', '0px');
		$('.chat-body').css('bottom', '10%');
	}
	//return false;
	event.returnValue = '챗봇 이용을 종료합니까?';
});

/* 모바일 전용 설정 */
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
if (isMobile) {
	/* 끝까지 스크롤했는지 검사하기 */
	var currentscroll = $('.chat-body').scrollTop();
	var currentheight = $(".chat-body")[0].scrollHeight;
	scrollleft = currentheight - currentscroll;
	$('#user-input').click(function () {
		if ($('.chat-body').scrollTop() + $('.chat-body').height() >= $('.chat-body')[0].scrollHeight && $('.chat-body').scrollTop() + $('.chat-body').height() <= $('.chat-body')[0].scrollHeight + 1) // 이제까지 스크롤한 양과 + 화면에 보이는 chat body 높이를 더한것과 전체 스크롤가능 양이 같아야 끝까지 스크롤 한거지.
		{
			scrollbottom = true;
		} else {
			scrollbottom = false;
		}
	});

	/* 모바일 키보드 오픈 시 */
	var originalSize = jQuery(window).height();
	jQuery(window).resize(function () {
		// 모바일 키보드가 올라온 경우
		if (jQuery(window).height() != originalSize && $('#user-input').is(':focus')) {
			if ($('#menu-body').is(':visible')) {
				$('#menu-body').hide();
				$('.chat-footer').css('bottom', '0px');
				$('.chat-body').css('bottom', '10%');
			}
			$('.chat-body').css('margin-bottom', "8%");
			// 끝까지 스크롤 한 경우
			if (scrollbottom) {
				$(".chat-body").scrollTop($(".chat-body")[0].scrollHeight);
			}
		}
		// 모바일 키보드가 사라진 경우
		else {
			$('.chat-body').css('margin-bottom', '0');
		}
	});
	}
});