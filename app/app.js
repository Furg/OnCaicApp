(function(){
    var app = angular.module("mapsApp", [ ]);

    app.controller("MapCtrl", ["$http","$timeout",
        function($http, $timeout) {
            this.selected = false;
            this.HOSTINGS_API = "http://oncaic.herokuapp.com/hostings";
            var hostingCtrl = this;
            var mapOptions = {
                center: new google.maps.LatLng(41.94894, 2.284156),
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
                        var imageCamping = "http://aba8.hol.es/camping-2.png";
                        var imageRural = "http://aba8.hol.es/rockhouse-2.png";
                        angular.forEach(hostingCtrl.hostings, function(host) {
                            var marker;
                            if(host.type === "CAMPING" ){
                                marker = new google.maps.Marker({
                                    map: hostingCtrl.map,
                                    position: new google.maps.LatLng(host.latitude, host.longitude),
                                    title: host.name,
                                    icon: imageCamping
                                });


                            }
                            else if(host.type === "ESTABLIMENT HOTELER" ){
                                marker = new google.maps.Marker({
                                    map: hostingCtrl.map,
                                    position: new google.maps.LatLng(host.latitude, host.longitude),
                                    title: host.name,
                                    icon: imageHotel
                                });
                            } else {
                                marker = new google.maps.Marker({
                                    map: hostingCtrl.map,
                                    position: new google.maps.LatLng(host.latitude, host.longitude),
                                    title: host.name,
                                    icon: imageRural
                                });
                            }

                            google.maps.event.addListener(marker, 'click', function(){
                                hostingCtrl.setCenterMarker(host);
                                hostingCtrl.setDetails(host);
                            });


                        });
                    });
            };

            this.setCenterMarker = function(host){
                hostingCtrl.map.panTo(new google.maps.LatLng(host.latitude, host.longitude));
                $timeout(function(){hostingCtrl.zoomIn()}, 250);
            };

            this.setCenter = function(host){
                hostingCtrl.zoomOut();
                $timeout(function(){hostingCtrl.map.panTo(new google.maps.LatLng(host.latitude, host.longitude))}, 500);
                $timeout(function(){hostingCtrl.zoomIn()}, 750);
            };

            this.zoomIn = function(){
                var current = hostingCtrl.map.getZoom();
                if(current >= 13){
                    return 0;
                }
                else{
                    hostingCtrl.map.setZoom(current+2);
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