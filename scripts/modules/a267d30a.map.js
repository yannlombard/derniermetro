define([
    // Application.
    'app',
    'jquery',
    'lodash',
    'backbone',
    //'text!templates/index.html'

],function(app, $, _, Backbone) {

    var Map = {};

    /**
     * backbone view
     */
    Map.view = Backbone.View.extend({

        initialize: function() {

            _.bindAll(this, 'render');

            // set walk path when location latlng, station latlng & map ready
            this.model.on('change:latlngLocationReady',    this.mapNlocationNstationReady, this);
            this.model.on('change:latlngStationReady',     this.mapNlocationNstationReady, this);

            this.render();
        },

        render: function() {

            if(this.model.get('mapRendered')) {

                // recenter map
                this.model.get('marker').setPosition(this.model.get('location').latlng);
                this.model.get('map').setCenter(this.model.get('location').latlng);

            } else {

                // generate map
                var latlng = this.model.get('location').latlng;

                var myOptions = {
                    zoom        : this.model.get('zoom'),
                    center      : latlng,
                    mapTypeId   : this.model.get('mapTypeId')
                };

                var map = new google.maps.Map(this.el, myOptions);

                var marker = new google.maps.Marker({
                    map         : map,
                    position    : latlng,
                    visible     : false
                });

                setTimeout(function() {

                    marker.setVisible(true);
                    marker.setAnimation(google.maps.Animation.DROP);

                }, 750);

                this.model.set({
                    map         : map,
                    marker      : marker,
                    mapRendered : true
                });

            }

        },

        mapNlocationNstationReady: function() {

            if(this.model.get('latlngStationReady') &&
                this.model.get('latlngLocationReady')) {

                this.renderWalkPath();
            }

        },

        renderWalkPath: function() {

            // force change event
            this.model.set({
                durationReady   : false
            });

            var request = {
                origin      : this.model.get('location').latlng,
                destination : this.model.get('station').latlng,
                travelMode  : this.model.get('travelMode')
            };

            var self = this;

            this.model.get('directionsService').route(request, function(response, status) {

                if (status == google.maps.DirectionsStatus.OK) {

                    var duration = self.model.get('duration');

                    _.extend(duration, {
                        text    : response.routes[0].legs[0].duration.text,
                        value   : response.routes[0].legs[0].duration.value,
                        delta   : response.routes[0].legs[0].duration.value / 60 // minutes
                        //delta   : (2 * 24 * 60) - 5 // minutes
                    });

                    self.model.set({
                        durationReady   : true,
                        duration        : duration
                    });

                    self.model.get('directionsDisplay').setDirections(response);

                    //distance = "The distance between the two points on the chosen route is: "+response.routes[0].legs[0].distance.text;
                    //distance += "<br/>The aproximative walking time is: "+response.routes[0].legs[0].duration.text;
                    //document.getElementById("distance_road").innerHTML = distance;
                }

            });

        }

    });

    return Map;

});
