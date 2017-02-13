//FME2 EDITOR LEVELS
FME2_EDITOR.prototype.reset_levels = function()
{
	this.scene = undefined;
	this.loaded_levels = {};
};

FME2_EDITOR.prototype.create_scene = function()
{
	var scene = new THREE.Scene();
	scene.add(this.background);
	scene.add(this.ambient_light);
	//scene.add(this.axis_helper);
	scene.add(this.selecter_rect);
	return scene;
};

FME2_EDITOR.prototype.create_css_renderer = function()
{
	var css_renderer = FME2.CSSXD.createCSS2DRenderer(this.render_container);
	css_renderer.setSize(this.renderWidth, this.renderHeight);
	css_renderer.domElement.style.top = this.renderer.domElement.offsetTop + 'px';
	return css_renderer;
};

FME2_EDITOR.prototype.add_level_to_builds = function(level)
{
	var lv = {};
	lv[level.level_id] = level;
	if (this.builds[level.build_id] == void 0)
	{
		this.builds[level.build_id] = {};
		this.setBuildInfo(this.emptyBuildInfo(level.build_id));
	}
	$.extend(this.builds[level.build_id], lv);
};

FME2_EDITOR.prototype.get_level = function(build_id, level_id)
{
	//this.pack_current_level();
	var level = this.builds[build_id];
	if (level == void 0) return undefined;
	level = level[level_id];
	if (level == void 0) return undefined;
	return level;
};

FME2_EDITOR.prototype.create_level = function(build_id, level_id, not)
{
	var level = {
		level_id: level_id,
		build_id: build_id,
		bids: {node: 0, wall: 0, door:0, surface: 0, stair: 0},
		nodes: {},
		walls: {},
		doors: {},
		surfaces: {},
		stairs: {},
		scene: undefined,
		build: undefined
	};
	if (not != true)
	{
		this.add_level_to_builds(level);
		//this.load_level(level);
	}
	
	return level;
};

FME2_EDITOR.prototype.copy_current_level = function(build_id, level_id)
{
	this.pack_current_level();
	var level = this.get_level(this.build_id, this.level_id);
	if (level == undefined) return;
	var cplevel = this.create_level(build_id, level_id);
	for (var k in cplevel)
		cplevel[k] = level[k];

	for (var s in cplevel.surfaces)
		cplevel.surfaces[s].room_id = undefined;

	cplevel.build_id = build_id;
	cplevel.level_id = level_id;
	this.add_level_to_builds(level);
	return level;
};

FME2_EDITOR.prototype.get_loaded_level = function(build_id, level_id)
{
	var lv = this.loaded_levels[build_id];
	if (lv == void 0) return undefined;
	lv = lv[level_id];
	return lv;
};

FME2_EDITOR.prototype.save_current_loaded_level = function()
{
	var lvl = this.get_loaded_level(this.build_id, this.level_id) || this.create_level(this.build_id, this.level_id, true);
	//$.extend(lvl, {scene: lvl.scene || null, build: lvl.build: null});
	for (var k in lvl)
		lvl[k] = this[k];
	
	if (this.loaded_levels[this.build_id] == void 0)
		this.loaded_levels[this.build_id] = {};
	this.loaded_levels[this.build_id][this.level_id] = lvl;
	return lvl;
};


FME2_EDITOR.prototype.load_level = function(level)
{
	if (this.build_id != level.build_id || this.level_id != level.level_id)
		this.pack_current_level();

	if (this.css_renderer != void 0)
		this.css_renderer.domElement.remove();

	for (var k in level)
		this[k] = level[k];

	this.scene = this.create_scene();
	this.css_renderer = this.create_css_renderer();

	var lblid = function (l) {return l.build_id * 100 + l.level_id;};

	var loaded = this.level_unpacked_status[lblid(level)];
	if (loaded)//CRUTCH!
	{
		for (var n in this.nodes)
			this.scene.add(this.nodes[n].scene_obj);
		for (var w in this.walls)
			this.scene.add(this.walls[w].scene_obj);
		for (var d in this.doors)
			this.scene.add(this.doors[d].scene_obj);
		for (var s in this.surfaces)
		{
			this.scene.add(this.surfaces[s].scene_obj);
			if (this.surfaces[s].text_mesh != undefined)
				this.scene.add(this.surfaces[s].text_mesh);
		}

		this.naviLoadLevel();

		return;
	}

	this.build = this.builds[level.build_id];
	level.build = this.build;

	for (var n in this.nodes)
	{
		var node = this.nodes[n];
		this.addNode({x: node.position.z, y: node.position.x}, node);	
	}
	for (var w in this.walls)
	{
		var wall = this.walls[w];
		//$.extend(wall, {nodes:[this.nodes[this.walls[w].nodes_ids[0]], this.nodes[this.walls[w].nodes_ids[1]]]});
		this.connectNodes(this.nodes[wall.nodes_ids[0]], this.nodes[wall.nodes_ids[1]], wall);
	}
	for (var d in this.doors)
	{
		var door = this.doors[d];
		this.addDoor({x: door.position.z, y: door.position.x} , undefined, undefined, door);
	}
	for (var s in this.surfaces)
	{
		var surface = this.surfaces[s];
		this.createSurface(undefined, surface);
	}

	this.naviLoadLevel();

	this.level_unpacked_status[lblid(level)] = true;
	//this.loaded_levels[this.build_id].levels[this.level_id] = level;
};

FME2_EDITOR.prototype.pack_current_level = function()
{
	if (this.scene == void 0) return;

	var level = this.builds[this.build_id][this.level_id];
	level = level || {level_id: this.level_id, build_id: this.build_id};

	level.bids = this.bids;

	level.nodes = {};
	for (var k in this.nodes)
	{
		var node = this.nodes[k];
		level.nodes[k] = {
			position: node.scene_obj.position, 
			id: node.id,
			wall_ids: X.GET_VALUES_OF_KEYS_IN_DIC(node.walls, 'id')
		};
	}
	level.walls = {};
	for (var k in this.walls)
	{
		var wall = this.walls[k];
		level.walls[k] = {
			id: wall.id,
			nodes_ids: [wall.nodes[0].id, wall.nodes[1].id],
			color_id: wall.subtype_color.id
		};
	}
	level.doors = {};
	for (var k in this.doors)
	{
		var door = this.doors[k];
		level.doors[k] = {
			id: door.id,
			wall_id: door.wall.id,
			visible: door.visible,
			position: door.scene_obj.position
		};
	}
	level.surfaces = {};
	for (var k in this.surfaces)
	{
		var surface = this.surfaces[k];
		level.surfaces[k] = {
			id: surface.id,
			points: surface.points,
			color_id: surface.subtype_color.id,
			room_id: surface.room_id,
			icon_name: surface.icon_name
		};
	}
	level.stairs = {};

	delete level.scene;
	delete level.build;
	delete level.css_renderer;
	delete level.loaded;
	
	this.save_current_loaded_level();
	this.builds[level.build_id][level.level_id] = level;//ЧТОББЫЛО
	return level;
};
//------------------------------------------------------------------------------------------//