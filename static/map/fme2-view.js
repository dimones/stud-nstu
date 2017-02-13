'use strict';
var container, stats, camera, scene, renderer, css_renderer;

var cam_factor = 1;
//var data = fme2data;

function render_width() { return window.innerWidth; }
function render_height() { return window.innerHeight - 50; }
var opt =
{
	level_offset_y: 0,
	surface_y: -5,
	wall_height: 50,
	wall_width: 10,
	node_hei: 1,
	//0.99
	door_top: 0.2,
	door_color: 0xBC7724,
	door_width: 0.1,
	text_size: 25,
	text_color: 0,
	text_h: 0.75,
	font: undefined,
	selected_opacity:1,
	//0.5,
	selected_color: 0xC83232,
	selected_schedule_color: 0x3DBDB4,
	selected_schedule_group_color: 0x5ABD3D,
	mouse_click_range: 10,
	navi_opacity: 0.7,
	navi_color: 0,
	navi_color_fly: 0xBB3ABA,
	navi_h: 0.25,
	navi_y: 0.68,
	navi_fly_timeout: 500,
	shape_height: 1
};

var loaded_levels = {};
var enabled_fps = false;
var rooms = {};
var data = undefined;
var raycaster = new THREE.Raycaster();

var current_build_id = parseInt(X.GET_URL_PARAMETER('b'));
var current_level = parseInt(X.GET_URL_PARAMETER('l'));

if (isNaN(current_build_id))
	current_build_id = 7;

if (isNaN(current_level))
	current_level = 1;

var bs = X.FULLHTML('#build_selector');
var ls = X.FULLHTML('#level_selector');
// var fps = X.FULLHTML('#fps');
$('#build_selector').replaceWith('');
$('#level_selector').replaceWith('');
// $('#fps').replaceWith('');
$('body').append(bs).append(ls);
// $('body').append(fps);

navi.enable = true;
naviModeSwitch();
level_selectors_switch();
$('#schedule_control').hide();
$('#search_room').hide();
X.GEBI('search_room_name').onkeypress = function (client_event)
{
	if (client_event.keyCode == 13)
		onSearchRoom();
};
$('#level_selectors_btn').click();

$.post(server_address + "admin/getMapEditorData",{'type': 0})
.done(function (dat) {

	data = JSON.parse(dat);
	if (data.error != void 0)
	{
		alert('Data load failed [server]: '+data.error);
		return;
	}
	data = data['data'];
	data.builds = {};

	load_build_selector(data.build_ids);

	//var loader = new THREE.FontLoader();
	//loader.load( '/static/mynstu/map/roboto_regular_ttf.json', 
	//	function (font) { opt.font = font; init();},
	//	undefined, function(e){console.error('Font load failed');});
	init();
})
.fail(function (dat) {
	console.error('Data load failed:\n' + dat);
});

var controls;

function init() 
{
	console.time('init');

	// container = document.createElement( 'div' );
	// document.body.appendChild(container);
	container = document.getElementById('view_container');

	camera = new THREE.OrthographicCamera( 
		-render_width() * cam_factor, 
		render_width() * cam_factor,
		render_height() * cam_factor,
		-render_height() * cam_factor, -2000, 100000 );
	camera.position.x = -2000;
	camera.position.y = 2000;
	camera.position.z = 2000;

	scene = undefined;

	//RENDERER
	//renderer = new THREE.CanvasRenderer();
	renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: false, preserveDrawingBuffer: true });
	renderer.setClearColor(0xffffff);
	//renderer.setClearColor(data.options.surface_color);
	//renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(render_width(), render_height());

	renderer.domElement.addEventListener('mouseup', camera_targeting, false );
	renderer.domElement.addEventListener('mousedown', on_mouse_down, false );
	renderer.domElement.addEventListener('mouseup', on_mouse_up, false );

	container.appendChild(renderer.domElement);

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	if (X.GET_URL_PARAMETER('unc') != true)
	{
		controls.maxPolarAngle = Math.PI * 0.4;
		controls.minZoom = 0.7;
		controls.maxZoom = 3;
	}
	//controls.x_update = controls.update;
	//controls.x_look_at_me = X.BIND(this.look_at_me, this);
	//controls.update = function(){ this.x_update(); this.x_look_at_me();};

	enabled_fps = false;

	stats = new Stats();
	stats.dom.style.position = 'absolute';
	stats.dom.style.marginLeft = '0px';
	stats.dom.style.marginTop = '0px';
	stats.dom.id = 'fps';
	stats.dom.style.display = 'none';
	container.appendChild(stats.dom);
	//document.body.appendChild(stats.dom);
	if (X.GET_URL_PARAMETER('fps'))
	{
		stats.dom.style.display = 'block';
		enabled_fps = true;
	}

	window.addEventListener('resize', onWindowResize, false);

	//load_level(current_build_id, 1);
	//load_level_selector(current_build_id);
	var selroom = X.GET_URL_PARAMETER('room');
	if (selroom == void 0)
		select_build(current_build_id, load_level,[current_build_id, current_level]);
	else
		blink_room(selroom);


	animate();

	console.timeEnd('init');
}

function onWindowResize() {

	camera.left = -render_width() * cam_factor;
	camera.right = render_width() * cam_factor;
	camera.top = render_height() * cam_factor;
	camera.bottom = -render_height() * cam_factor;

	camera.updateProjectionMatrix();

	renderer.setSize(render_width(), render_height());
	if (css_renderer != void 0)
		css_renderer.setSize(render_width(), render_height());
}
function animate()
{
	requestAnimationFrame(animate);
	if (scene != void 0)
	{
		renderer.render(scene, camera);
		if (css_renderer != void 0)
			css_renderer.render(scene, camera);
	}

	//if (enabled_fps)
	stats.update();
}
function fps_show()
{
	$('#fps').show();
}
function fps_hide()
{
	$('#fps').hide();
}
function rayGetIntersects(client_event, objects)
{
	if (client_event == void 0) return {length: 0};
	if (objects == void 0) return {length: 0};
	var x = client_event.offsetX;
	var y = client_event.offsetY;
	if (x < 0 || x > render_width() || y < 0 || y > render_height()) return {length: 0};
	y = render_height() - y;
	x = x / render_width() * 2 - 1;
	y = y / render_height() * 2 - 1;
	var ray_mouse = new THREE.Vector2(x, y);
	raycaster.setFromCamera(ray_mouse, camera);
	var intersects = raycaster.intersectObjects(objects);
	intersects = intersects || {length: 0};

	return intersects;
}