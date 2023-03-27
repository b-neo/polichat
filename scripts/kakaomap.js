var map = null;
/* GPS 수집 허용 받기 */
function gpscheck() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (location) {
                //succ - 유저가 허용버튼을 클릭하여 값을 가져올 수 있는 상태
                mylat =  parseFloat(location.coords.latitude);
                mylon =  parseFloat(location.coords.longitude);
            },
            function (error) {
                //fail - 유저가 차단버튼을 클릭하여 값을 가져올 수 없는 상태
                alert("위치 권한이 차단되었습니다. 허용해주세요.");
                hyperreply('위치 권한 허용 튜토리얼');
            }
        );
    }
    else {
        //fail - 애초에 GPS 정보를 사용할 수 없는 상태
        alert("unavailable");
    }
}

//카카오 맵 생성
function map_init() {
    gpscheck();
    closest_data = find_closest();
    replymap();
        
    all_containers = document.getElementsByClassName('map');
    last_container = all_containers.length - 1;
    var container = all_containers[last_container];

    x = mylat; //33.450701;
    y = mylon; //126.570667;
    var options = {
        center: new kakao.maps.LatLng(x, y),
        level: 3
    };
    map = new kakao.maps.Map(container, options);
    //map_search();
    cluster_init();

    map.setCenter(new kakao.maps.LatLng(x, y));
    var mymarker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(x, y),
        title:"Me"
    });
    var iwContent = '<div>' +'내 위치' + '</div>'; // 인포윈도우
    var iwPosition = new kakao.maps.LatLng(x,y);
    var infowindow = new kakao.maps.InfoWindow({
        map: map, // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
    });
    infowindow.open(map, mymarker);
    mymarker.setMap(map);
    replymsg('참고: PC에서 실행 시 정확한 GPS 위치를 파악할 수 없어 모바일 환경에서 이용을 권장합니다. 손가락으로 지도를 확대/축소하여 전체 경찰서 위치를 확인할 수 있습니다.');
    }

//클러스터 생성
function cluster_init() {
    var clusterer = new kakao.maps.MarkerClusterer({
        map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
        minLevel: 10 // 클러스터 할 최소 지도 레벨 
    });


$.get("/json/location.json", function (data) {
        // 데이터에서 좌표 값을 가지고 마커를 표시합니다
        // 마커 클러스터러로 관리할 마커 객체는 생성할 때 지도 객체를 설정하지 않습니다
        var markers = $(data.positions).map(function (i, position) {
            
            marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(position.lat, position.lng),
            });
            var iwContent = '<div style="padding:5px;">' + position.name + '</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
            var iwPosition = new kakao.maps.LatLng(position.lat, position.lng);
            var infowindow = new kakao.maps.InfoWindow({
                map: map, // 인포윈도우가 표시될 지도
                position: iwPosition,
                content: iwContent,
            });
            infowindow.open(map, marker); 
            return marker;
        });

        // 클러스터러에 마커들을 추가합니다
    clusterer.addMarkers(markers);
    //내 위치로 화면 표시
    map.setCenter(new kakao.maps.LatLng(mylat, mylon));
    });
    
}

//가장 가까운 장소 찾기
function rad(x) { return x * Math.PI / 180; }
function find_closest() {
    gpscheck();
        $.get("/json/location.json", function (data) {
        var lat = mylat;
        var lng = mylon;
        var R = 6371; // radius of earth in km
        var distances = [];
        var closest = -1;

        for (i = 0; i < data.positions.length; i++) {
            var mlat = data.positions[i].lat;
            var mlng = data.positions[i].lng;
            var dLat = rad(mlat - lat);
            var dLong = rad(mlng - lng);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            distances[i] = d;
            if (closest == -1 || d < distances[closest]) {
                closest = i;
            }
        }
        closest_lat = data.positions[closest].lat;
        closest_lng = data.positions[closest].lng;
        closest_marker = data.positions[closest].name;
        closest_phone = data.positions[closest].phone;
        closest_data = [closest_lat, closest_lng, closest_marker, closest_phone];
        });
    return closest_data;
}
setTimeout("find_closest()", 1000);
 
// lat, lng json 파일 제작용 함수.
/*
function map_search() {
    var places = new kakao.maps.services.Places();
    var callback = function (result, status) {


        var arr = new Array("positions");
        console.log(result);

        for (var i = 0; i < 15; i++) {
            var latlng = new Object();
            latlng.lat = parseFloat(result[i].y);
            latlng.lng = parseFloat(result[i].x);
            latlng.name = result[i].place_name;
            latlng.phone = result[i].phone;
            arr.push(latlng);
            console.log(arr);
        }

        var jsonfile = JSON.stringify(arr);
        console.log(jsonfile);

        /*



        if (status === kakao.maps.services.Status.OK) {
            x = parseFloat(result[0].x);
            y = parseFloat(result[0].y);
            
            //마커 생성
            var marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(y, x)
            });

            marker.setMap(map);
            //마커로 화면 이동
            map.setCenter(new kakao.maps.LatLng(y, x));

        }
   ///////
    }


    places.keywordSearch('서울경찰서', callback, { "page": 3 });

}
*/