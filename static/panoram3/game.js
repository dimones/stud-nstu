progressBarController.setHeightContainer('50px');

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
    ,
    '7-2-hall': [
        {
            pitch: -11,
            yaw: -18
        }
    ]
    ,
    '7-2-218': [
        {
            pitch: -20.5,
            yaw: -6.5
        }
    ]
    ,
    '7-2-213': [
        {
            pitch: -61,
            yaw: 17
        }
    ]
    ,
    '7-2-3': [
        {
            pitch: -29,
            yaw: -7
        }
    ]
    ,
    '7-303': [
        {
            pitch: -20.7,
            yaw: -46.8
        }
    ]
    ,
    '7-4-small': [
        {
            pitch: 22.50,
            yaw: 158.2
        }
    ]
    ,
    '7-602': [
        {
            pitch: -13.6,
            yaw: 98.3
        }
    ]
    ,
    '7-603': [
        {
            pitch: -61,
            yaw: 97
        }
    ]
    ,
    '7-7-small': [
        {
            pitch: 1.88,
            yaw: 9.54
        }
    ]
    ,
    '7-1-canteen': [
        {
            pitch: -2.7,
            yaw: -131.1
        }
    ]
    ,
    '7-106': [
        {
            pitch: -27.2,
            yaw: 97.2
        }
    ]
    ,
    '7-between': [
        {
            pitch: -22.6,
            yaw: -168
        }
    ]
    ,
    '7-2': [
        {
            pitch: 24.3,
            yaw: 142.5
        }
    ]
    ,
    '7-1': [
        {
            pitch: 24.8,
            yaw: -103.2
        }
    ]
    ,
    '7-4-hall': [
        {
            pitch: -22.6,
            yaw: 87.2
        }
    ]
    ,
    '7-5-hall': [
        {
            pitch: -17.23,
            yaw: 149.22
        }
    ]
    ,
    '7-609': [
        {
            pitch: -11.7,
            yaw: 175.4
        }
    ]
};

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

var gameInit = function () {
    var studCount = 0;

    var lastStudScene;
    for (var s in studs) {
        var arr = studs[s];
        for (var a in arr) {
            var stud = arr[a];

            $.extend(stud, studExtend);

            if (!PannellumConfig.scenes[s]) {
                console.log('game: scene ' + s + ' not found');
                continue;
            }

            lastStudScene = s;

            PannellumConfig.scenes[s].hotSpots.push(stud);

            studCount += 1;
        }
    }

    if (GetURLParameter('gameDebug')) {
        PannellumConfig.default.firstScene = lastStudScene;
    }

    progressBarController.setMax(studCount);
    gameSetProgress(0);
};

gameInit();