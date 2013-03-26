define([
    // Application.
    'app',
    'jquery',
    'lodash',
    'backbone',
    'text!templates/alarm.html',
    'icalendar'

],function(app, $, _, Backbone, alarmTemplate) {

    var Alarm = {};

    /**
     * backbone view
     */
    Alarm.view = Backbone.View.extend({

        template: _.template(alarmTemplate),

        events: {
            'click #link a': 'calendarClick'
        },

        initialize: function() {

            this.model.on('change:targetTimeReady', this.targetTimeChange, this);

        },

        targetTimeChange: function() {

            if(this.model.get('targetTimeReady')) {

                this.render();

            } else {

                this.empty();

            }

        },

        render: function() {

            this.$el.html(this.template(this.model.toJSON()));

            this.bindCalendar();

        },

        empty: function() {

            if(this.model.get('iCal'))
                this.model.get('iCal').icalendar('destroy');

            this.$el.empty();

        },

        bindCalendar: function() {

            // resources : https://github.com/kewisch/ical.js
            // resources : http://keith-wood.name/icalendar.html

            // get current date
            var today           = new Date();
            // get target h & m
            var endHM           = this.model.get('station').directions[this.model.get('defaultWay')].time;

            // get delta
            /*var startHM         = targetTime;
            console.log('startHM', startHM);*/

            var title           = 'Dernier métro !';

            var description     = 'Partez maintenant pour attraper le dernier métro';
            var location        = this.model.get('station').title;

            // set end date
            var endDate;
            var curH = today.getHours();
            var curM = today.getMinutes();
            if(((endHM.h < curH)) || ((curH == endHM.h) && (endHM.m < curM))) {
                // jour + 1
                endDate = new Date(today.getTime() + 86400000);
            } else {
                // jour
                endDate = today;
            }
            // set h & m
            endDate.setHours(endHM.h);
            endDate.setMinutes(endHM.m);

            // set start date
            var delta = (this.model.get('duration').delta + this.model.get('duration').securityDelay) * 60 * 1000;
            var startDate = new Date(endDate.getTime() - delta);

            // set iCalendar event
            var event = {
                start       : startDate,
                end         : endDate,
                title       : title,
                summary     : title,
                description : description,
                location    : location,
                icons       : 'img/icalendar.png',
                sites       : ['icalendar'],
                //sites       : ['google'],
                compact     : false,
                echoUrl     : 'iCalendar.php'
            };

            $.icalendar.setDefaults(event);

            this.model.set({
                iCal : $('#basicICal').icalendar(event)
            });

            //console.log(this.model.get('iCal').icalendar(''));

        },

        calendarClick: function(e) {
            e.preventDefault();

            $('#basicICal a:first').click();

        }

    });

    return Alarm;

});
