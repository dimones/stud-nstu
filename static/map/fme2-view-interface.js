'use strict';
var room_blink = {id: undefined, status: false, mesh: undefined, prev_color: undefined};

function room_clear_blink()
{
	if (room_blink.id == void 0)
		return;
	clearInterval(room_blink.id);
	if (room_blink.status)
		if (schedule_prm.enabled)
			schedule_changed_level();
	room_blink.id = undefined;
	room_blink.status = false;
	var mesh = room_blink.mesh;
	if (mesh != void 0)
	{
		mesh.material.color.setHex(room_blink.prev_color);
		select_shape_view(mesh, false);
	}
	//mesh.material.opacity = 0;
	//setInterval(function(){mesh.material.opacity = 0;}, 1100);
}
function room_blinker()
{
	var status = room_blink.status;
	if (room_blink.mesh != void 0)
	{
		room_blink.mesh.material.color.setHex(opt.selected_color);
		if (status)
			select_shape_view(room_blink.mesh, true);
			//room_blink.mesh.material.opacity = opt.selected_opacity;
		else
			select_shape_view(room_blink.mesh, false);
			//room_blink.mesh.material.opacity = 0;
	}
	room_blink.status = !status;
}
function blink_room_id(room_id)
{
	var box = assign_surfroom[room_id];
	if (box == void 0) return;
	box = box.scene_shape;
	room_blink.mesh = box;
	room_blink.prev_color = box.material.color.getHex();
	room_blink.status = true;
	room_blink.id = setInterval(room_blinker, 1000);

	controls.target = box.position.clone();
	controls.update();
}
function blink_room(name, no_blink)
{
	if (name == void 0)
		return;
	room_clear_blink();
	//server_address = '0.0.0.0:5001/'
	$.post(server_address + "getRoomByName", {'name': name})
	.done(function (dat) {
		var data_a = JSON.parse(dat);
		if (data_a.error != undefined)
		{
			console.error('getRoomByName failed '+name+' [server]: ' + data_a.error);
			alert(data_a.error);
			select_build(current_build_id, load_level, [current_build_id, 1]);
			return;
		}
		data_a = data_a[0];
		select_build(data_a.BUILD, 
			function(level_id, room_id)
			{
				load_level(current_build_id, level_id);
				if (no_blink != true)
					blink_room_id(room_id);
			},[data_a.FLOOR, data_a.ID]);
	})
	.fail(function (dat) {
		console.error('getRoomByName failed '+name+':\n' + dat);
	});
}
var search_room_visible = false;

function onSearchRoomSwitch()
{
	if (search_room_visible)
	{
		$('#search_room').hide();
		$('#search_room_btn').css('background', '#EEEEEE'); 
		search_room_visible = false;

		navi.enable = true;
		naviModeSwitch();
	}
	else
	{
		$('#search_room').show();
		$('#search_room_name').focus();
		$('#search_room_btn').css('background', '#009688'); 
		search_room_visible = true;
	}
}
function setSearchRoomBuild(b)
{
	X.GEBI('search_room_build').innerHTML = b;
}
function onSearchRoom()
{
	//var room = X.PROCONF('promt','Полный номер аудитории (напр. 7-203а)\n[Тестовый режим]');
	var room = X.GEBI('search_room_build').innerHTML;
	var name = X.GEBI('search_room_name').value;
	if (name == '')
	{
		select_build(room, load_level, [room, '1']);
		return;
	}

	room = room + '-' + name;
	if (room != '-')
		blink_room(room);
}
function select_build(build_id, callback, callback_args)
{
	if (data.builds == void 0 || data.builds[build_id] == void 0)
	{
		$.post(server_address + "getRoomsOfBuild",
			{'b': build_id})
		.done(function (dat) {
			var data_rooms = JSON.parse(dat);
			if (data_rooms.error != undefined)
			{
				console.error('Load rooms failed of build ' + build_id + '[server]: ' + data_rooms.error);
				return;
			}
			rooms[build_id] = {};
			for (var i in data_rooms)
			{
				var room = data_rooms[i];
				rooms[build_id][room.ID] = room;
			}

			var type = build_id * 10;
			$.post(server_address + "admin/getMapEditorData", {'type': type})
			.done(function (dat) {
				var data_b = JSON.parse(dat)['data'];
				
				data.builds[build_id] = data_b;

				current_build_id = build_id;
				load_level_selector(build_id);
				//load_level(build_id, 1);
				if (callback != void 0)
					callback.apply(this, callback_args);
			})
			.fail(function (dat) {
				console.timeEnd('Load ' + type);
				console.error('Data load failed ['+type+']:\n' + dat);
			});
		})
		.fail(function (dat) {
			console.error('Load rooms failed of build ' + build_id);
		});
	}
	else
	{
		current_build_id = build_id;
		load_level_selector(build_id);
		// load_level(build_id, 1);

		if (callback != void 0)
		 	callback.apply(this, callback_args);
		//console.error("Build not found " + build_id)
	}
}
var selectors_visible = false;

