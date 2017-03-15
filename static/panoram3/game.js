progressBarController.setHeightContainer('50px');

var gameSetProgress = function(p) {
    progressBarController.setProgress(p, 'Найдено '+p+' из '+progressBarController.getMax()+' зачеток');
};

var studFound = function () {
    $(this.div).hide();
    gameSetProgress(progressBarController.getProgress() + 1);
    this.cssClass = 'x-hide';

    if (progressBarController.getProgress() == progressBarController.getMax()) {
        alert('УРАА! Ты нашел все зачетки!');
        progressBarController.hide();
    }

    console.log(this);
};

var studExtend = {
    type: 'info',
    cssClass: 'x-stud',
    text: 'Зачеточка!',
    picked: false,
    clickHandlerFunc: studFound
};

var studs = {
    '7-2-hall-2': [
        {
            pitch: -8.05,
            yaw: 66.18
        }
    ]
    ,
    '7-320': [
        {
            pitch: -24.23,
            yaw: 160.84
        }
    ]
    ,
    '7-3-hall': [
        {
            pitch: -88.18,
            yaw: -153.1
        }
    ]
    ,
    '7-3-small': [
        {
            pitch: -23.81,
            yaw: 156.75
        }
    ]
    ,
    '7-7-hall': [
        {
            pitch: -25,
            yaw: -64.34
        }
    ]    ,
    '7-7-big': [
        {
            pitch: 5.5,
            yaw: 115.34
        }
    ]
    ,
    '7-8-hall': [
        {
            pitch: -4.6,
            yaw: 7
        }
    ]
    ,
    '7-8-big': [
        {
            pitch: 31.22,
            yaw: 143.53
        }
    ]
};

var studCount = 0;

for (var s in studs) {
    var arr = studs[s];

    for (var a in arr) {
        var stud = arr[a];

        $.extend(stud, studExtend);

        PannellumConfig.scenes[s].hotSpots.push(stud);

        studCount += 1;
    }
}

progressBarController.setMax(studCount);
gameSetProgress(0);