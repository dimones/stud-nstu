var imageDirectory = '/static/panoram3/images/';
var extenstion = '.jpg';

for (var p in PannellumConfig.scenes) {
    var scene = PannellumConfig.scenes[p];
    scene.panorama = imageDirectory + p + extenstion;
}

if (GetURLParameter('debug'))
    PannellumConfig.default.hotSpotDebug = true;

PannellumConfig.default.firstScene = GetURLParameter('scene') || PannellumConfig.default.firstScene || '7-1-enter';

var pannellumViewer = pannellum.viewer('panorama', PannellumConfig);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var autoWalker = function () {
    var spots = pannellumViewer.getConfig().hotSpots;
    var spot = spots[getRandomInt(0, spots.length)];
    spot.div.onclick();
    setTimeout(pannellumViewer.startAutoRotate.bind(this, 10), 1500);
};

var autorotate = false;
var xtimer;
$('#autorotate').hide();
var switchAutoRotate = function () {
    autorotate = !autorotate;

    if (autorotate) {
        $('#autorotate').show();
        pannellumViewer.startAutoRotate(10);
        xtimer = setInterval(autoWalker, 15000);
    }
    else {
        $('#autorotate').hide();
        pannellumViewer.stopAutoRotate();
        var conf = pannellumViewer.getConfig();
        pannellumViewer.loadScene(conf.scene, conf.itch, conf.yaw);
        clearInterval(xtimer);
    }
};