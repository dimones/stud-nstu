var imageDirectory = '/static/panoram3/images/';
var extenstion = '.jpg';

for (var p in PannellumConfig.scenes) {
    var scene = PannellumConfig.scenes[p];
    scene.panorama = imageDirectory + p + extenstion;
}

if (GetURLParameter('debug'))
    PannellumConfig.default.hotSpotDebug = true;

PannellumConfig.default.firstScene = GetURLParameter('scene') || '7-1-enter';

var pannellumViewer = pannellum.viewer('panorama', PannellumConfig);

