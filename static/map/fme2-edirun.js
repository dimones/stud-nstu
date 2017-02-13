var editor;
var render_containder = X.GEBI('render_container');
var colors_elements_ids = {};

var selected_build_id;
var selected_level_id;
var node_mode;
//var door_mode_visible = true;

var data_main = null;
var source_rooms = {};
var rooms = {};
var current_type = 0;
var data_type_key;

$.snackbar_x = $.snackbar;
$.snackbar = function (args)
{
	var s = $.snackbar_x(args);
	setTimeout(function () {s.replaceWith('');},args.timeout);
};

$(window).load(function() {
	//$('footer').replaceWith('');
	$('#snackbar-container').css('z-index','5');
	data_type_key = 'main';
	var type = 0;
	if (X.GET_URL_PARAMETER('backup'))
	{
		data_type_key = 'backup';
		type = 1;
		current_type = 1;
	}
	document.title = 'FME2 EDITOR [' + (String(data_type_key)).toUpperCase() + ']';
	db_loadinit(type, undefined);
});

function SLENDER(data,font)
{
	selected_build_id = undefined;
	selected_level_id = undefined;
	node_mode = {
		bid: 1,
		line_count: 1,
		with_save: false,
		M1M: true,
		MM1: false
	};

	editor = new FME2_EDITOR(
		render_containder, data,{camera_center_x: 900, camera_center_y: 700}, font,
		{get_func:X.BIND(function(){return rooms;},this),idkey:'ID',namekey:'NUM',surfkey:'SURFACE_ID'}, 
		X.GET_URL_PARAMETER('fps'),X.GET_URL_PARAMETER('dod'));

	editor.naviInit();

	loadColors('selected_color_wall', 'wall_color_dropdown_menu', editor.Enums.STR.WALL);
	loadColors('selected_color_surface', 'surface_color_dropdown_menu', editor.Enums.STR.SURFACE);
	loadIconSelecter();

	if (data != null || data != void 0)
		reload_level_selecters(data.build_ids, data.build_id, data.level_id);

	//editor.addRenderEventListener("mousemove", onMouseMove);
	editor.onRenderResize = function (w, h)
	{
		$.extend(X.GEBI('editor_container').style, {width: w + "px", height: h + "px"});
	};
	editor.onWindowResize();
	editor.showErrorFunction = showError;
	editor.updateInfoFunction = upDateInfo;
	editor.offsetLeft = function(){return 10;};
	editor.offsetTop = function(){return 10;};
	editor.onWindowResize();
	editor.addOnClick(onRoomClick);

	$(window).keyup(onKeyUp);
	$(window).keydown(onKeyDown);
	cnslBindEvents();

	editor.disableMultiselectClicker();

	editor.animate();

	node_mode_opps();
	room_mode_source();
}



//EVENTS
function upDateInfo(info)
{
	X.GEBI('mouse_meter_coord').innerHTML = 
	info.mouse_position_meter.x + 'x' + info.mouse_position_meter.y + 'm';
	X.GEBI('info').innerHTML = info.hint;
}


//function set_opp_selected_btn(id){$('#' + id).addClass('btn-primary');}

function onKeyUp(client_event)
{
	var remove_selected_rooms = function ()
	{
		var rooms = editor.removeSelectedRooms('SURFACE_ID');

		if (rooms.length != 0)
		{
			var frr = function (i)
			{
				if (rooms[i] == void 0) return;
				db_update_room(room[i],
					function ()
					{
						rooms[room[i].ID] = room[i];
						frr(i+1);
					});
			};
		}
	};
	//console.log(client_event.keyCode);
	if (client_event.keyCode == 46)//DELETE
	{
		if (enabled_mode.node)
			editor.removeSelectedNodes();
		if (enabled_mode.wall)
			editor.removeSelectedWalls();
		if (enabled_mode.surface)
		{
			remove_selected_rooms();
			editor.removeSelectedSurfaces();
		}
		if (enabled_mode.door)
			editor.removeSelectedDoors();
		if (enabled_mode.room)
			remove_selected_rooms();
		if (enabled_mode.navi.remove)
			editor.removeSelectedNavi();
		if (enabled_mode.navi.node)
			editor.removeSelectedNaviNodes();
		if (enabled_mode.navi.line)
			editor.removeSelectedNaviLines();
	}
	if (client_event.keyCode == 17)//CTRL
		editor.disableMultiselectClicker();
	if (client_event.keyCode == 13)//ENTER
		cheat_surfaces();
}
function onKeyDown(client_event)
{
	if (client_event.keyCode == 17)//CTRL
		editor.enableMultiselectClicker();
}

