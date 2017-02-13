//FME2 EDITOR OBJ

//NODE
FME2_EDITOR.prototype.create_node_mesh = function(node, position, color, x_type, opacity) //ADDITIONALY USE IN LOAD NODES
{
	geometry = new THREE.CircleGeometry(this.node_size, 10);//new THREE.PlaneGeometry(this.node_size, this.node_size);
	material = new THREE.MeshLambertMaterial({color: color, side: THREE.FrontSide, transparent: true, opacity: opacity});

	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.set(-Math.PI / 2, 0, Math.PI / 4);
	mesh.x_type = x_type;
	mesh.x_is_background = false;
	mesh.x_id = node.id;
	//node.scene_obj = mesh;
	//node.position = position;
	mesh.x_obj = node;
	mesh.x_color = color;

	mesh.name = x_type + '-' + node.id;
	mesh.userData = {type: x_type, node: node};

	//position.x = parseFloat(position.x);
	//position.y = parseFloat(position.y);
	//position.z = parseFloat(position.z);

	mesh.position.copy(position);
	return mesh;
};

//if store_node == undefined, point not multiple at px_zoom, 
//point = {x, y}
FME2_EDITOR.prototype.addNode = function(point, store_node)//INTERFACE (point)
{
	//point.y = parseFloat(point.y);
	//point.x = parseFloat(point.x);
	if (store_node == undefined)
	{
		point.x *= this.px_zoom;
		point.y *= this.px_zoom;
	}
	store_node = store_node || {};
	var id = store_node.id == undefined ? this.bids.node++ : store_node.id;

	var node = {
		id: id, 
		walls: [], on_wall: undefined
		//,get position(){return this.scene_obj.position;}
	};

	var node_mesh = this.create_node_mesh(node, new THREE.Vector3(point.y, this.h.node, point.x), this.node_color, 'node', 1);
	node_mesh.name = 'node-'+node.id;
	node.scene_obj = node_mesh;	
	this.scene.add(node.scene_obj);

	this.nodes[id] = node;
	return node;
};

FME2_EDITOR.prototype.removeNode = function(node)
{
	for (var w in node.walls)
		this.removeWall(node.walls[w], node);
	delete this.nodes[node.id];
	this.scene.remove(node.scene_obj);
};

FME2_EDITOR.prototype.removeSelectedNodes = function()
{
	var selected_nodes = this.getSelectedNodes();
	for (var n in selected_nodes)
		this.removeNode(selected_nodes[n]);
	this.clearSelectedObjects();
};

//WALL

FME2_EDITOR.prototype.create_wall_line3d = function(p1, p2, wall, color, x_type)
{
	var pc = p1.clone().add(p2).divideScalar(2);
	p1 = p1.clone().sub(pc);
	p2 = p2.clone().sub(pc);

	var geometry = new THREE.Geometry();
	geometry.vertices.push(p1, p2);

	var material = new THREE.LineBasicMaterial({color: color, linewidth: this.line_size});
	var line = new THREE.Line(geometry, material);

	line.position.copy(pc);
	line.position.setY(this.h.wall);
	line.x_id = wall.id;
	line.x_is_background = false;
	line.x_type = x_type;
	line.x_obj = wall;
	line.x_color = color;
	line.x_length = p1.distanceTo(p2);//p1.clone().sub(p2).length();

	line.name = x_type + '-' + wall.id;
	line.userData = {type: x_type, wall: wall};

	return line;
};


//store_wall defined = load data
FME2_EDITOR.prototype.connectNodes = function(n1, n2, store_wall)//INTERFACE (n1, n2)
{
	if (n1 == undefined || n2 == undefined || n1.id == n2.id) return;
	store_wall = store_wall || {};
	var selected_color = (store_wall.color_id == undefined ? undefined : this.colors.subtypes[store_wall.color_id]) || this.getSelectedColor('WALL');

	if (selected_color == undefined) 
	{
		this.showErrorFunction('Connedting Nodes Error', 'Wall color not selected');
		return;
	}
	for (var k in this.walls)
	{
		var nn = this.walls[k].nodes;
		if (nn == undefined) continue;
		var err = false;
		if (nn[0].id == n1.id && nn[1].id == n2.id || nn[1].id == n1.id && nn[0].id == n2.id)
		{
			this.showErrorFunction('Connecting Nodes Error', 'Nodes already connected.');
			return;
		}
	}
	
	var id = store_wall.id == undefined ? this.bids.wall++ : store_wall.id;

	var wall = {
		id: id,
		nodes: [n1, n2],
		doors: [],
		get positions(){return [this.nodes[0].scene_obj.position, this.nodes[1].scene_obj.position];},
		subtype_color: selected_color
	};

	var line = this.create_wall_line3d(n1.scene_obj.position, n2.scene_obj.position, wall, selected_color.color, 'wall');
	line.name = 'wall-'+id;

	wall.scene_obj = line;
	n1.walls.push(wall);
	n2.walls.push(wall);

	this.walls[wall.id] = wall;
	this.scene.add(line);
	return wall;
};

