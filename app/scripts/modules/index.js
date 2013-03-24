define([
    // Application.
    'app',
    'jquery',
    'lodash',
    'backbone',
    'text!templates/index.html',
    'modules/address',
    'modules/stations',
    'modules/map',
    'modules/duration',
    'modules/last-metro',
    'modules/timer',
    'modules/alarm'

],function(app, $, _, Backbone, indexTemplate, Address, Stations, Map, Duration, LastMetro, Timer, Alarm) {

    var Index = {};

    /**
     * backbone model
     */
    Index.model = Backbone.Model.extend({
        defaults: {
            walkingDuration : -1,

            mapReady        : false,
            geocoder        : null,


            mapRendered     : false,
            map             : null,
            zoom            : 15,
            mapTypeId       : null,

            directionsService: null,
            directionsDisplay: null,

            locationReady   : false,
            location        : {
                lat     : null,
                lng     : null,
                alt     : null,
                altAcc  : null,
                heading : null,
                speed   : null,
                latlng : null
            },
            latlngLocationReady: false,

            address : '',

            stationReady: false,
            station : {
                lat         : 0,
                lng         : 0,
                title       : '',
                ligne       : '',
                directions  : [
                    {
                        title   : '',
                        time    : {
                            h: '',
                            m: ''
                        }
                    }
                ],

                latlng: null
            },
            latlngStationReady: false,
            defaultWay  : 0, // 0 or 1

            travelMode : null,

            durationReady: false,
            duration: {
                text            : '',
                value           : 0,
                delta           : -1,
                securityDelay   : 5 // minutes
            },

            targetTimeReady: false,
            targetTime : {

                walkingDays     : -1,
                walkingHours    : -1,
                walkingMinutes  : -1,

                h: -1,
                m: -1
            },

            ringTime: 0
        },

        initialize: function() {

            _.bindAll(this, 'mapAPIloaded');

            // set geocoder on gmap api loaded
            this.on('change:mapReady',  this.setGeocoder, this);

            // set travel mode
            this.on('change:mapReady', this.setTravelMode, this);

            // set mapTypeId
            this.on('change:mapReady',  this.setMapType, this);

            // set direction service on gmap api loaded
            this.on('change:mapReady',  this.setDirectionsService, this);

            // set directions display map
            this.on('change:map',       this.setDirectionsDisplayMap, this);

            // Launch all map & location functions
            this.on('change:mapReady',      this.mapNlocationReady, this);
            this.on('change:locationReady', this.mapNlocationReady, this);

            // set address when latlng object ready
            this.on('change:latlngLocationReady', this.latlngLocationReady, this);

            // get nearest station
            this.on('change:locationReady', this.getNearestStation, this);

            // update google latlng when station is defined
            this.on('change:mapReady',      this.mapNstationReady, this);
            this.on('change:stationReady',  this.mapNstationReady, this);

            // on duration delta ready : set ring time
            this.on('change:durationReady', this.setRingTime, this);

            // on defaultWay change : recalculate ring time
            this.on('change:defaultWay',    this.setRingTime, this);

            // listen gmap loaded
            //google.maps.event.addDomListener(window, 'load', this.mapAPIloaded);
            this.mapAPIloaded();

            // get current location
            this.getLocation();

        },

        mapAPIloaded: function() {

            // force change event
            this.set({
                mapReady: false
            })

            this.set({
                mapReady: true
            });

        },

        setGeocoder: function() {

            this.set({
                geocoder : new google.maps.Geocoder()
            });

        },

        setLatlng: function() {

            // force change event
            this.set({
                latlngLocationReady : false
            });

            var location = this.get('location');

            location.latlng = new google.maps.LatLng(
                this.get('location').lat,
                this.get('location').lng
            );

            this.set({
                location            : location,
                latlngLocationReady : true
            });

        },

        setTravelMode: function() {

            this.set({
                travelMode : google.maps.DirectionsTravelMode.WALKING
            });

        },

        setMapType: function() {

            this.set({
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

        },

        setDirectionsService: function() {

            this.set({
                directionsService: new google.maps.DirectionsService(),

                directionsDisplay: new google.maps.DirectionsRenderer({
                    suppressMarkers     : true,
                    suppressInfoWindows : true
                })
            });

        },

        setDirectionsDisplayMap: function() {

            this.get('directionsDisplay').setMap(this.get('map'));

        },

        mapNlocationReady: function() {

            if(this.get('mapReady') && this.get('locationReady')) {

                this.setLatlng();

            }

        },

        latlngLocationReady: function() {

            if(this.get('latlngLocationReady')) {

                this.setAddress();

            }
        },

        setAddress: function() {

            var self = this;

            this.get('geocoder').geocode({'latLng': this.get('location').latlng}, function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) {

                    if (results[1]) {

                        self.set({
                            address: results[0].address_components[0].long_name+' '+results[0].address_components[1].long_name
                        });

                    } else {

                        self.setAddressError("No results found");

                    }
                } else {

                    self.setAddressError(status);

                }
            });

        },

        setAddressError: function(error) {
            console.log('setAddressError', error);
        },

        getLocation: function() {

            var self = this;

            this.set({
                locationReady: false
            });

            //navigator.geolocation.watchPosition(function (position) {
            navigator.geolocation.getCurrentPosition(function (position) {

                self.set({

                    locationReady: true,
                    location: {
                        lat     : position.coords.latitude,
                        lng     : position.coords.longitude,
                        alt     : position.coords.altitude,
                        altAcc  : position.coords.altitudeAccuracy,
                        heading : position.coords.heading,
                        speed   : position.coords.speed
                    }
                });

            }, function (error) {

                self.getLocationError(error);

            }, {

                enableHighAccuracy  : true,
                maximumAge          : 1000

            });

        },

        getLocationError: function(error) {
            console.log('getLocationError', error);
        },

        mapNstationReady: function() {

            if(this.get('mapReady') && this.get('stationReady')) {

                this.setStationLatlng();

            }

        },

        setStationLatlng: function() {

            var station = this.get('station');

            // force change
            this.set({
                station             : {
                    latlngReady     : false
                },
                latlngStationReady  : false
            });

            station.latlng      = new google.maps.LatLng(station.lat, station.lng);
            station.latlngReady = true;

            this.set({
                station             : station,
                latlngStationReady  : true
            });

        },

        setRingTime: function() {

            if(this.get('durationReady')) {


                // force change event
                this.set({
                    targetTimeReady : false
                });

                // current station data
                var station = this.get('station');

                // current duration data
                var durData = this.get('duration');

                // walk duration in minutes
                var delta        = durData.delta;

                // security delay
                var securityDelay   = durData.securityDelay;// minutes

                // default way
                var defaultWay = this.get('defaultWay');

                // last depart time
                var time = {
                    h: station.directions[defaultWay].time.h,
                    m: station.directions[defaultWay].time.m
                };

                var walkingMinutesTot = Math.ceil(securityDelay + delta);// minutes

                var m = parseInt(time.m);
                var h = parseInt(time.h);

                var walkingDays     = Math.floor((walkingMinutesTot / 60) / 24);// jours de marche...
                var walkingHours    = Math.floor((walkingMinutesTot - (walkingDays * 24 * 60)) / 60);// heures de marche
                var walkingMinutes  = walkingMinutesTot - (walkingHours * 60) - (walkingDays * 24 * 60);// minutes de marche

                var targetMinute = m - walkingMinutes;

                var decalHour = 0;

                if(targetMinute < 0) {
                    decalHour = 1;
                    targetMinute = 60 + targetMinute;
                }

                var targetHour = h - walkingHours - decalHour;

                if(targetHour < 0) {
                    targetHour = 24 + targetHour;
                }

                this.set({
                    targetTime      : {
                        walkingDays     : walkingDays,
                        walkingHours    : walkingHours,
                        walkingMinutes  : walkingMinutes,

                        h               : targetHour,
                        m               : targetMinute
                    },
                    targetTimeReady : true
                });


            }

        }

    });

    /**
     * backbone view
     */
    Index.view = Backbone.View.extend({

        el: '#main',

        model: new Index.model(),

        template: _.template(indexTemplate),

        initialize: function() {
            // launch map and location functions
            this.model.on('change:latlngLocationReady', this.latlngLocationReady, this);

            this.render();

            // get nearest station
            //this.model.on('change:locationReady', this.setStationView, this);
            this.setStationView();

            // set Address View
            this.setAddressView();

            // set Duration View
            this.setDurationView();

            // set LastMetro view
            this.setLastMetroView();

            // set timer view
            this.setTimerView();

            // set alarm view
            this.setAlarmView();

        },

        render: function() {

            this.$el.html(this.template());

        },

        latlngLocationReady: function() {

            if(this.model.get('latlngLocationReady')) {

                this.setMapView();
            }

        },

        setMapView: function() {

            app.views.map = new Map.view({
                el      : '#map',
                model   : this.model
            });

        },

        setAddressView: function() {

            // set address view
            app.views.address = new Address.view({
                el      : '#address',
                model   : this.model
            });

        },

        setStationView: function() {

            // set station view
            app.views.station = new Stations.view({
                el      : '#station',
                model   : this.model
            });

        },

        setDurationView: function() {

            // set duration view
            app.views.duration = new Duration.view({
                el      : '#walk',
                model   : this.model
            });

        },

        setLastMetroView: function() {

            // set duration view
            app.views.lastMetro = new LastMetro.view({
                el      : '#last',
                model   : this.model
            });

        },

        setTimerView: function() {

            // set timer view
            app.views.timer = new Timer.view({
                el      : '#time',
                model   : this.model
            });

        },

        setAlarmView: function() {

            // set alarm view
            app.views.alarm = new Alarm.view({
                el      : '#link',
                model   : this.model
            });

        }

    });

    return Index;

});
