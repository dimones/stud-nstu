//FME2 EDITOR INTERFACE
FME2_EDITOR.prototype.rayGetIntersects = function(client_event)//USING .clientX .clientY
{
	if (this.scene == void 0) return {length: 0};
	var x = client_event.offsetX;// - this.renderer_left;
	var y = client_event.offsetY;// - this.renderer_top;
	this.updateRenderSize();
	if (x < 0 || x > this.renderWidth || y < 0 || y > this.renderHeight) return {length: 0};
	y = this.renderHeight - y;
	x = x / this.renderWidth * 2 - 1;
	y = y / this.renderHeight * 2 - 1;
	this.ray_mouse.set(x, y);
	this.raycaster.setFromCamera(this.ray_mouse, this.camera);
	var intersects = this.raycaster.intersectObjects(this.scene.children);//this.ray_meshs);

	if ((this.navi.visible == void 0 || this.navi.visible == true) && this.navi.group != void 0)
	{
		var intersectNavi = this.raycaster.intersectObjects(this.navi.group.children);
		if (intersectNavi == void 0)
			intersectNavi = [];
		for (var i in intersects)
			intersectNavi.push(intersects[i])
		intersects = intersectNavi;
	}

	intersects = intersects || {length: 0};

	return intersects;
};

//CAMERA
// FME2_EDITOR.prototype.cameraSetPosition = function(x, y)
// {
// 	console.error('This function incorrect');return;
// 	this.camera.position.set(y, this.camera.position.y, x);
// 	this.camera.lookAt(new THREE.Vector3(y, 0, x));
// };

FME2_EDITOR.prototype.cameraReset = function()
{
	//console.error('This function incorrect');return;
	this.controls.reset();
	var camera_target = new THREE.Vector3(this.camera_center_y, 0, this.camera_center_x);
	this.camera.position.set(this.camera_center_y, this.camera.x_reset_y, this.camera_center_x);
	this.camera.lookAt(camera_target);
	this.controls.target = camera_target;
	this.controls.position = this.camera.position;
};

//COLORS
FME2_EDITOR.prototype.setSelectedColor = function(type, id)
{
	this.selected_color[type] = id;
};

FME2_EDITOR.prototype.setObjectsColorToColor = function(objects, subtype_color, force_id)
{
	if (subtype_color == void 0) return;
	for (var k in objects)
	{
		var obj = objects[k];
		if (!force_id && obj.subtype_color.id != subtype_color.id) continue;
		obj.subtype_color = subtype_color;
		obj.scene_obj.material.color.setHex(subtype_color.color);
		obj.scene_obj.x_color = subtype_color.color;
	}
};

FME2_EDITOR.prototype.getWallHeightByColorID = function(id)
{
	return this.wall_heights[id];
};

FME2_EDITOR.prototype.addColor = function(type, subtype, color, height)
{
	if (type=='' || subtype == '')
	{
		this.showErrorFunction('Input Error', 'Text arguments must be not empty!');
		return undefined;
	}
	var h = parseFloat(height);
	if (height != void 0 && isNaN(h))
	{
		this.showErrorFunction('Parse Error', 'Height argument is NaN!');
		return undefined;
	}
	if (h<=0 || h>1)
	{
		this.showErrorFunction('Range Error', 'Height argument out of range (>0, <=1)!');
		return undefined;
	}

	var id = this.colors.count;
	var st = {type: type, subtype: subtype, color: color, id: id};
	if (this.colors.type_ids[type] == undefined)
		this.colors.type_ids[type] = [id];
	else
		this.colors.type_ids[type].push(id);
	
	this.colors.subtypes[id] = st;

	this.colors.count = id + 1;

	if (height != void 0)
		this.wall_heights[id] = h;

	return st;
};

FME2_EDITOR.prototype.editColor = function(id, subtype, color, height)
{
	if (subtype == '')
	{
		this.showErrorFunction('Input Error', 'Text arguments must be not empty!');
		return undefined;
	}
	var h = parseFloat(height);
	if (height != void 0 && isNaN(h))
	{
		this.showErrorFunction('Parse Error', 'Height argument is NaN!');
		return undefined;
	}
	if (h<=0 || h>1)
	{
		this.showErrorFunction('Range Error', 'Height argument out of range (>0, <=1)!');
		return undefined;
	}

	var st = this.colors.subtypes[id];
	st.subtype = subtype;
	st.color = color;
	this.colors.subtypes[id] = st;

	this.setObjectsColorToColor(this.surfaces, st, false);

	// for (var s in this.surfaces)
	// {
	// 	var surface = this.surfaces[s];
	// 	if (surface.subtype_color.id == id)
	// 	{
	// 		surface.subtype_color = st;
	// 		surface.scene_obj.material.color.setHex(st.color);
	// 	}
	// }

	this.setObjectsColorToColor(this.walls, st, false);

	// for (var w in this.walls)
	// {
	// 	var wall = this.walls[w];
	// 	if (wall.subtype_color.id == id)
	// 	{
	// 		wall.subtype_color = st;
	// 		wall.scene_obj.material.color.setHex(st.color);
	// 	}
	// }

	if (height != void 0)
		this.wall_heights[id] = h;

	return st;
};