FME2_EDITOR.prototype.removeWall = function(wall, not_remove_from_node)//INTERFACE (wall)
{
	not_remove_from_node = not_remove_from_node || {};
	if (not_remove_from_node.id != wall.nodes[0].id)
		wall.nodes[0].walls.splice(wall.nodes[0].walls.indexOf(wall), 1);
	if (not_remove_from_node.id != wall.nodes[1].id)
		wall.nodes[1].walls.splice(wall.nodes[1].walls.indexOf(wall), 1);
	
	for (var k in wall.doors)
		this.removeDoor(wall.doors[k]);

	delete this.walls[wall.id];
	this.scene.remove(wall.scene_obj);
};

FME2_EDITOR.prototype.removeSelectedWalls = function()
{
	var selected = this.getSelectedWalls();
	for (var k in selected)
		this.removeWall(selected[k]);
	this.clearSelectedObjects();
};


FME2_EDITOR.prototype.createSurface = function(nids, store_surface)//INTERFACE (nids)
{
	store_surface = store_surface || {};
	selected_color = (store_surface.color_id == undefined ? undefined : this.colors.subtypes[store_surface.color_id]) || this.getSelectedColor('SURFACE');
	if (selected_color == undefined) 
	{
		this.showErrorFunction('Surfacing Error', 'Surface color not selected');
		return;
	}
	var id = store_surface.id == undefined ? this.bids.surface++ : store_surface.id;

	//for (var k in store_surface.points)
	//{
	//	var p = store_surface.points[k];
	//	p.x = parseFloat(p.x);
	//	p.y = parseFloat(p.y);
	//	store_surface.points[k] = p;
	//}

	var californiaPts = [];
	for (var k in store_surface.points)
		californiaPts.push(new THREE.Vector2(store_surface.points[k].x, store_surface.points[k].y));

	if (nids != void 0 && nids[0] == nids[nids.length - 1])
		nids.splice(nids.length - 1, 1);
	for (var k in nids)
	{
		var p = this.nodes[nids[k]].scene_obj.position;
		californiaPts.push(new THREE.Vector2(p.x, p.z));
	}

	var surface = {
		id: id,
		points: californiaPts,
		subtype_color: selected_color,
		room_id: store_surface.room_id,
		icon_name: store_surface.icon_name,
		__calc_positions: function()
		{
			var pc = new THREE.Vector2(0, 0);
			for (var k in this.points)
				pc.add(this.points[k]);
			pc.divideScalar(this.points.length);
			var p = [];
			for (var k in this.points)
				p.push(this.points[k].clone().sub(pc));
			return {pc: pc, ps: p};
		}
	};

	var pcs = surface.__calc_positions();
	
	var californiaShape = new THREE.Shape(pcs.ps);
	var geometry = new THREE.ShapeGeometry(californiaShape);
	var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: selected_color.color, side: THREE.BackSide}));
	mesh.rotation.set(Math.PI / 2, 0, 0);
	mesh.position.set(pcs.pc.x, this.h.surface, pcs.pc.y);
	surface.scene_obj = mesh;
	this.surfaces[id] = surface;
	mesh.x_obj = surface;
	mesh.x_id = id;
	mesh.x_type = 'surface';
	mesh.x_is_background = false;
	mesh.x_color = selected_color.color;
	// this.ray_meshs.push(mesh);

	mesh.name = mesh.x_type + '-' + mesh.x_id;
	mesh.userData = {type: mesh.x_type, surface: surface};

	this.scene.add(mesh);

	return surface;
};

FME2_EDITOR.prototype.removeSurface = function(surface)
{
	delete this.surfaces[surface.id];
	$('#icon-' + surface.id).hide();
	//this.scene.remove(surface.text_mesh);
	this.scene.remove(surface.scene_obj);
};

FME2_EDITOR.prototype.removeSelectedSurfaces = function()
{
	var selected = this.getSelectedSurfaces();
	for (var k in selected)
		this.removeSurface(selected[k]);
	this.clearSelectedObjects();
};

//DOORS