//EVENTS SAVE
function onSaveData(key){allSaveData(editor.updateData(), key == 'main' ? 0 : 1);}

function allSaveData(data, type)
{
	var builds = data.builds;
	delete data.builds;
	var bdids = [];
	for (var b in builds)
		bdids.push(b);

	saveData(data.primary, type, 
		function()
		{
			savaDataBuildEx(builds, bdids, 0, type);
		},[]);

}

// function savePrimaryData(type, callback, callback_args)
// {
// 	editor.updatePrimaryData();
// 	saveData(editor.data, type, callback, callback_args);
// }

function savaDataBuildEx(builds, bdids, bidn, type)
{
	if (bidn < bdids.length)
		saveDataBuild(builds,bdids[bidn],type,savaDataBuildEx,[builds,bdids,bidn+1,type]);
}

function saveDataBuild(builds, build_id, type, callback, callback_args)
{
	type = bt(build_id,type);

	saveData(builds[build_id], type, callback, callback_args);
}

function saveData(data, type, callback, callback_args)
{
	if (data == void 0)
	{
		callback.apply(this, callback_args);
		return;
	}
	var mes;

	console.time('Save data '+type);
	$.post(server_address + "admin/setMapEditorData",
		{ 	'device_id': Cookies.get('device_id'),
		'device_token': Cookies.get('device_token'),
		'type': type,'data':JSON.stringify(data)})
	.done(function (dat) {
		console.timeEnd('Save data '+type);
		mes = 'Data saved '+type + ': '+dat;
		console.log(mes);
		$.snackbar({content: mes, style: 'toast', timeout: 3000});

		if (callback != void 0)
			callback.apply(this, callback_args);
	})
	.fail(function (dat) {
		console.timeEnd('Save data '+type);
		mes = 'Data save failed ['+type+']:\n' + dat + '\n stringify: ' + JSON.stringify(dat);
		console.error(mes);
		$.snackbar({content: mes, style: 'toast', timeout: 3000});
	});
}

//LOADS
function onLoadBackup()
{
	window.location.href = '/admin/map_editor?backup';
}

function onLoadMain()
{
	window.location.href = '/admin/map_editor';
}

//CONSOLE
var cnsl = {commands: [], coomind: undefined};

function cnslBindEvents()
{
	var con = $('#console_input');
	con.keyup(function (event)
	{
		if (event.keyCode == 13)
			cnslExecute();
		if (event.keyCode == 91)
			cnslCommandMove(1);
		if (event.keyCode == 17)
			cnslCommandMove(-1);
	});
}

function cnslCommandMove(to)
{
	if (cnsl.coomind == void 0)
		cnsl.coomind = cnsl.commands.length;
	cnsl.coomind+=to;
	if (cnsl.coomind < 0)
		cnsl.coomind = 0;
	var comm;
	if (cnsl.coomind >= cnsl.commands.length)
	{
		cnsl.coomind = cnsl.commands.length;
		comm = '';
	}
	else
		comm = cnsl.commands[cnsl.coomind];

	if (comm == void 0)
	{
		cnslCommandMoveReset();
		return;
	}
	X.GEBI('console_input').value = comm;
}

function cnslCommandMoveReset()
{
	cnsl.coomind = undefined;
}

function cnslExecute()
{
	var comm = X.GEBI('console_input').value;
	var ret;
	try
	{
		ret = JSON.stringify(eval(comm));
		cnsl.commands.push(comm);
	}
	catch(err)
	{
		ret = err.message;
	}

	var textarea = X.GEBI('console_text_area');
	textarea.value+=ret+'\n';
	textarea.scrollTop = textarea.scrollHeight;
}

function showConsole()
{
	cnsl = {commands: [], coomind: undefined};
	X.GEBI('console_input').value = '';
	X.GEBI('console_text_area').value = '';
	$('#modal_console').modal('show');
}

//EVENTS ERROR
function showError(title, message)
{
	$('#message_title').html(title);
	//$('#message_body').html(vader);
	X.GEBI('message_body').innerText = message;
	$('#modal_message').modal('show');
}