FME2_EDITOR.prototype.getSelectedColor = function(type)
{
	if (this.selected_color[type] == undefined) return undefined;
	return this.colors.subtypes[this.selected_color[type]];
};

//ADDING NODES
FME2_EDITOR.prototype.toCloseToNodes = function(point)
{
	var p = new THREE.Vector3(point.x * this.px_zoom, this.h_node, point.y * this.px_zoom);
	for (var k in this.nodes)
	{
		var np = this.nodes[k].scene_obj.position.clone().sub(p);
		if (np.length() <= this.node_size)
			return this.nodes[k];
	}
	return undefined;
};

FME2_EDITOR.prototype.enableMultiselectClicker = function(){this.oppext.multiselect_clicker = true;};
FME2_EDITOR.prototype.disableMultiselectClicker = function(){this.oppext.multiselect_clicker = false;};

FME2_EDITOR.prototype.clearSelectedObjects = function(){this.oppext.clear_selected_objects();};
FME2_EDITOR.prototype.getSelectedNodes = function(){return X.GET_VALUES_OF_KEYS_IN_DIC(X.GET_VALUES_OF_DIC_BY_KEY_VALUE(this.oppext.selected_objects, 'x_type', 'node'), 'x_obj');};
FME2_EDITOR.prototype.getSelectedWalls = function(){return X.GET_VALUES_OF_KEYS_IN_DIC(X.GET_VALUES_OF_DIC_BY_KEY_VALUE(this.oppext.selected_objects, 'x_type', 'wall'), 'x_obj');};
FME2_EDITOR.prototype.getSelectedDoors = function(){return X.GET_VALUES_OF_KEYS_IN_DIC(X.GET_VALUES_OF_DIC_BY_KEY_VALUE(this.oppext.selected_objects, 'x_type', 'door'), 'x_obj');};
FME2_EDITOR.prototype.getSelectedSurfaces = function(){return X.GET_VALUES_OF_KEYS_IN_DIC(X.GET_VALUES_OF_DIC_BY_KEY_VALUE(this.oppext.selected_objects, 'x_type', 'surface'), 'x_obj');};
FME2_EDITOR.prototype.getSelectedNaviNodes = function(){return X.GET_VALUES_OF_KEYS_IN_DIC(X.GET_VALUES_OF_DIC_BY_KEY_VALUE(this.oppext.selected_objects, 'x_type', 'navi_node'), 'x_obj');};
FME2_EDITOR.prototype.getSelectedNaviLines = function(){return X.GET_VALUES_OF_KEYS_IN_DIC(X.GET_VALUES_OF_DIC_BY_KEY_VALUE(this.oppext.selected_objects, 'x_type', 'navi_line'), 'x_obj');};

FME2_EDITOR.prototype.getPositionMeters = function(position){return {x: position.z / this.px_zoom, y: position.x / this.px_zoom};};

//OPPS
FME2_EDITOR.prototype.enableOpp = function(opp_name, params){this.event_cluster.Enable(opp_name, params);};
FME2_EDITOR.prototype.disableOpp = function(opp_name, params){this.event_cluster.Disable(opp_name, params);};
FME2_EDITOR.prototype.addOppEvent = function(name, context, funcs){this.event_cluster.addOppEvent(name, context, funcs);};

//LEVELS
FME2_EDITOR.prototype.loadLevel = function(build_id, level_id)
{
	var loaded = this.get_loaded_level(build_id, level_id);
	var level = this.get_level(build_id, level_id);
	if (level == void 0 && loaded == void 0)
	{
		this.showErrorFunction('Load Level Error','Level is undefined. ' + build_id + '->' + level_id);
		return false;
	}
	this.load_level(loaded || level);
	return true;
};

FME2_EDITOR.prototype.getBuild = function(build_id)
{
	if (this.builds == void 0)
		return undefined;
	return this.builds[build_id];
};

FME2_EDITOR.prototype.setBuild = function(build, build_id)
{
	if (this.builds == void 0)
		this.builds = {};
	if (this.data.builds == void 0)
		this.data.builds = {};
	this.builds[build_id] = build;
	this.data.builds[build_id] = build;
};

