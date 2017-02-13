function bt(bid,type)
{
	return bid*10+type;
}

function db_loadinit(type,font)
{
	db_load_data(type,function(data_a)
	{
		data_main = data_a;
		//db_load_data(bt(data_a.build_id,type),function(data_b)
		//{
			//data_main.buidls[data_main.build_id] = data_b;
			SLENDER(data_main,font);
		//},[]);
	},[]);
}

function db_load_data(type, callback, callback_args)
{
	console.time('Load ' + type);
	$.post(server_address + "admin/getMapEditorData",
		{ 	'device_id': Cookies.get('device_id'),
		'device_token': Cookies.get('device_token'),
		'type': type})
	.done(function (dat) {
		console.timeEnd('Load ' + type);
		var data = JSON.parse(dat)['data'];
		console.log('Load success: '+type);
		if (callback != void 0)
		{
			if (callback_args == void 0)
				callback_args = [];
			callback_args.push(data);
			callback.apply(this,callback_args);
		}
	})
	.fail(function (dat) {
		console.timeEnd('Load ' + type);
		console.error('Data load failed ['+type+']:\n' + dat);
	});

	if (navigator.platform == 'Win32')
		$.snackbar({content: 'On Shitdowns linewidth always 1!', style: 'toast', timeout: 10000});
	//$.snackbar({content: 'TEST MODE', style: 'toast', timeout: 10000});
}

function processing_source_rooms_of_build(data, b)
{
	for (var i in data)
	{
		var room = data[i];
		source_rooms[room.PK] = {
			ID: room.PK, BUILD: b, NUM: room.NUM, NAME: room.NAME,
			CAPACITY: parseInt(room.CAPACITY) >= 0 ? parseInt(room.CAPACITY) : null,
			MULTY: X.TFU(parseInt(room.IS_MULTIM),1,0), 
			STUDY: X.TFU(parseInt(room.NOT_STUDY),0,1),
			SURFACE_ID:null
		};
	}
	return source_rooms;
}

// function db_load_source_rooms_of_build(b, callback)
// {
// 	console.time('Load source rooms of build '+b);
// 	$.post(server_address + "getSourceRoomsOfBuild",
// 		{'b': b})
// 	.done(function (dat) {
// 		console.timeEnd('Load source rooms of build '+b);
// 		console.time('Data source rooms convert');

// 		var data = JSON.parse(dat);
// 		if (data.error != undefined)
// 		{
// 			console.timeEnd('Data source rooms convert');
// 			console.error('Load source rooms failed of build ' + b + '[server]: ' + data.error);
// 			return;
// 		}
// 		processing_source_rooms_of_build(data);

// 		console.timeEnd('Data source rooms convert');
// 		console.log('Load source rooms success of build ' + b);

// 		if (callback != void 0)
// 			callback();
// 		})
// 	.fail(function (dat) {
// 		console.timeEnd('Load source rooms of build '+b);
// 		console.error('Load source rooms failed of build ' + b);
// 	});
// }

function processing_rooms_of_build(data)
{
	for (var i in data)
	{
		var room = data[i];
		rooms[room.ID] = room;
	}
	return rooms;
}

// function db_load_rooms_of_build(b, callback)
// {
// 	$('#room_mode_btn').css('background', '#EE0000');

// 	console.time('Load rooms of build '+b);
// 	$.post(server_address + "getRoomsOfBuild",
// 		{'b': b})
// 	.done(function (dat) {
// 		console.timeEnd('Load rooms of build '+b);
// 		console.time('Data rooms convert');
		
// 		data = JSON.parse(dat);
// 		if (data.error != undefined)
// 		{
// 			console.timeEnd('Data rooms convert');
// 			console.error('Load rooms failed of build ' + b + '[server]: ' + data.error);
// 			return;
// 		}
// 		processing_rooms_of_build(data)

// 		console.timeEnd('Data rooms convert');
// 		//editor.postSurfaceTexts();
// 		console.log('Load rooms success of build ' + b);
// 		if (callback != void 0)
// 			callback();

// 		$('#room_mode_btn').css('background', '#EEEEEE');
// 	})
// 	.fail(function (dat) {
// 		console.timeEnd('Load rooms of build '+b);
// 		console.error('Load rooms failed of build ' + b);
// 	});
// }

