//map in main & modal
var mapMain;
var mapModal;
//map
function initialize() {
    //location
    var mapPosition = new google.maps.LatLng(13.880071, 100.549833);

    //marker
    var markerMain = new google.maps.Marker({
        position: mapPosition,
    });

    var markerModal = new google.maps.Marker({
        position: mapPosition,
        draggable: true
    });
    //dragend event of marker
    google.maps.event.addListener(markerModal, 'dragend', function() {
        var lat = markerModal.getPosition().lat();
        var lng = markerModal.getPosition().lng();
        document.querySelector("#lat").value = lat;
        document.querySelector("#lng").value = lng;
    });


    // create  map
    var mapPropMain = {
        center: mapPosition,
        zoom: 19,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        draggable: true,
        scrollwheel: true,
        mapTypeControl: true,
        streetViewControl: true,
        zoomControl: true,

    };

    var mapPropModal = {
        center: mapPosition,
        zoom: 19,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        draggable: true,
        scrollwheel: true,
        mapTypeControl: true,
        streetViewControl: true,
        zoomControl: true,
    };

    //get map
    mapMain = new google.maps.Map(document.getElementById('mapInMain'), mapPropMain);
    markerMain.setMap(mapMain);

    mapModal = new google.maps.Map(document.getElementById('mapInModal'), mapPropModal);
    markerModal.setMap(mapModal);


    //set center
    document.getElementById('reset').addEventListener('click', function() {
        initialize();
        document.querySelector("#lat").value = "";
        document.querySelector("#lng").value = "";
    });
};

//resize map
function resizeMap() {
    if (typeof mapModal == "undefined") return;
    setTimeout(function() {
        resizingMap();
    }, 200);
};
function resizingMap() {
    if (typeof mapModal == "undefined") return;
    var center = mapModal.getCenter();
    google.maps.event.trigger(mapModal, "resize");
    mapModal.setCenter(center);
};
