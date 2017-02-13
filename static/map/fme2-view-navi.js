'use strict';
var navi = {enable: false, mesh_level: {}, nodes: undefined, mesh_path: {}, from_room_id: undefined, to_room_id: undefined, to_room_name: undefined, from_room_name: undefined};

function naviModeSwitch()
{
	if (!navi.enable)
	{
		$('#navi').show();
		$('#navi_sets').show();
		$('#navi_btn').css('background', '#009688');

		navi.enable = true;
		navi_visibling_current();

		search_room_visible = false;
		onSearchRoomSwitch();
	}
	else
	{
		$('#navi').hide();
		$('#navi_sets').hide();
		$('#navi_btn').css('background', '#EEEEEE');

		navi.enable = false;
		navi_visibling_current();
	}
}

function onNaviSet(tofrom)
{
	var name = $('#search_room_name').val();
	var b = $('#search_room_build').html();

	var room = b + (name == "" ? "" : '-' + name);

	navi[tofrom+'_room_name'] = room;

	if (name == '')
		room = b + '-' + 'вход';
	$('#navi_set_'+tofrom).html(room);

	if (navi.to_room_name != void 0 && navi.from_room_name != void 0)
		onGetNavi(navi.from_room_name + '/' + navi.to_room_name);
}

function naviClearSets()
{
	navi.to_room_name = undefined;
	navi.from_room_name = undefined;
	$('#navi_set_to').html('');
	$('#navi_set_from').html('');
}

function onGetNavi(prms)
{
	//var prms = X.PROCONF('promt','Параметры навигации: X-NNN/X-NNN\nОткуда/Куда\nX - номер коруса, NNN - аудитория\nХ без NNN - вход в корпус Х\n[Тестовый режим]');
	if (prms != void 0)
	{
		var roomsp = String(prms).split('/');

		var room_id = {};

		var getid = function(name, n, callback, callback_arg)
		{
			var l = String(name).split('-').length;
			if (l == 1)
			{
				room_id[n] = 1000000 + parseInt(name);
				//^ X.ID21(1, parseInt(name));
				if (callback != void 0)
					callback.apply(callback_arg);
				return;
			}
			$.post(server_address + "getRoomByName", {'name': name})
			.done(function (dat)
			{
				var data_a = JSON.parse(dat);
				if (data_a.error != undefined)
				{
					console.error('getRoomByName failed '+name+' [server]: ' + data_a.error);
					alert(data_a.error);
					naviClearSets();
					return;
				}
				data_a = data_a[0];
				room_id[n] = data_a.ID;
				if (callback != void 0)
					callback.apply(callback_arg);
			})
			.fail(function (dat)
			{
				naviClearSets();
				console.error('getRoomByName failed '+name+':\n' + dat);
			});
		};

		var getnavi = function(fid, tid, callback, callback_arg)
		{
			$.post(server_address + "journey", {'from_room_id': fid, 'to_room_id': tid})
			.done(function (dat) {
				var data_a = JSON.parse(dat);
				if (data_a.error != undefined)
				{
					console.error('journey failed [server]: ' + data_a.error);
					alert(data_a.error);
					return;
				}
				navi.nodes = data_a.nodes;
				navi.path = data_a.path;
				for (var n in navi.nodes)
				{
					var p = navi.nodes[n].position;
					navi.nodes[n].position = new THREE.Vector3(p.x, p.y, p.z);
				}
				if (callback != void 0)
					callback.apply(callback_arg);
			})
			.fail(function (dat) {
				console.error('journey failed');
			});
		};

		getid(roomsp[0], 0, 
			function()
			{
				navi.from_room_id = room_id[0];
				getid(roomsp[1],1,
					function()
					{
						navi.to_room_id = room_id[1];
						getnavi(room_id[0], room_id[1], 
							function()
							{
								navi.enable = true;
								//draw_navi(current_level.build_id, current_level.level_id);
								if (room_id[0] < 1000000)
									blink_room(roomsp[0], true);
								else
									load_level(room_id[0] % 100, 1);
							});
					});
			}); 
	}
}

function navi_get_mesh_level(lvl)
{
	var blid = level_blid({build_id: lvl.build_id, level_id: lvl.level_id});
	var mesh_level = navi.mesh_level[blid];
	return {mesh_level: mesh_level, blid: blid};
}

function navi_visibling(lvl)
{
	var mesh_level = navi_get_mesh_level(lvl);

	if (mesh_level.mesh_level != void 0)
		mesh_level.mesh_level.visible = navi.enable;

	return {enable:navi.enable, mesh_level: mesh_level};
}

function navi_visibling_current()
{
	return navi_visibling(current_level);
}