function db_get_room_by(b,f,num,callback)
{
	console.time('Get room by '+num);
	$.post(server_address + "getRoomBy",
		{'b': b,'f':f,'n':num})
	.done(function (dat) {
		console.timeEnd('Get room by '+num);
		
		data = JSON.parse(dat);
		if (data.error != undefined)
		{
			console.error('Get room by failed ' + num + '[server]: ' + data.error);
			return;
		}

		if (callback != void 0)
			callback(data[0]);
	})
	.fail(function (dat) {
		console.timeEnd('Get room by '+num);
		console.error('Get room by failed ' + num);
	});
}

function db_add_room(b,f,n,nm,m,s,c,sid,callback)
{
	console.time('Add room '+n);
	$.post(server_address + "addRoom",
		{'b': b,'f':f,'n':n,'nm':nm,'m':m,'s':s,'c':c,'sid':sid})
	.done(function (dat) {
		console.timeEnd('Add room '+n);
		data = JSON.parse(dat);
		if (data.error != undefined)
		{
			var ms = 'Add room failed ' + n + '[server]: ' + data.error;
			showError('Error',ms);
			console.error(ms);
			return;
		}
		if (callback != void 0)
			callback(data[0]);
	})
	.fail(function (dat) {
		console.timeEnd('Add room '+n);
		console.error('Add room failed ' + n);
	});
}

function db_update_room(room,callback)//callback(room)
{
	console.time('Update room '+room.NUM);
	$.post(server_address + "updateRoom",room)
	.done(function (dat) {
		console.timeEnd('Update room '+room.NUM);
		data = JSON.parse(dat);
		if (data.error != undefined)
		{
			var ms = 'Update room failed ' + room.NUM + '[server]: ' + data.error;
			showError('Error',ms);
			console.error(ms);
			return;
		}
		if (callback != void 0)
			callback(data);
	})
	.fail(function (dat) {
		console.timeEnd('Update room '+room.NUM);
		console.error('Update room failed ' + room.NUM);
	});
}

function db_get_build_nana(b, callback, callback_args)
{
	console.time('Get build nana '+b);
	$.post(server_address + "getBuildNana",{b:b})
	.done(function (dat) {
		console.timeEnd('Get build nana '+b);

		var data = JSON.parse(dat);
		if (data.error != undefined)
		{
			var ms = 'Get build nana [server]: ' + data.error;
			showError('Error',ms);
			console.error(ms);
			return;
		}

		processing_rooms_of_build(JSON.parse(data.rooms));
		processing_source_rooms_of_build(JSON.parse(data.source_rooms), b);
		processing_get_navi_nodes_build(JSON.parse(data.navi));
		editor.setBuildInfo(JSON.parse(data.info));

		if (callback != void 0)
			callback.apply(this, callback_args);

		$('#navi_link_mode_btn').css('background', '#EEEEEE');

		$.snackbar({content: 'Get build nana '+b, style: 'toast', timeout: 3000});
	})
	.fail(function (dat) {
		console.timeEnd('Get build nana '+b);
		console.error('Get build nana failed');
	});
}

function db_update_build_info(info, callback, callback_args)
{
	console.time('Update build info');
	$.post(server_address + "setBuildInfo", {info: JSON.stringify(info)})
	.done(function (dat) {
		console.timeEnd('Update build info');
		data = JSON.parse(dat);
		if (data.error != undefined)
		{
			var ms = 'Update build info [server]: ' + data.error;
			showError('Error',ms);
			console.error(ms);
			return;
		}

		if (callback != void 0)
			callback.apply(this, callback_args);

		$.snackbar({content: 'Updated build info '+info.BID, style: 'toast', timeout: 3000});
	})
	.fail(function (dat) {
		console.timeEnd('Update build info');
		console.error('Update build info failed');
	});
}

function db_update_navi_nodes(navi)
{
	console.time('Update Navi Nodes');
	$.post(server_address + "updateNaviNodes", {data: JSON.stringify({'nodes':navi.nodes, 'removed_nodes': navi.removed_nodes})})
	.done(function (dat) {
		console.timeEnd('Update Navi Nodes');
		data = JSON.parse(dat);
		if (data.error != undefined)
		{
			var ms = 'Update Navi Nodes [server]: ' + data.error;
			showError('Error',ms);
			console.error(ms);
			return;
		}
		editor.naviResetRemovedNodes();
		$.snackbar({content: 'Navi nodes updated', style: 'toast', timeout: 3000});
	})
	.fail(function (dat) {
		console.timeEnd('Update Navi Nodes');
		console.error('Update Navi Nodes failed');
	});
}

function processing_get_navi_nodes_build(data)
{
	for (var n in data)
		data[n] = JSON.parse(data[n]);

	editor.naviExtendNodes(data);
	return data;
}