FME2_EDITOR.prototype.emptyBuildInfo = function(bid){return {BID: bid, NAVI_NODE_BID: 1, NAME: null};};
FME2_EDITOR.prototype.setBuildInfo = function(build_info){this.build_info[build_info.BID] = build_info;};
FME2_EDITOR.prototype.getBuildInfo = function(build_id)
{
	var info = this.build_info[build_id];
	return info == void 0 ? this.emptyBuildInfo() : info;
};
FME2_EDITOR.prototype.getCurrentBuildInfo = function(){return this.getBuildInfo(this.build_id);};


FME2_EDITOR.prototype.createLevel = function(build_id, level_id)
{
	if (build_id <= 0)
	{
		this.showErrorFunction('Create Level Error','Invalid build_id. ' + build_id);
		return false;
	}
	if (this.get_level(build_id, level_id) != void 0)
	{
		this.showErrorFunction('Create Level Error','Level already exist. ' + build_id + '->' + level_id);
		return false;
	}
	if (this.build_ids.indexOf(build_id) < 0)
	{
		this.build_ids.push(build_id);
		this.build_ids.sort();
	}
	//this.build_id = build_id;
	//this.level_id = level_id;
	this.load_level(this.create_level(build_id, level_id));
	return true;
};

FME2_EDITOR.prototype.removeLevel = function(build_id, level_id)
{
	if (void 0 == build_id && void 0 == level_id) return;

	delete this.data.builds[build_id][level_id];
	var c = 0;
	for (var k in this.data.builds[build_id])
		c++;
	if (c == 0)
		delete this.data.builds[build_id];
	if (this.build_id == build_id && this.level_id == level_id)
	{
		this.build_id = null;
		this.level_id = null;
		for (var k in this.scene.children)
			this.scene.remove(this.scene.children[k]);
		this.renderer.render(this.scene, this.camera);
		this.scene = undefined;
	}
};

FME2_EDITOR.prototype.copyLevel = function(build_id, level_id)
{
	if (this.get_level(build_id, level_id) != void 0)
	{
		this.showErrorFunction('Copy Level Error','Level already exist. ' + build_id + '->' + level_id);
		return false;
	}
	this.copy_current_level(build_id, level_id);
	return true;
};

FME2_EDITOR.prototype.setVisisbleDoors = function(doors, visible)
{
	for (var d in doors)
	{
		var obj = doors[d].scene_obj;
		doors[d].visible = visible;
		obj.material.color.setHex(visible ? this.door_color : this.door_color_invisible);
		obj.x_color = obj.material.color.getHex();
	}
};

// FME2_EDITOR.prototype.getSelectedRoom = function()
// {
// 	return this.oppext.selected_room;
// }

FME2_EDITOR.prototype.setLinkRoomSurface = function(room, surface, idkey, surfkey, namekey)
{
	idkey = idkey || this.rooms.idkey;
	surfkey = surfkey || this.rooms.surfkey;
	namekey = namekey || this.rooms.namekey;

	surface.room_id = room[idkey];
	this.surfaces[surface.id] = surface;
	room[surfkey] = surface.id;

	if (surface.text_mesh != undefined)
		this.scene.remove(surface.text_mesh);
	this.createTextMesh(room[namekey], surface, surface.icon_name);

	return {room: room, surface: surface};
};

FME2_EDITOR.prototype.getLinkRoomSurface = function(surface)
{
	if (surface == void 0)
		return undefined;
	return this.getRooms()[surface.room_id];
};

FME2_EDITOR.prototype.removeSelectedRooms = function(surfkey)
{
	var surfaces = this.getSelectedSurfaces();
	var rooms = [];
	for (var s in surfaces)
	{
		var surface = surfaces[s];
		if (surface == void 0)
			continue;
		var room = this.getRooms();
		room = room[surface.room_id];
		if (room == void 0)
			continue;
		this.scene.remove(surface.text_mesh);
		surface.text_mesh = undefined;
		surface.room_id = undefined;
		room[surfkey] = undefined;
		this.surfaces[surface.id] = surface;
		$('#text-' + surface.id).hide();
		rooms.push(room);
	}
	return rooms;
};

//ICONS
FME2_EDITOR.prototype.selectIconName = function(icon_name)
{
	this.selected_icon = FME2.ICON_DATA.byname[icon_name];
	return this.selected_icon;
};

FME2_EDITOR.prototype.setIconToObjects = function(objs, icon)
{
	for (var o in objs)
	{
		var obj = objs[o];
		if (obj.x_type == 'surface')
		{
			obj.x_obj.icon = icon;
			this.updateTextMesh(obj.x_obj);
		}
	}
};
//------------------------------------------------------------------------------------------//