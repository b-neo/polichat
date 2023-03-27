/* ����(query) ���� ��� */
sending = function (say) {
	var newTalkbox = $('<div>')
		.addClass('chatbox');
	var today = new Date();     // �ð� �߰�
	var hour = today.getHours();
	if (hour > 12) {
		hour = "���� " + (hour - 12);
	}
	else if (hour == 12) {
		hour = "���� " + hour;
	}
	else {
		hour = "���� " + hour;
	}
	now = /*today.getFullYear() +"�� " + today.getMonth()+"�� " + today.getDate() +"�� "+ */hour + "�� " + today.getMinutes() + "�� ";
	var time = $('<p>')
		.html(now)
		.addClass('time')
		.appendTo(newTalkbox);

	var newTalk = $('<p>')  // ���� �߰�
		.text(say)
		.addClass('chat')
		.appendTo(newTalkbox);

	newTalkbox.css('float', 'right'); // * ������ ǥ�� * //
	newTalkbox.appendTo($('.chat-body'));  // ä��â�� �߰�
	reply(say);
	$(".chat-body").scrollTop($(".chat-body")[0].scrollHeight);  //��ũ�ѹ� �ڵ� ������
}

/* AI �ڿ��� intent �ľ� ��� */
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

/* ���� ���� ��� */
reply = function (say) {
	/* �������� ��ġ�� ��� �亯 ó�� */
	if (say == '������ �̴�') {
		replymsg('������ �̴��� �����帳�ϴ�.');
		hyperlink(["�ڷγ�19 �غ�, ���� ���� �̴� �մ޾�", "������ �ź� ��� �ش��� ���� �õ��� 50��, ���� �������� ��� ����"], ['https://news.bbsi.co.kr/news/articleView.html?idxno=978949', "http://www.joongboo.com/news/articleView.html?idxno=363445219"]);
	}
	else if (say == '���� ��û' || say == '���� ���� ��û') {
		replymsg("'ź�¼���'�� �¶����̳� ���������� ���� ���� �����в��� ������ ����ϴ� �ð��� ��Ҹ� ���� �������ֽø� ������ �������񽺸� �������ִ� ���ο� ��������Դϴ�.");
		hyperlink(["ź�¼��� �Ź��� ����������", "ź�¼��� ��û (�������)", "ź�¼��� ��û (�Խ���)"], ["http://patrol.police.go.kr/usr/main.do#", "http://patrol.police.go.kr/map/map.do", "http://patrol.police.go.kr/cop/bbs/anonymous/selectBoardList.do?bbsId=BBSMSTR_000000000001"]);
	}
	else if (say == '�ֺ� ������ ��ġ' || say == '�α� ������ ��ȭ') {
		map_init();
		replymsg("�� ��ġ�� ���� ����� �������� " + closest_data[2] + "�Դϴ�.");
		hyperreply([closest_data[2] + '(��)�� ��ȭ����', closest_data[2] +"(��)�� �� �ȳ�"]);
	}
	else if (say == '�н� �Ű�') {
		var situation = "�нǹ��� �����ϼ̱���. ";
		map_init();
		replymsg(situation + "���� ��ġ�� ����� �������� " + closest_data[2] + "�Դϴ�. ������ ���͵帱���?");
		hyperreply([closest_data[2] + "(��)�� �� �ȳ�", closest_data[2] + "(��)�� ��ȭ����"]);
	}

	else if (say == '�߾Ӽ� ħ��') {
		find_closest();
		replymsg("�߾Ӽ� ħ���� ��Ģ��(���·�)�� ������ ��: 7����(10����), �¿��� ��: 6����(9����), �̷��� ��: 4����, ������ ��: 3�����Դϴ�. ");
		hyperreply(["����������� �Ű� �������� �̵�", closest_data[2] + "(��)�� �� �ȳ�", closest_data[2] + "(��)�� ��ȭ����"]);
	}
	else if (say == '����������� �Ű� �������� �̵�') {
		replymsg("����������� �Ű� �������� �̵��մϴ�. ");
		var url = "http://onetouch.police.go.kr/";
		window.open(url, "_blank");
	}
	else if (say == '�������� ����') {
		replymsg("�������� ���ſ� ���� �˷��帳�ϴ�. �ñ��Ͻ� ���� �������ּ���.");
		hyperreply(["�������� ���� ��û", "�������� ������ �ȳ�", "�������� ���չο����� ��ȭ����"]);
	}
	else if (say == '�������� ���չο����� ��ȭ����') {
		window.open('tel:1577-1120');
	}

	/* ��ġ ���� ��� ��� Ʃ�丮�� */
	else if (say == '��ġ ���� ��� Ʃ�丮��') {
		replymsg('�Ʒ� �׸�ó�� �����ϼ���');
		replypic("./image/permission_pc.gif");
	}
	/* GPS �̿� �� �ȳ� �� ��ȭ���� ��� */
	else if (say.slice(-9) == "(��)�� �� �ȳ�") {
		var url = "https://map.kakao.com/link/to/" + closest_data[2] + "," + closest_data[0] + "," + closest_data[1];
		window.open(url, "_blank");
	}
	else if (say.slice(-9) == '(��)�� ��ȭ����') {
		var index = say.indexOf("(��)");
		var tellnumber = closest_data[3];
		window.open('tel:' + tellnumber);
	}
	/* �ܼ� ������ Ŭ���� �ƴ� ML�� Ȱ���� ������ Intent�� �ľ��Ͽ� �亯*/
	else {
		say = ai(say); // �� ������ �ǵ� �ľ�
		say = say.slice(1, say.length - 1);

		/* �ǵ� �� �亯ó�� */
		if (say == '��� ������') {
			replymsg("�Ʒ� �׸� �� ã���ô°� �����Ű���?");
			hyperreply(["���� ���� ��û", "�α� ������ ��ȭ"]);
		}
		else if (say == '�ȳ��ϼ���') {
			find_closest();
			replymsg("�ȳ��ϼ���. " + closest_data[2] + "�Դϴ�. ������ ���͵帱���?");
			hyperreply(["���� ��û", closest_data[2] + "(��)�� ��ȭ����", closest_data[2] + "(��)�� �� �ȳ�"]);
		}
		else if (say == '�������� ���� ��û') {
			replymsg("�������� ���� ��û �������� �̵��մϴ�. ");
			var url = "https://www.gov.kr/main?a=AA020InfoCappViewApp&HighCtgCD=A08004&CappBizCD=13200000030";
			window.open(url, "_blank");
		}
		else if (say == '�������� ������ �ȳ�') {
			replymsg("�������� ������ �ȳ� �������� �̵��մϴ�. ");
			var url = "https://www.safedriving.or.kr/guide/rerGuide05View.do?menuCode=MN-PO-1115";
			window.open(url, "_blank");
		}
		else if (say == '���μ� ����') {
			replymsg(say + "���� ������ ���͵帮�ڽ��ϴ�. �Ʒ� ��ȭ������ �����ø� �ο�����Ƿ� ����˴ϴ�.");
			hyperreply([closest_data[2] + "(��)�� �� �ȳ�", closest_data[2] + "(��)�� ��ȭ����"]);
		}
		else if (say == '���� ����') {
			find_closest();
			replymsg("���ֿ������� ���ߵǸ� �����ڴ� ����� �λ�� �ڱ�δ�ݰ� ���� �λ��� å��, 5�� ������ ¡�� �Ǵ� 2000���� ������ ���ݰ� ���� ������ å��, �������� ������ ��ҿ� ���� ����å���� ��� ���� �մϴ�.");
			hyperreply(["����������� �Ű� �������� �̵�", closest_data[2] + "(��)�� �� �ȳ�", closest_data[2] + "(��)�� ��ȭ����"]);
		}
		else if (say == '���� �Ű�') {
			find_closest();
			replymsg("���˸� �Ű��մϴ�. �Ű��� ������ �����ðų� �Ʒ� �׸񿡼� ������.");
			hyperreply(["����", "������", "���", closest_data[2] + "(��)�� �� �ȳ�", closest_data[2] + "(��)�� ��ȭ����"]);
		}
		else if (say == '����������� �Ű�') {
			find_closest();
			replymsg("������������� ����ϼ̱��� �Ű��� ������ �����ðų� �Ʒ� �׸񿡼� ������.");
			hyperreply(["�߾Ӽ� ħ��", "���� ����", closest_data[2] + "(��)�� �� �ȳ�", closest_data[2] + "(��)�� ��ȭ����"]);
		}
		else if (say == '����') {
			find_closest();
			replymsg("�������� �� ��ó����Դϴ�. 1. ��ü�� ������ ���� �ϴ� �����ڷκ��� ���Ѵ�. 2. 112�� �Ű��� ������ ������ ��û�Ѵ�. 3. ��ޱ�ȣ(�ӽü���, ���� �ļ�)�� ���� ���� ���� ����(������, �λ� ���ع�� û��)�� �غ��Ѵ�. 4. ����������������� ���� ȸ�� �� ������ ���Ͽ� ����Ѵ�. 5. ��ü ���ؿ� ���Ͽ� ��� ġ�Ḧ �޴´�. 6. �����ڷḦ Ȯ���Ͽ� �����Ѵ�.(������, ���غ��� �����Կ� ��) 7. ������ ����� �����ڷ� ���� �� ���˻�ǡ�����Ư���� ���� ���ػ�Ȳ�� ���Ͽ� �ڼ��� �����Ѵ�.");
			hyperreply([closest_data[2] + "(��)�� �� �ȳ�", closest_data[2] + "(��)�� ��ȭ����"]);
		}
		else if (say == '������') {
			find_closest();
			replymsg("1. ������ ���ظ� �Ծ��ٸ� ������ ����, ������ �������� �� ������������ ������������, ���������ȭ 1366���� ������ ��ȭ�Ͽ� ������ �Ű� �ؾ�����, �ٸ� ���� ���� ���� �ִ����� ���Ͽ� ����Ѵ�. 2. ��ü �� ���������� ���ظ� ���� �����̹Ƿ� ���Ḧ ������ �������� ����. 3. �������� �߻��� �ڸ��� �״�θ� �����Ѵ�. 4. ������ ���� ��� �Ծ��� ���̳� �ٸ� ���Ź��� ��� ���Ⱑ ���� �ʵ��� ���õ��� ���� ���̺����� �����Ѵ�. 5. ���� ���̳� ��ó�� ���� ��� ������ ��� ���´�. 6. ��������̳� ���ο��� ������ ��û�Ѵ�.");
			hyperreply([closest_data[2] + "(��)�� �� �ȳ�", closest_data[2] + "(��)�� ��ȭ����"]);
		}
		else if (say == '���') {
			replymsg("��⸦ ���ϼ��� ��� �Ʒ� ��ȭ����� ������ ��ó����� �����������.");
			hyperreply([closest_data[2] + "(��)�� �� �ȳ�", closest_data[2] + "(��)�� ��ȭ����"]);
		}
		else if (say == 'howto') {
			replymsg("�ȳ��ϼ���. ���ǻ����� �����Ӱ� ä���Ͻðų�, ���� �ϴ� �޴��� ���� ����ê���� �����ϴ� ���񽺸� Ȯ���غ�����.");
		}

		else if (say == '�нǹ� ����') {
			map_init();
			replymsg("�нǹ��� �����ϼ̱���. ���� ��ġ�� ����� �������� " + closest_data[2] + "�Դϴ�. ������ ���͵帱���?");
			hyperreply([closest_data[2] + "(��)�� �� �ȳ�", closest_data[2] + "(��)�� ��ȭ����"]);
		}
		else if (say == 'fallback') {
			find_closest();
			replymsg("�˼��ؿ�. ������ �� �������� ���߾��. ����ê�� ���� ��Ÿ �������� �нǹ� ���� �Ű�, ��� ���� ����, ����������� �Ű�, ���� �� ���� �Ű� �ȳ��� �ϰ� �ֽ��ϴ�. ������ �� ���� ���Ǹ� �����ϰ� �亯�� �� �ֵ��� �����ϰڽ��ϴ�! �� �ñ��Ͻ� ������ �Ʒ� ��ȭ������ �����ż� ��� �޾ƺ�����.");
			hyperreply([closest_data[2] + "(��)�� ��ȭ����"]);
		}
		else {
			replymsg(say);
		}
	}
}

