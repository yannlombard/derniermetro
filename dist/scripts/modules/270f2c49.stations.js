define([
    // Application.
    'app',
    'jquery',
    'lodash',
    'backbone',
    'text!templates/station.html',
    'text!json/stations.json'

],function(app, $, _, Backbone, stationTemplate, stationsJson) {

    var Stations = {};

    /**
     * backbone model
     */
    Stations.model = Backbone.Model.extend({

        defaults: {
            lat         : 0,// 45.745556,
            lng         : 0,// 4.871441,
            title       : '',// 'Monplaisir - Lumière',
            ligne       : '',// 'D',
            directions  : [
                {
                    title   : '',// 'Gare de Vénissieux',
                    time    : {
                        h: '',// '00',
                        m: ''// '20'
                    }
                }
            ]
        },

        initialize: function() {

        }

    });

    /**
     * backbone collection
     */
    Stations.collection = Backbone.Collection.extend({

        model : Stations.model,

        initialize: function() {

        },

        toRad: function(deg) {
            return deg * Math.PI / 180;
        },

        getNearestStation: function(lat, lng) {

            var nearest;
            var curL = -1;

            var R = 6371;

            var self = this;

            this.each(function(station) {


                // compute distance between the two points
                var dLat = self.toRad(station.lat - lat);
                var dLon = self.toRad(station.lng - lng);

                var dLat1 = self.toRad(lat);
                var dLat2 = self.toRad(station.lat);

                var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(dLat1) * Math.cos(dLat1) *
                        Math.sin(dLon/2) * Math.sin(dLon/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var d = R * c;

                if((curL == -1) || d < curL) {
                    curL = d;
                    nearest = station;
                }


            });

            return nearest;

        }
    });

    Stations.view = Backbone.View.extend({

        collection: new Stations.collection(JSON.parse(stationsJson).stations),

        template: _.template(stationTemplate),

        events: {
            'change #directions': 'changeDirection'
        },

        initialize: function() {

            this.model.on('change:locationReady', this.locationChange, this);

            this.model.on('change:stationReady', this.stationChange, this);

        },

        locationChange: function() {

            if(this.model.get('locationReady')) {

                // force change event
                this.model.set({
                    stationReady: false
                });

                // set nearest station data into main model
                this.model.set({

                    stationReady: true,

                    station: _.extend(this.model.get('station'),

                        this.collection.getNearestStation(

                            this.model.get('location').lat,
                            this.model.get('location').lng

                        ).toJSON()

                    )
                });

            }

        },

        stationChange: function() {

            if(this.model.get('stationReady')) {

                this.render();

            }

        },

        render: function() {

            this.$el.html(this.template(this.model.toJSON()));

        },

        changeDirection: function(e) {

            this.model.set({
                defaultWay      : e.currentTarget.value
            });

        }
    });

    return Stations;

});
