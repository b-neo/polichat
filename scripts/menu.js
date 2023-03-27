$(function () {
/* ȭ�� ��ư�� ��� */
/* ���� ��ư Ŭ�� ��*/
$('#send').click(function () {  
	if ($('#user-input').val() != '') {
		var say = $('#user-input').val();
		sending(say);
		$('#user-input').val(null);
	}
});
/* �޴� Ŭ�� �� */
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

/* �޴� �� ��ư */
/* �ε��� */
getmenuindex = function () {
	totalmenu = $('.menu-item').length + 1; // �޴� ����
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

/* ���� �ε��� */
var currentindex;
chooseindex = function (num) {
	$('.indexdot').removeClass('indexdot-selected');
	$(".indexdot:nth-child(" + num + ")").addClass('indexdot-selected');
	$(".menu-item[index!=" + num + "]").hide();
	$(".menu-item[index=" + num + "]").show();
	currentindex = num;
}

/* �޴� �߰� �Լ� */
addmenu = function (name, img) {
	totalmenu = $('.menu-item').length + 1; // �� �޴� ����
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

/* �޴� �׸� �߰� */
	addmenu("���� ��û", "./image/m1.jpg");
	addmenu("������ �̴�", "./image/m2.png");
	addmenu("�ֺ� ������ ��ġ", "./image/m3.jpg");
	addmenu("���� �Ű�", "./image/m4.png");
	addmenu("�н� �Ű�", "./image/m5.png");
	addmenu("����������� �Ű�", "./image/m6.png");
	addmenu("�������� ����", "./image/m7.png");
	addmenu("���μ� ����", "./image/m8.png");
	addmenu("�޴� �߰� ����", "./image/m9.png");


	getmenuindex();
/* ���������� �������� �� */
$('#menu-body').on('swiperight', $('#menu-body'), function (event) {
	var nextindex = currentindex - 1;
	if (nextindex < 1) {
		nextindex = 1;
	}
	chooseindex(nextindex);
});
/* �������� �������� �� */
$('#menu-body').on('swipeleft', $('#menu-body'), function (event) {
	var nextindex = currentindex + 1;
	if (nextindex > totalindex) {
		nextindex = totalindex;
	}

	chooseindex(nextindex);
});

/* �Է�â�� Ű �Է½� ���� */
$('#user-input').on('keypress', function (event) {   //����
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
/* ê�� ���������� �������� �� �� */
$(window).bind('beforeunload', function () {
	if ($('#menu-body').is(':visible')) {
		$('#menu-body').hide();
		$('.chat-footer').css('bottom', '0px');
		$('.chat-body').css('bottom', '10%');
	}
	//return false;
	event.returnValue = 'ê�� �̿��� �����մϱ�?';
});

/* ����� ���� ���� */
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
if (isMobile) {
	/* ������ ��ũ���ߴ��� �˻��ϱ� */
	var currentscroll = $('.chat-body').scrollTop();
	var currentheight = $(".chat-body")[0].scrollHeight;
	scrollleft = currentheight - currentscroll;
	$('#user-input').click(function () {
		if ($('.chat-body').scrollTop() + $('.chat-body').height() >= $('.chat-body')[0].scrollHeight && $('.chat-body').scrollTop() + $('.chat-body').height() <= $('.chat-body')[0].scrollHeight + 1) // �������� ��ũ���� ��� + ȭ�鿡 ���̴� chat body ���̸� ���ѰͰ� ��ü ��ũ�Ѱ��� ���� ���ƾ� ������ ��ũ�� �Ѱ���.
		{
			scrollbottom = true;
		} else {
			scrollbottom = false;
		}
	});

	/* ����� Ű���� ���� �� */
	var originalSize = jQuery(window).height();
	jQuery(window).resize(function () {
		// ����� Ű���尡 �ö�� ���
		if (jQuery(window).height() != originalSize && $('#user-input').is(':focus')) {
			if ($('#menu-body').is(':visible')) {
				$('#menu-body').hide();
				$('.chat-footer').css('bottom', '0px');
				$('.chat-body').css('bottom', '10%');
			}
			$('.chat-body').css('margin-bottom', "8%");
			// ������ ��ũ�� �� ���
			if (scrollbottom) {
				$(".chat-body").scrollTop($(".chat-body")[0].scrollHeight);
			}
		}
		// ����� Ű���尡 ����� ���
		else {
			$('.chat-body').css('margin-bottom', '0');
		}
	});
	}
});