/* �⺻���� �ؽ�Ʈ ���� */
replymsg = function (txt) {
	var newTalkBox = $('<div>')
		.addClass('chatbox');
	var newTalk = $('<p>')  // ���� �߰�
		.text(txt)
		.addClass('reply')
		.appendTo(newTalkBox);
	newTalkBox.appendTo($('.chat-body'));
	$('#user-input').val('');

}

/* �⺻���� ��ư�� ������ ���� */
hyperreply = function (txtlist) {
	$('<div>').addClass('nextline')
		.appendTo('.chat-body');
	hypertxt(txtlist);
}

/* ��ư�� ������ ���� �ؽ�Ʈ Ŭ�� �� */
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

/* �̹������� ���� �Լ� */
replypic = function (src) {
	var newTalkBox = $('<p>')
		.addClass('chatimgbox');
	var newpic = $('<img>')
		.addClass('chatimg')
		.attr('src', src);
	var newTalk = $('<p>')  // ���� �߰�
		.addClass('reply')
		.append(newpic)
		.appendTo(newTalkBox);
	newTalkBox.appendTo($('.chat-body'));
	$('#user-input').val('');

}
/* ���� ���� �Լ� */
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

/* embed�� ������Ʈ ���� �Լ� */
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

/* �����۸�ũ ��� ���� �Լ� */
hyperlink = function (text, link) {
	var hyperbox = $('<div>')
		.addClass('hyperbox');
	var table = $('<table></table>').addClass('linktable');
	// link list�� ���� ��� �ʿ�.
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

