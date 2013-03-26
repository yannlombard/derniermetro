define([
    // Application.
    'app',
    'jquery',
    'lodash',
    'backbone',
    'text!templates/address.html'

],function(app, $, _, Backbone, addressTemplate) {

    var Address = {};

    /**
     * backbone view
     */
    Address.view = Backbone.View.extend({

        template: _.template(addressTemplate),

        events: {
            'click .refresh': 'refreshLocation'
        },

        initialize: function() {

            this.model.on('change:address', this.render, this);
        },

        render: function() {

            this.$el.html(this.template(this.model.toJSON()));

        },

        refreshLocation: function(e) {
            e.preventDefault();

            this.model.set({
                durationReady       : false,
                latlngLocationReady : false,
                latlngStationReady  : false,
                locationReady       : false,
                stationReady        : false,
                targetTimeReady     : false
            });

            this.model.getLocation();
        }

    });

    return Address;

});