// function db_get_navi_nodes_build(b, callback, callback_args)
// {
// 	$('#navi_link_mode_btn').css('background', '#EE0000');

// 	console.time('Get Navi Nodes');
// 	$.post(server_address + "getNaviNodes",{b:b})
// 	.done(function (dat) {
// 		console.timeEnd('Get Navi Nodes');

// 		var data = JSON.parse(dat);
// 		if (data.error != undefined)
// 		{
// 			var ms = 'Get Navi Nodes [server]: ' + data.error;
// 			showError('Error',ms);
// 			console.error(ms);
// 			return;
// 		}
// 		var data = processing_get_navi_nodes_build(data);
		
// 		if (callback_args == void 0)
// 			callback_args = []
// 		callback_args.push(data)
// 		if (callback != void 0)
// 			callback.apply(this, callback_args);

// 		$('#navi_link_mode_btn').css('background', '#EEEEEE');

// 		$.snackbar({content: 'Navi nodes get '+b, style: 'toast', timeout: 3000});
// 	})
// 	.fail(function (dat) {
// 		console.timeEnd('Get Navi Nodes');
// 		console.error('Get Navi Nodes failed');
// 	});
// }

//JOURNEY
var fme2jurney_enabled = false;
var fme2jurney_p = 0;
var fme2jurney_c = 1;
function fme2jurney_progress()
{
	$.post(server_address + "journeyProgress")
	.done(function (dat) {
		if (!fme2jurney_enabled)
			return;

		var p = parseFloat(dat) * 100;
		var ext = '';
		var t = 1000;
		if (p == 0)
		{
			ext = ' [' + fme2jurney_c + ']';
			fme2jurney_c++;
			
			t = 100;

			p = fme2jurney_p;
		}
		else
			fme2jurney_c = 1;

		fme2jurney_p = p;
		pp = p.toFixed(2) + '%';
		X.GEBI('navi_progress').style.width = pp;
		$('#navi_progress_label').html(pp+ext);

		setTimeout(fme2jurney_progress, t);
	})
	.fail(function (dat) {
		$('#navi_progress_label').html('fme2jurney_progress fail');
	});
}

function fme2jurney()
{
	X.GEBI('navi_progress_div').style.display = 'block';
	fme2jurney_enabled = true;
	fme2jurney_p = 0;
	fme2jurney_progress();

	$.post(server_address + "journeyStart")
	.done(function (dat) {
		fme2jurney_enabled = false;
		var data = JSON.parse(dat);
		if (data.error != void 0)
		{
			showError('fme2jurney error', data.error);
			//$('#navi_progress_label').html(data.error);
			return;
		}
		X.GEBI('navi_progress').style.width = '100%';
		$('#navi_progress_label').html(data.tgen.toFixed(2) + '+' + data.tdb.toFixed(2) + '=' + data.tall.toFixed(2) + ' '
		 + data.path_count + '/' + data.path_count_teo);
		if (data.problem.length != 0)
			showError('fme2jurney problem', JSON.stringify(data.problem));
	})
	.fail(function (dat) {
		fme2jurney_enabled = false;
		$('#navi_progress_label').html('fme2jurney fail');
	});
}


function jv()
{
	X.GEBI('navi_progress_div').style.display = 'block';
	fme2jurney_enabled = true;
	fme2jurney_p = 0;
	fme2jurney_progress();

	$.post(server_address + "journeyValidate")
	.done(function (dat) {
		fme2jurney_enabled = false;

		var data = JSON.parse(dat);
		if (data.error != void 0)
		{
			X.GEBI('navi_progress').style.width = '0%';
			$('#navi_progress_label').html('journeyValidate error');
			showError('journeyValidate error [server]', data.error);
			return;
		}
		var text = "JOURNEY FAILS COUNT: " + data.count;
		for (var n in data.fails)
			text += "\n" + data.fails[n];

		//showError("JOURNEY FAILS",text);
		console.warn(text);

		X.GEBI('navi_progress').style.width = '100%';
		$('#navi_progress_label').html('journeyValidate finished count=' + data.count);
	})
	.fail(function (dat) {
		X.GEBI('navi_progress').style.width = '0%';
		$('#navi_progress_label').html('journeyValidate fail');
		fme2jurney_enabled = false;
		console.error('journeyValidate fail');
		console.error(dat);
	});
}

function minify()
{
	$.post(server_address + "fme2build")
		.done(function (dat)
		{
			var data = JSON.parse(dat);
			alert(data.status);
		})
		.fail(function ()
		{
			showError('Error','Minify fail');
		});
}
