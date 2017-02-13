//FME2 EDITOR MAIN
class FME2_EDITOR
{
	//rooms = {get_func,idkey,namekey,surfkey}
	constructor(container, data, options, font, rooms, fps, dod)
	{
		this.editor_defs = 
		{
			line_size: 3, 
			line_color: 0xABCDEF, 

			surface_color: 0xCAF6F6,

			camera_center_x: 500, 
			camera_center_y: 500, 

			node_color: 0x000000, 
			node_size: 25,

			px_zoom: 30, 

			helper_length: 10000,

			selecter_rect_color: 0x6E77E2, 
			selected_object_color: 0x2F3FA7, 
			selected_object_color_first: 0xFF0000,

			door_width: 1, 
			door_length: 1, 
			door_color: 0xa3d4d4, 
			door_color_invisible: 0x000000,

			text_color: 0x000000, 
			text_size: 30,

			navi_node_color: 0x8F8F8F, 
			navi_node_new: 0x33CC66,
			navi_line_color: 0, 
			navi_node_opacity: 0.5,

			hover_color: 0x2F3FA7
		};

		this.render_container = container;

		data = this.convert_data(data);

		this.loadData(data, options, dod);

		//RENDER 
		var renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: false });
		//render size in onWindowResize
    	renderer.setClearColor(0xFFFFFF);
		this.renderer = renderer;
		this.renderer_top = container.clientTop;
		this.renderer_left = container.clientLeft;

		var renderer_element = container.appendChild(renderer.domElement);
		//this.render_offset = {x: renderer_element.offsetWidth, y: renderer_element.offsetHeight};
		$.extend(renderer_element.style, {});
		renderer_element.id = container.id + '_canvas';
		renderer.x_element_id = '#'+renderer_element.id;
		//$.extend(container.style, {width: renderer_element.width + "px", height: renderer_element.height + "px"});
		this.renderer_container = container;

		this.enabled_FPS = fps || false;

			this.stats = new Stats();
			//var stat_dom = container.appendChild(this.stats.dom);
			var stat_dom = document.body.appendChild(this.stats.dom);

			stat_dom.style.position = "absolute";
			stat_dom.style.display = 'none';
			stat_dom.id = 'fps';
			// stat_dom.style.top = "0px";
			// stat_dom.style.teft = "0px";
		if (fps)
		{
			stat_dom.style.display = 'block';
		}

		//this.font = font;
		this.rooms = rooms;
		this.getRooms = rooms.get_func || function(){return {};};

		this.init_vars();
		this.init_environment();
		this.init_opps();
		this.init_events();
		this.onWindowResize();

		this.oppext.hide_selecter_rect();

		// if (this.build_id != void 0 && this.level_id != void 0)
		// 	this.loadLevel(this.build_id, this.level_id);
	}

	//Extern define
	offsetLeft(){return 0;}
	offsetTop(){return 0;}
	showErrorFunction (title, message){alert(message);}
	onRenderResize(w, h){void(0);};

	updateRenderSize()
	{
		var el = $(this.renderer.x_element_id);
		var offs = el.offset();
		this.renderWidth = window.innerWidth - offs.left - this.offsetLeft();
		this.renderHeight =	window.innerHeight - offs.top - this.offsetTop();
		$.extend(this.render_container.style, {width: this.renderWidth + "px", height: this.renderHeight + "px"});
	}

	convert_data(data)
	{
		return data;
	}

	init_vars()
	{
		this.build_info = {};

		this.mouse_buffer = {x: 0, y: 0};

		//RAYCASTER OBJECTS
		this.raycaster = new THREE.Raycaster();
		this.ray_mouse = new THREE.Vector2();

		this.event_cluster = new X.EVENT_CLUSTER();
		this.extern_clicks = [];

		this.h = {
			node: 15,
			selecter: 25,
			surface: 5,
			wall: 10,
			text: 20,
			door: 20,
			navi_node: 35,
			navi_line: 30
		};

		this.updateInfoFunction = function(info){};
		this.info = {
			mouse_position_meter: {x:0, y:0}, 
			intersect: undefined, 
			hint: undefined
		};

		this.Enums = {
			STR: {WALL: 'WALL', SURFACE: 'SURFACE', NA: '[N/A]', UNKNOW:'UNKNOW', TRUE: 'TRUE', FALSE: 'FALSE'},
			Modes: {Connecting: 1, Noding: 0, Surfacing: 2}
		};

		this.level_unpacked_status = {};
	}


	init_environment()
	{
		var camera_center_x = this.camera_center_x;
		var camera_center_y = this.camera_center_y;

		//CAMERA
		this.cam_factor = 1;
		this.camera = new THREE.OrthographicCamera();//parameters sets in onWindowResize

		this.camera.position.set(camera_center_y, Math.max(camera_center_x, camera_center_y), camera_center_x);
		this.camera.x_reset_y = this.camera.position.y;
		this.camera.up = new THREE.Vector3(1, 0, 0);
		var camera_target = new THREE.Vector3(camera_center_y, 0, camera_center_x);
		var controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
		controls.target = camera_target;
		controls.mouseButtons = { ORBIT: undefined, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
		controls.enableRotate = false;
		controls.update();
		this.controls = controls;

		//SURFACE
		var geometry = new THREE.PlaneGeometry(X.INT32_MAX, X.INT32_MAX);
		var material = new THREE.MeshLambertMaterial({color: this.surface_color, side: THREE.FrontSide});
		var surface = new THREE.Mesh(geometry, material);
		surface.position.set(0, 0, 0);
		surface.rotation.set(-Math.PI / 2, 0, 0);
		surface.x_is_background = true;
		surface.x_type = 'background';
		surface.name = 'background';
		surface.x_id = -1;
		this.background = surface;

		this.ambient_light = new THREE.AmbientLight(0xFFFFFF);
		this.axis_helper = new THREE.AxisHelper(10000);

		//SELECTER
		geometry = new THREE.PlaneGeometry(1, 1);
		material = new THREE.MeshLambertMaterial({color: this.selecter_rect_color, side: THREE.FrontSide, opacity: 0.30, transparent: true});
		this.selecter_rect = new THREE.Mesh(geometry, material);
		this.selecter_rect.rotation.set(-Math.PI / 2, 0, 0);
	}

	loadData(data, options, dod)
	{
		options = options || {};
		var true_options = {};
		for (var k in this.editor_defs)
			if (options.hasOwnProperty(k))
				true_options[k] = options[k] || this.editor_defs[k];

		if (data == void 0 || data == null)
		{
			data = 
			{
				navi_nodes_bids: {},
				build_ids: [],//build ids
				colors: {type_ids: {}, subtypes: {}, count: 0},
				selected_color: {},
				wall_heights: {},
				build_id: undefined,
				level_id: undefined,
				options: {}
			};
		}

		options = {};
		if (dod)
			data.options = {};
		$.extend(options, data.options);
		$.extend(options, true_options);

		$.extend(options,
		{
			renderWidth: options.renderWidth || this.editor_defs.renderWidth,
			renderHeight: options.renderHeight || this.editor_defs.renderHeight
		});

		this.data = data;

		for (var k in this.data) if (k!='options') 
			this[k] = this.data[k];
			
		for (var k in this.editor_defs)
			this[k] = this.data.options[k] || this.editor_defs[k];

		this.reset_levels();
	}

	updatePrimaryData()
	{
		for (var k in this.data) if (k!='options') 
			this.data[k] = this[k];
	
		for (var k in this.editor_defs) 
			this.data.options[k] = this[k];
	
		delete this.data.options.renderWidth;
		delete this.data.options.renderHeight;
		delete this.data.builds;

		return this.data;
	}

	updateData()
	{
		this.pack_current_level();
	
		var prim = this.updatePrimaryData();

		//this.data.builds = this.builds;
	
		return {primary: prim, builds: this.builds};
	}

	//EVENTS
	init_events()
	{
		this.addRenderEventListener('mousedown', X.BIND(this.doMouseDown, this));
		this.addRenderEventListener('mouseup', X.BIND(this.doMouseUp, this));
		this.addRenderEventListener('mousemove', X.BIND(this.doMouseMove, this));

		//this.addRenderEventListener('click', this.doMouseClick);
		window.addEventListener('resize', X.BIND(this.onWindowResize, this), false);
	}

	addRenderEventListener(event_name, func)
	{
		$(this.renderer.x_element_id).bind(event_name, func);
	}

	addOnClick(func){this.extern_clicks.push(func);}

	doMouseClick(client_event)
	{
		this.event_cluster.doEvent('mouse_click', client_event);
		for (var f in this.extern_clicks)
			this.extern_clicks[f](client_event);
	}

	doMouseDown(client_event)
	{
		this.mouse_buffer = {x: client_event.clientX, y: client_event.clientY};
		this.event_cluster.doEvent('mouse_down', client_event);
	}

	doMouseUp(client_event)
	{
		this.event_cluster.doEvent('mouse_up', client_event);
		if (this.mouse_buffer.x == client_event.clientX && this.mouse_buffer.y == client_event.clientY)
			this.doMouseClick(client_event);
	}

	doMouseMove(client_event)
	{
		this.event_cluster.doEvent('mouse_move', client_event);
	}
	
	animate() 
	{
		requestAnimationFrame(X.BIND(this.animate, this));

		if (this.scene != void 0)
		{
			this.renderer.render(this.scene, this.camera);
			if (this.css_renderer != void 0)
				this.css_renderer.render(this.scene, this.camera);
			//if (this.enabled_FPS)
				this.stats.update();
		}
	}

	onWindowResize() 
	{
		this.updateRenderSize();
		var renderWidth = this.renderWidth;
		var renderHeight = this.renderHeight;
		$.extend(this.camera, 
		{
			left: renderWidth / -this.cam_factor,
			right: renderWidth / this.cam_factor,
			top: renderHeight / this.cam_factor,
			bottom: renderHeight / -this.cam_factor
		});

		this.camera.updateProjectionMatrix();

		this.renderer.setSize(renderWidth, renderHeight);
		if (this.css_renderer != void 0)
			this.css_renderer.setSize(renderWidth, renderHeight);

		if (this.onRenderResize != void 0)
			this.onRenderResize(renderWidth, renderHeight);
	}

	_clear_objs(types)
	{
		if ('node' == types || types == void 0)
		{
			for (var k in this.nodes)
				this.scene.remove(this.nodes[k].scene_obj);
			this.nodes = {};
			this.bids.node = 0;
		}

		if ('wall' == types || types == void 0)
		{
			for (var k in this.walls)
				this.scene.remove(this.walls[k].scene_obj);
			this.walls = {};
			this.bids.wall = 0;
		}

		if ('surface' == types || types == void 0)
		{
			for (var k in this.surfaces)
				this.scene.remove(this.surfaces[k].scene_obj);
			this.surfaces = {};
			this.bids.surface = 0;
		}
	}

	_extentder_levels(builds, ext, keys)
	{
		for (var b in builds)
		{
			for (var l in builds[b])
			{
				var obj = builds[b][l];
				if (keys != void 0)
					for (var k in keys)
						obj = obj[keys[k]];
				$.extend(obj, ext);
			}
		}
	}

	_reset_navi_node_bid(b)
	{
		this.navi_nodes_bids[b] = 1;
	}

	_fps_show()
	{
		$('#fps').show();
	}

	_fps_hide()
	{
		$('#fps').hide();
	}
};
//------------------------------------------------------------------------------------------//