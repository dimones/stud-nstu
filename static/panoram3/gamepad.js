var XGamePad = function (deadZone) {

    var gamepad = undefined;

    window.addEventListener("gamepadconnected", function (e) {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);

        gamepad = e.gamepad;
    });

    window.addEventListener("gamepaddisconnected", function (e) {
        console.log("Gamepad disconnected from index %d: %s",
            e.gamepad.index, e.gamepad.id);
        gamepad = undefined;
    });

    this.getGamePad = function () {
      return gamepad;
    };

    var buttonPressed = function(b) {
        if (typeof(b) == "object") {
            return b.pressed;
        }
        return b == 1.0;
    };

    var buttonEvents = {};

    this.setButtonEvent = function(b, callback) {
        buttonEvents[b] = callback;
    };

    var axisEvents = {};

    this.setAxisEvent = function (n, x, y, mx, my, callback) {
        n = n * 2;
        axisEvents[n] = {conf:{x:x, y:y, mx:mx, my:my}, callback: callback};
    };

    var prevButton = undefined;
    var gameLoop = function() {
        requestAnimationFrame(gameLoop);

        var gp = gamepad;

        if (!gp) return;

        for (var a = 0; a < gp.axes.length; a += 2) {
            if (!axisEvents[a])
                continue;

            var event = axisEvents[a];

            var x = gp.axes[a + event.conf.x] * event.conf.mx;
            var y = gp.axes[a + event.conf.y] * event.conf.my;

            if (Math.abs(x) > deadZone || Math.abs(y) > deadZone) {
                event.callback(x, y);
                // console.log('gamePad.axes[%s]: %s %s', a, x, y);
            }
        }

        for (var b in gp.buttons) {
            var button = gp.buttons[b];

            if (!button.pressed && prevButton == b)
                prevButton = undefined;

            if (button.pressed)
                console.log('gamePad.button[%s].pressed', b);

            if (!buttonEvents[b])
                continue;

            if (button.pressed && prevButton != b) {
                prevButton = b;
                buttonEvents[b]();
                return;
            }

        }
    };

    gameLoop();
};

var xxx;

var GamePadPannellumControl = function (viewer) {
    var gamePad = new XGamePad(0.1);

    var axeSpeed = 0.8;
    var radius = 2;

    var selectedSpot = undefined;
    var selectedCss;
    var spotRunner = function() {

        scene = viewer.getConfig();
        spots = scene.hotSpots;

        var found = false;
        for (var s in spots) {
            var spot = spots[s];
            var d1 = Math.abs(spot.yaw - scene.yaw);
            var d2 = Math.abs(spot.pitch - scene.pitch);
            // console.log('spotRunner: d: '+d);
            if (d1 < radius && d2 < radius) {
                if (selectedSpot && selectedSpot.yaw == spot.yaw && selectedSpot.pitch == spot.pitch)
                    return;

                // console.log('spotRunner: found: '+spot.text);

                if (selectedSpot && selectedSpot.div) {
                    selectedSpot.div.firstChild.style.removeProperty('visibility');
                    $(selectedSpot.div).removeClass('hover');
                }

                found = true;
                spot.div.firstChild.style.visibility = 'visible';
                selectedCss = spot.cssClass;
                $(spot.div).addClass('hover');
                selectedSpot = spot;
                xxx = spot;
                break;
            }
        }

        if (!found) {
            if (selectedSpot && !selectedSpot.div)
                selectedSpot = undefined;
            if (selectedSpot) {
                selectedSpot.div.firstChild.style.removeProperty('visibility');
                $(selectedSpot.div).removeClass('hover');
            }
            selectedSpot = undefined;
        }
    };

    var handlerAxes = function (x, y) {
        var yaw = viewer.getYaw() + axeSpeed * x;
        var pitch = viewer.getPitch() + axeSpeed * y;
        viewer.setYaw(yaw, 0);
        viewer.setPitch(pitch, 0);

        // spotRunner();

        // console.log('GamePadPannellumControl: yaw: %s | pitch: %s', yaw, pitch);
    };

    gamePad.setAxisEvent(0, 0, 1, 1, -1, handlerAxes);
    gamePad.setAxisEvent(1, 0, 1, 1, -1, handlerAxes);


    setInterval(spotRunner, 50);

    // var getElementCenter = function() {
    //     var container = $('#panorama')[0];
    //     var x = Math.round(container.offsetLeft + container.clientWidth / 2);
    //     var y = Math.round(container.offsetTop + container.clientHeight / 2);
    //     var spot = document.elementFromPoint(x, y);
    //     return spot ? spot : undefined;
    // };
    //
    // var watchedSpot;
    // var watcher = function() {
    //     requestAnimationFrame(watcher);
    //
    //     var spot = $(getElementCenter().firstChild);
    //     if (!spot && watchedSpot) {
    //         watchedSpot.css('visibility', 'hidded');
    //         watchedSpot = undefined;
    //         console.log('watcher: hidded');
    //         return;
    //     }
    //     // if (watchedSpot && watchedSpot.yaw == spot.yaw && watchedSpot.pitch == spot.pitch)
    //     //     return;
    //     // if (watchedSpot)
    //     //     watchedSpot.css('visibility', 'hidded');
    //     spot.attr('watched',true);
    //     watchedSpot = spot;
    //     spot.css('visibility', 'visible');
    //
    //     console.log('watcher: visible');
    //
    //     xxx = spot;
    // };

    // setInterval(watcher, 100);

    // watcher();

    gamePad.setButtonEvent(14, function () {
        // var spot = getElementCenter();
        if (selectedSpot && selectedSpot.hasOwnProperty('picked'))
            selectedSpot.div.onclick = studFound.bind(selectedSpot);

        if (selectedSpot) {
            prevScene = pannellumViewer.getConfig().scene;
            selectedSpot.div.onclick();
            if (!selectedSpot.hasOwnProperty('picked'))
                console.log('load scene: '+selectedSpot.sceneId);
        }
    });

    var prevScene;
    gamePad.setButtonEvent(12, function () {
        if (prevScene)
            pannellumViewer.loadScene(prevScene);
        prevScene = undefined;
    });

    this.getGamePad = function () {
        return gamePad.getGamePad();
    };


    gamePad.setButtonEvent(0, switchAutoRotate);
};

var gamePadPannellumControl = new GamePadPannellumControl(pannellumViewer);