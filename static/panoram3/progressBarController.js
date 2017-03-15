var ProgressBarController = function () {
  var container = $('#x-progress-bar');
    var line = $('#x-progress-bar-line');
    var label = $('#x-progress-bar-label');
    var status = $('#x-progress-bar-status');

    status.html('');

    var max = 100;
    var progress = 0;

    this.setProgress = function(p, st) {
        var perc = (p / max * 100).toFixed(2)+'%';
        label.html(perc);
        line.css('width', perc);

        if (st)
            status.html(st);

        progress = p;
    };

    this.setProgress(0, '');

    this.getProgress = function () {
        return progress;
    };

    this.getMax = function () {
        return max;
    };

    this.setMax = function(m) {
        if (m < 1)
            throw 'max must bo more 0';

        max = m;
    };

    this.hide = function () {
        container.hide();
    };

    this.show  = function () {
        container.show();
    };

    this.setCenter = function() {
        container.addClass('x-progress-bar-center');
    };

    this.setHeightContainer = function(h) {
        container.removeClass('x-progress-bar-center');
        container.css('height', h);
    };
};