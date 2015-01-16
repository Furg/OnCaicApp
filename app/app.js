(function(){
    var app = angular.module("mapsApp", [ ]);

    app.controller("MapCtrl", ["$http","$timeout",
        function($http, $timeout) {
            this.selected = false;
            this.HOSTINGS_API = "http://oncaic.herokuapp.com/hostings";
            var hostingCtrl = this;
            var mapOptions = {
                center: new google.maps.LatLng(41.614490, 0.627414),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

            this.listHostings = function(){
                $http.get(this.HOSTINGS_API)
                    .success(function (data) {
                        hostingCtrl.hostings = data;
                    }).then(
                    function(){
                        var imageHotel = "http://aba8.hol.es/hotel_0star.png";
                        angular.forEach(hostingCtrl.hostings, function(host) {

                            var marker = new google.maps.Marker({
                                map: hostingCtrl.map,
                                position: new google.maps.LatLng(host.latitude, host.longitude),
                                title: host.name,
                                icon: imageHotel
                            });
                        });
                    });
            };

            this.setCenter = function(host){
                hostingCtrl.zoomOut();
                $timeout(function(){hostingCtrl.map.panTo(new google.maps.LatLng(host.latitude, host.longitude))}, 250);
                $timeout(function(){hostingCtrl.zoomIn()}, 500);
            };

            this.zoomIn = function(){
                var current = hostingCtrl.map.getZoom();
                if(current >= 12){
                    return 0;
                }
                else{
                    hostingCtrl.map.setZoom(current+1);
                    $timeout(function(){hostingCtrl.zoomIn()},50);
                }
            };

            this.zoomOut = function(){
                var current = hostingCtrl.map.getZoom();
                if(current <= 8){
                    return 0;
                }
                else{
                    hostingCtrl.map.setZoom(current-1);
                    $timeout(function(){hostingCtrl.zoomOut()},50);
                }
            };

            this.setDetails = function(host){

                this.selected = true;

                this.details = host;

            };


        }]);


}());