//if store_door == undefined, point not multiple at px_zoom, 
//point = {x, y}
FME2_EDITOR.prototype.addDoor = function(point, wall, visible, store_door)//INTERFACE (point, wall)
{
	//point.y = parseFloat(point.y);
	//point.x = parseFloat(point.x);
	if (store_door == void 0)
	{
		point.x *= this.px_zoom;
		point.y *= this.px_zoom;
	}
	store_door = store_door || {};
	var id = store_door.id == undefined ? this.bids.door++ : store_door.id;
	wall = wall || this.walls[store_door.wall_id];
	visible = visible || store_door.visible;
	if (visible != false)
		visible = visible || true;

	geometry = new THREE.PlaneGeometry(this.door_width * this.px_zoom, this.door_length * this.px_zoom);
	material = new THREE.MeshLambertMaterial({color: visible ? this.door_color : this.door_color_invisible, side: THREE.FrontSide});

	var mesh = new THREE.Mesh(geometry, material);

	point = new THREE.Vector3(point.y, this.h.door, point.x);
	n_point = wall.nodes[0].scene_obj.position.clone();
	n_point.sub(point);
	var angle = n_point.angleTo(new THREE.Vector3(0, 0, -1));

	mesh.rotation.set(-Math.PI / 2, 0, angle);
	mesh.position.copy(point);
	mesh.x_type = 'door';
	mesh.x_is_background = false;
	mesh.x_id = id;
	mesh.x_color = material.color.getHex();
	
	var door = {
		id: id, 
		wall: wall,
		visible: visible,
		scene_obj: mesh
		//,get position(){return this.scene_obj.position;}
	};

	mesh.name = mesh.x_type + '-' + mesh.x_id;
	mesh.userData = {type: mesh.x_type, door: door};

	wall.doors.push(door);
	mesh.x_obj = door;
	this.scene.add(mesh);

	this.doors[id] = door;
	return door;
};

FME2_EDITOR.prototype.removeDoor = function(door)
{
	delete this.doors[door.id];
	this.scene.remove(door.scene_obj);
};

FME2_EDITOR.prototype.removeSelectedDoors = function()
{
	var selected = this.getSelectedDoors();
	for (var k in selected)
		this.removeDoor(selected[k]);
	this.clearSelectedObjects();
};

FME2_EDITOR.prototype.createTextMesh = function(text, surface, icon_name)
{
	//var geometry = new THREE.TextGeometry(text, {
	//	font: this.font,
	//	size: this.text_size,
	//	height: 1,
	//	curveSegments: 2
	//});
	//var material = new THREE.MeshBasicMaterial({color: this.text_color});
	//geometry.computeBoundingBox();
	//var size = geometry.boundingBox.max;
	//var mesh = new THREE.Mesh(geometry,  material);
	//surface.text_mesh = mesh;
	//var pos = surface.scene_obj.position.clone();
	//mesh.position.set(pos.x - size.y / 2, this.h.text, pos.z - size.x / 2);
	//mesh.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
	//mesh.x_type = 'text';
	//this.scene.add(mesh);

	//room text //fake mesh
	var text_pos = surface.scene_obj.position.clone();

	text_pos.setY(this.h.text);

	var icon_content = icon_name == void 0 ? '' : '<img class="fme2icon" src="' + FME2.ICON_DATA.byname[icon_name].file + '" id="icon-' + surface.id + '">';
	var text_content =  text == void 0 ? '' : '<font class="fme2label" id="text-' + surface.id + '">' + text + '</font><br>';

	text_content = icon_content + text_content;
	if (text_content == '')
		return surface;

	var obj3d = FME2.CSSXD.createCSS2DObject(text_content, text_pos, {}, {});
	//var obj3d = FME2.CSSXD.createCSS2DObject(text_content, text_pos, {className: 'fme2label'}, {color: '#000000'});
	
	surface.text_mesh = obj3d;
	surface.last_text = text;
	obj3d.x_type = 'text';
	obj3d.userData = {type:'text', surface: surface};
	obj3d.name = 'text-'+text+'-s'+surface.id;

	this.scene.add(obj3d);

	return surface;
};

FME2_EDITOR.prototype.updateTextMesh = function(surface)
{
	this.scene.remove(surface.text_mesh);
	this.createTextMesh(surface.last_text, surface, surface.icon == void 0 ? undefined : surface.icon.name);
};

FME2_EDITOR.prototype.postSurfaceTexts = function()
{
	for (var s in this.surfaces)
	{
		var surface = this.surfaces[s];
		if (surface.room_id != void 0 && surface.text_mesh == void 0)
		{
			var room = this.getRooms();
			if (room == null)
				return;
			room = room[surface.room_id];
			if (room == void 0)
			{
				surface.room_id = undefined;
				return surface;
			}

			this.setLinkRoomSurface(room, surface, this.rooms.idkey, this.rooms.surfkey, this.rooms.namekey);
		}
		else if (surface.icon_name != void 0)
			this.createTextMesh(undefined, surface, surface.icon_name);
	}
};
//------------------------------------------------------------------------------------------//