function level_selectors_switch()
{
	if (selectors_visible)
	{
		$('#build_selector').show();
		$('#level_selector').show();
		$('#level_selectors_btn').css('background', '#009688'); 
		selectors_visible = false;
	}
	else
	{
		$('#build_selector').hide();
		$('#level_selector').hide();
		$('#level_selectors_btn').css('background', '#EEEEEE'); 
		selectors_visible = true;
	}
}
function load_level_selector(build_id)
{
	var lids = X.GET_VALUES_OF_KEYS_IN_DIC(data.builds[build_id], 'level_id');
	lids.reverse();
	var container = document.getElementById('level_selector');
	container.innerHTML = '';
	for (var k in lids)
	{
		var html = '<button type="button" class="btn btn-toolbar btn-raised btn-sm" id="'+lids[k]
		+'" onclick="load_level(current_build_id, this.id);" style="width: 40px; padding-left: 0px;">'
		+'<span style="margin-left: 18px;"">'+lids[k]+'</span></button>';
		container.innerHTML += html;
	}
}
function load_build_selector(bids)
{
	bids.reverse();
	var container = document.getElementById('build_selector');
	container.innerHTML = '';
	for (var k in bids)
	{
		var html = '<button type="button" class="btn btn-toolbar btn-raised btn-sm" id="'+bids[k]
		+'" onclick="select_build(this.id);" style="width: 40px; padding-left: 0px;">'
		+'<span style="margin-left: 18px;"">'+bids[k]+'</span></button>';
		container.innerHTML += html;
	}
}
function camera_targeting()
{
	//CAMERA TARGETING
	var intersect = rayGetIntersects({offsetX: render_width() / 2, offsetY: render_height() / 2},[background])[0];
	if (intersect != void 0)
	{
		controls.target.copy(intersect.point);
		controls.target0 = controls.target.clone();
		controls.position0 = camera.position.clone();
		controls.zoom0 = camera.zoom;
	}
	else
		controls.reset();
}
//ON EVER CAMERA UPDATE FROM CONTROLS
function look_at_me()
{
	//LOOK AT ME TEXTS
	var v = new THREE.Vector3(0,0,1);
	v.applyQuaternion(camera.quaternion);
	//camera.quaternion.multiplyVector3(v);
	//var look = v.clone();
	//v.setY(0);
	var meshs = room_obj3d[level_blid(current_level)];
	for (var r in meshs)
	{
		var to = meshs[r].position.clone();
		to = to.add(v);
		meshs[r].lookAt(to);
	}
}
var mouseoff = {};

function on_mouse_down(event)
{
	mouseoff.offsetX = event.offsetX;
	mouseoff.offsetY = event.offsetY;
}
function on_mouse_up(event)
{
	if (Math.abs(mouseoff.offsetX - event.offsetX) <= opt.mouse_click_range && Math.abs(mouseoff.offsetY - event.offsetY) <= opt.mouse_click_range)
		on_click(event);
}
//SELECTERS SHAPE
function select_shape_view(shape, to)
{
	shape.visible = to;
}
var selected_shape = undefined;

function clear_selected_shape()
{
	if (selected_shape != void 0)
	{
		selected_shape.material.color.setHex(selected_shape.userData.prev_shape_color);
		if (selected_shape.userData.busy != true)
			select_shape_view(selected_shape, false);
			//selected_shape.material.opacity = 0;
		selected_shape = undefined;
	}
}
function on_click(event)
{
	var intersect = rayGetIntersects(event,scene.children);
	if (intersect.length == 0) return;
	intersect = intersect[0];

	clear_selected_shape();

	if (intersect.object.userData.type == 'surface' || intersect.object.userData.type == 'shape')
	{
		if (intersect.object.userData.type == 'surface')
			selected_shape = intersect.object.userData.surface.scene_shape;
		else
			selected_shape = intersect.object;

		if (selected_shape != void 0 && selected_shape.userData.surface.room_id != void 0)
		{
			room_clear_blink();
			selected_shape.userData.prev_shape_color = selected_shape.material.color.getHex();
			selected_shape.material.color.setHex(opt.selected_color);
			//selected_shape.material.opacity = opt.selected_opacity;
			select_shape_view(selected_shape, true);

			show_clicked_room_schedule(selected_shape.userData.surface.room);
		}
	}
}