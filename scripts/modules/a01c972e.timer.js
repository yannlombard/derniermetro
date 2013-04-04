define([
    // Application.
    'app',
    'jquery',
    'lodash',
    'backbone',
    'text!templates/timer.html'

],function(app, $, _, Backbone, timerTemplate) {

    var Timer = {};

    /**
     * backbone view
     */
    Timer.view = Backbone.View.extend({

        template: _.template(timerTemplate),

        initialize: function() {

            this.model.on('change:targetTimeReady', this.updateTime, this);

        },

        updateTime: function() {
            if(this.model.get('targetTimeReady')) {
                this.render();
            }
        },

        render: function() {

            this.$el.html(this.template(this.model.toJSON()));

        }

    });

    return Timer;

});