function draw_navi(build_id, level_id)
{
	var ll = {build_id: build_id, level_id: level_id};
	var lll = navi_visibling(ll);
	if (!lll.enable)
		return;

	var mesh_level =lll.mesh_level.mesh_level;
	var blid = lll.mesh_level.blid;

	scene.remove(mesh_level);
	var id21 = X.ID21(navi.from_room_id, navi.to_room_id);
	id21 = X.ID21(id21, blid);
	var mesh_path = navi.mesh_path[id21];
	if (mesh_path != void 0)
	{
		//scene.add(mesh_path);
		//return;
	}

	//incorrent some union
	var group_mode = true;

	var material = new THREE.MeshBasicMaterial({color: opt.navi_color, transparent: true, opacity: opt.navi_opacity});
	var union_mesh;
	if (group_mode)
		union_mesh = new THREE.Object3D();

	var nodes = navi.nodes;
	if (nodes == void 0)
		return;
	var mergregeobsp = undefined;
	var p0 = new THREE.Vector3(1, 0, 0);

	for (var n in navi.path)
	{
		var nd = nodes[navi.path[n]];
		//if (nd.room_id != void 0)
		//	continue;
		if (nd.build != build_id || nd.level != level_id)
			continue;
		var p = nd.position;

		var navi_y = opt.wall_height * (opt.navi_y - 0.5);

		var mesh = new THREE.Mesh(new THREE.CylinderGeometry(opt.wall_width /2, opt.wall_width /2, opt.wall_height * opt.navi_h, 8), material);
		p.setY(navi_y);
		mesh.position.copy(p);

		if (group_mode)
			union_mesh.add(mesh);
		else
		{
			if (mergregeobsp == void 0)
				mergregeobsp = new ThreeBSP(mesh);
			else
			{
				var meshbsp = new ThreeBSP(mesh);
				mergregeobsp = mergregeobsp.union(meshbsp);
			}
		}
	}

	var fly = [];
	for (var n in navi.path)
	{
		n = parseInt(n);
		var nd1 = nodes[navi.path[n]];
		var nd2 = nodes[navi.path[n+1]];
		if (nd2 == void 0 || nd1 == void 0)
			continue;
		if (nd1.build != build_id || nd1.level != level_id)
			continue;
		if (nd2.build != build_id || nd2.level != level_id)
			continue;

		var p = nd1.position;

		var p2 = nd2.position;
		p2.setY(0);
		var p1 = p;

		var l = p1.distanceTo(p2);
		var a = p1.clone().sub(p2).angleTo(p0);
		if (p1.z > p2.z)
			a = Math.PI*2 - a;

		var pl = p1.clone().add(p2).divideScalar(2).setY(navi_y);

		var mesh_connect = new THREE.Mesh(new THREE.BoxGeometry(l, opt.wall_height * opt.navi_h, opt.wall_width), material.clone());
		mesh_connect.position.copy(pl);
		mesh_connect.rotation.set(0, a, 0);

		if (group_mode)
			union_mesh.add(mesh_connect);
		else
		{
			var meshbsp = new ThreeBSP(mesh_connect);
			mergregeobsp = mergregeobsp.union(meshbsp);
		}

		fly.push(mesh_connect);
	}

	if (!group_mode && mergregeobsp != void 0)
	{
		union_mesh = mergregeobsp.toMesh(material);
		union_mesh.geometry.computeVertexNormals();
	}

	if (union_mesh != void 0)
	{
		union_mesh.userData = 'navi_mesh';
		union_mesh.name = 'navi-'+navi.from_room_id+'-'+navi.to_room_id;
		navi.mesh_path[id21] = union_mesh;
		navi.mesh_level[blid] = union_mesh;
		scene.add(union_mesh);
	}

	navi_calc_levels();
	load_navi_selector();
	navi.fly = fly;
	navi_flyer_start();
}
function navi_flyer_start()
{
	for (var f in navi.fly)
		navi.fly[f].material.color.setHex(opt.navi_color);
	navi.fly_index = -1;
	clearInterval(navi.fly_id);
	navi.fly_id = setInterval(navi_flyer, opt.navi_fly_timeout);
}
function navi_flyer()
{
	if (navi.fly == void 0) return;
	var fly = navi.fly[navi.fly_index];
	if (fly != void 0)
		fly.material.color.setHex(opt.navi_color);
	navi.fly_index++;
	if (navi.fly_index >= navi.fly.length)
		navi.fly_index = -1;
	var fly = navi.fly[navi.fly_index];
	if (fly != void 0)
		fly.material.color.setHex(opt.navi_color_fly);
}
function navi_calc_levels()
{
	var levels = [];
	var c = 0;
	var pb = -1;
	var pl = -1;
	for (var p in navi.path)
	{
		//ЧТОББЫЛО
		var nid = parseInt(navi.path[p]);
		var l = nid % 100;
		nid = Math.floor(nid / 100);
		var b = nid % 100;

		if (pb != b || pl != l)
		{
			if (c > 1)
				levels.push({b:pb, l:pl});
			
			c = 0;
		}

		pl = l;
		pb = b;
		c++;
	}
	if (c > 1 && levels.length > 0)
		levels.push({b:pb, l:pl});
	navi.levels = levels;
	return levels;
}
function load_navi_selector()
{
	$('#navi_selecter').html('');
	var html = '';
	for (var l in navi.levels)
	{
		var ll = navi.levels[l];
		var h = '<button type="button" class="btn btn-raised btn-sm btn-default" onclick="load_level(' + ll.b + ', ' + ll.l + ');">'
				+ 'Корпус ' + ll.b + ' : Этаж ' + ll.l + ' <i class="material-icons">arrow_downward</i></button>';
		if (l == navi.levels.length - 1)
			h = h.replace('arrow_downward','close');
		html += h;
	}
	$('#navi_selecter').html(html);
}