function tfu(tfu,t,f,rt,rf,ru)
{
	return tfu == t ? rt : (tfu == f ? rf : ru);
}

function room_tfu_str(_tfu)
{
	return tfu(_tfu,true,false,editor.Enums.STR.TRUE,editor.Enums.STR.FALSE,editor.Enums.STR.UNKNOW);
	//return tfu ? editor.Enums.STR.TRUE : (tfu == false ? editor.Enums.STR.FALSE : editor.Enums.STR.UNKNOW);
}

function room_tfu_unstr(_tfu)
{
	return tfu(_tfu,editor.Enums.STR.TRUE,editor.Enums.STR.FALSE,true,false,null);
	//return tfu ? editor.Enums.STR.TRUE : (tfu == false ? editor.Enums.STR.FALSE : editor.Enums.STR.UNKNOW);
}

function room_view(room)
{
	room_mode.selected_room = room;
	X.GEBI('room_num').value = room.NUM;
	X.GEBI('room_name').value = room.NAME;
	X.GEBI('room_multi').value = room_tfu_str(room.MULTY);
	X.GEBI('room_study').value = room_tfu_str(room.STUDY);
	X.GEBI('room_capacity').value = room.CAPACITY == void 0 || room.CAPACITY == null ? '' : room.CAPACITY;
}

function room_na()
{
	X.GEBI('room_num').value = editor.Enums.STR.NA;
	X.GEBI('room_name').value = editor.Enums.STR.NA;
	X.GEBI('room_multi').value = editor.Enums.STR.UNKNOW;
	X.GEBI('room_study').value = editor.Enums.STR.UNKNOW;
	X.GEBI('room_capacity').value = '';
}


function onRoomClick(e)
{
	var SURFACE = editor.getSelectedSurfaces()[0];
	if (SURFACE == undefined)
	{
		room_na();
		$('#room_save_btn').html('[ACTION]');
		return;
	}
	var room = editor.getLinkRoomSurface(SURFACE);
	if (room != void 0)
	{
		room_view(room);
		$('#room_save_btn').html('UPDATE');
	}
	else
	{
		room_na();
		$('#room_save_btn').html('ADD');
	}
}

room_mode = {fme2: false, source:false, selected_room: undefined};

function room_mode_fme2()
{
	$('#room_fme2_btn').css('background', '#009688');
	$('#room_source_btn').css('background', '#EEEEEE');
	//$('#room_name_search_label').html ('ROOM FME2 [NAME]');
	$('#room_select').html('');
	room_mode.fme2 = true;
	room_mode.source = false;
}

function room_mode_source()
{
	$('#room_fme2_btn').css('background', '#EEEEEE');
	$('#room_source_btn').css('background', '#009688');
	//$('#room_name_search_label').html('ROOM SOURCE [NAME]');
	$('#room_select').html('');
	room_mode.source = true;
	room_mode.fme2 = false;
}

function find_rooms(like,numkey,rooms)
{
	var rs = [];
	for (var k in rooms)
	{
		var s = String(rooms[k][numkey]);
		if (s.indexOf(like) >= 0 && rooms[k].SURFACE_ID == void 0)
			rs.push(rooms[k])
	}
	return rs;
}

function on_room_find()
{
	var like = X.GEBI('room_name_search').value;
	X.GEBI('room_num').value = like;
	X.GEBI('room_name').value = selected_build_id+'-'+like;
	var rms = room_mode.fme2 ? find_rooms(like,'NUM',rooms) : find_rooms(like,'NUM',source_rooms);
	var el = X.GEBI('room_select');
	el.innerHTML = '';
	for (var k in rms)
		el.innerHTML+='<option>'+rms[k].ID+'|\t'+rms[k].NUM+'\t|\t'+rms[k].NAME+'</options>';
}

function on_room_select()
{
	var select = X.GEBI('room_select').value;
	if (select == '' || select == void 0)
	{
		room_na();
		return;
	}
	select = String(select).split('|')[0];
	room_view(room_mode.fme2 ? rooms[select] : source_rooms[select]);
}


function on_save_room()
{
	//var act = X.GEBI('room_capacity').innerHTML;
	var surface = editor.getSelectedSurfaces()[0];
	if (surface == void 0)
		return;

	var room = editor.getLinkRoomSurface(surface);

	var n = X.GEBI('room_num').value;
	var nm = X.GEBI('room_name').value;
	var m = X.GEBI('room_multi').value;
	var s = X.GEBI('room_study').value;
	var c = X.GEBI('room_capacity').value;

	//n = n; //WTF?
	nm = nm == '' ? null : nm;
	m = room_tfu_unstr(m);
	s = room_tfu_unstr(s);
	c = c == '' ? null : parseInt(c);

	if (n == '')
	{
		showError('Input Error','NUM is empty');
		return;
	}

	if (isNaN(c))
	{
		showError('Input Error','CAPACITY is NaN');
		return;
	}

	var type = X.GET_URL_PARAMETER('backup') ? 'backup' : 'main';

	if (room != void 0)
	{
		room.FLOOR = selected_level_id;
		room.NUM = n;
		room.NAME = nm;
		room.MULTY = m;
		room.STUDY = s;
		room.CAPACITY = c;
		db_update_room(room,
			function()
			{
				rooms[room.ID] = room;
				editor.setLinkRoomSurface(room, surface);
				console.log('Update room success ID='+room.ID);
				onSaveData(type);
			});
	}
	else
	{
		db_add_room(selected_build_id,selected_level_id,n,nm,m,s,c,surface.id,
			function(room)
			{
				rooms[room.ID] = room;
				editor.setLinkRoomSurface(room, surface);
				console.log('Add room success ID='+room.ID);
				onSaveData(type);
			});
	}
}