define([
    // Application.
    'app',
    'jquery',
    'lodash',
    'backbone'

],function(app, $, _, Backbone) {

    var Device = {};

    /**
     * backbone view
     */
    Device.model = Backbone.Model.extend({

        defaults: {

            type        : '', // type detected
            typeDefault : 'all', // default value

            types: [// known types
                {
                    index: 'iPhone',
                    value: 'iCalendar' // iCalendar, Google, Outlook
                },

                {
                    index: 'iPad',
                    value: 'iCalendar'
                },

                {
                    index: 'iPod',
                    value: 'iCalendar'
                },

                {

                    index: 'Android',
                    value: 'Google'
                },


                {
                    index: 'Windows Phone',
                    value: 'Outlook'
                },

                {
                    index: 'Windows NT 6.2',
                    value: 'Outlook'
                }


            ]

        },

        initialize: function() {

            // detect device
            this.detect();

        },

        // detect device
        detect: function () {

            var detectedType = this.get('typeDefault');

            _.each(this.get('types'), function(type) {

                if(navigator.userAgent.indexOf(type.index) > -1) {

                    detectedType = type.value;

                }

            });

            this.set({
                type: detectedType
            });

        }

    });

    // init device detection
    if(typeof(app.models.device) == 'undefined') {

        app.models.device = new Device.model();

    }

});
