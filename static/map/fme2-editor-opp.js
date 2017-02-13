//FME2 EDITOR OPPORTUNITYES
//ADDITIONAL FUNCS FOR OPPS
FME2_EDITOR.prototype.oppext = {
	clear_selected_objects: function()
	{
		if (this.oppext.selected_objects == void 0) this.oppext.selected_objects = [];
		this.oppext.last_selected_object = this.oppext.selected_objects[this.oppext.selected_objects.length - 1];
		if (this.oppext.selected_objects.length == 0) return;
		for (var k in this.oppext.selected_objects)
			this.oppext.remove_selected_object(this.oppext.selected_objects[k], true);
		this.oppext.selected_objects = [];
		//this.oppext.last_selected_object = undefined;
	},
	push_selected_object: function(obj, color)
	{
		if (obj.material == void 0) return;
		obj.material.color.setHex(color || this.selected_object_color);
		this.oppext.selected_objects.push(obj);
		this.oppext.selected_object = obj;
	},
	remove_selected_object: function(obj, not_use_delete)
	{
		obj.material.color.setHex(obj.x_color);
		if (not_use_delete == false)
			delete this.oppext.selected_objects[obj];
	},
	hide_selecter_rect: function()
	{
		this.selecting_rect_enabled = false;
		this.selecter_rect.position.set(0, -this.h.selecter, 0);
	},
	get_selected_nodes_of_type: function(type)
	{
		if (type == 'node')
			return this.getSelectedNodes();
		if (type == 'navi_node')
			return this.getSelectedNaviNodes();
		return undefined;
	},
	connect_nodes_of_type: function(type, n1, n2)
	{
		if (type == 'node')
			return this.connectNodes(n1, n2);
		if (type == 'navi_node')
			return this.naviConnectNodes(n1, n2);
		return false;
	},
	selecter_rect: function(obj, cz, cx, sz, sx, select)
	{
		//var obj = this.scene.children[k];
		if (obj.x_id == NaN || obj.x_is_background) return;

		var granted = false;
		if (obj.x_type == 'node' && select.node)
			granted = true;
		if (obj.x_type == 'wall' && select.wall)
			granted = true;
		if (obj.x_type == 'surface' && select.surface)
			granted = true;
		if (obj.x_type == 'door' && select.door)
			granted = true;
		if (obj.x_type == 'navi_node' && select.navi_node)
			granted = true;
		if (obj.x_type == 'navi_line' && select.navi_line)
			granted = true;

		if (!granted) return;

		var px = obj.position;
		var pz = px.z; 
		px = px.x;

		if (pz >= cz && px >= cx && pz <= sz && px <= sx)
			this.oppext.push_selected_object(obj);
	},
	clear_hover: function()
	{
		if (this.oppext.hover_obj == void 0) return;
		this.oppext.hover_obj.material.color.setHex(this.oppext.hover_obj.x_color);
	}
};

//FME2 EDITOR OPPS FUNCS
FME2_EDITOR.prototype.init_opps = function()
{

	for (var k in this.oppext)
		this.oppext[k] = X.BIND(this.oppext[k], this);
	this.oppext.multiselect_clicker = false;

	//EXEC EVENTS AS ADDED
	this.event_cluster.addOppEvent('infomer', this,
	{
		enable: function()
		{
			this.oppext.hover_enabled = true;
		},
		mouse_move: function(client_event)
		{
			var intersects = this.rayGetIntersects(client_event);
			if (intersects.length == 0) return;
			this.info.intersect = intersects[0];
			var p = this.info.intersect.point;
			this.info.mouse_position_meter = {x: (p.z / this.px_zoom).toFixed(2), y: (p.x / this.px_zoom).toFixed(2)};
			this.info.hint = '';
			var obj = undefined;
			var selected = this.oppext.selected_objects;
			if (selected.length == 1)
			{
				obj = selected[0];
				this.info.hint = '[selected] ';
			}

			var hover = this.oppext.hover_enabled;

			if (!(this.info.intersect.object.x_is_background))
			{
				obj = this.info.intersect.object;
				this.info.hint = '';

				if (selected.length == 0)
				{
					this.oppext.clear_hover();

					if (hover)
					{
						this.oppext.hover_obj = obj;
						obj.material.color.setHex(this.hover_color);
					}
				}
			}
			else if (selected.length == 0)
					this.oppext.clear_hover();

			if (obj != undefined)
			{
				this.info.hint += 'type:' + obj.x_type + ' id:' + obj.x_id + 
				' x:' + (obj.position.z/editor.px_zoom).toFixed(2) + ' y:' + (obj.position.x/editor.px_zoom).toFixed(2);
				if (obj.x_type == 'wall' || obj.x_type == 'navi_line')
					this.info.hint += ' length:' + (obj.x_length / this.px_zoom).toFixed(2);
			}
		}
	});
	this.event_cluster.Enable('infomer');

	this.event_cluster.addOppEvent('selecter_clicker', this,
	{
		enable: function(select)
		{
			select = select || {};
			select.multiselect = select.multiselect || false
			this.oppext.selecter_clicker_select = select;
			this.oppext.clear_selected_objects();
		},
		mouse_click: function(client_event)
		{
			if (client_event.button != 0) return;
			var select = this.oppext.selecter_clicker_select;

			var object = this.info.intersect.object;

			var color = this.selected_object_color;
			var btn = this.oppext.multiselect_clicker;
			if (select.multiselect)
				btn = true;
			if (!btn)
				this.oppext.clear_selected_objects();
			else if (this.oppext.selected_objects.length == 0 && object.x_type == 'node')
				color = this.selected_object_color_first;

			var granted = false;
			if (object.x_type == 'node' && select.node)
				granted = true;
			if (object.x_type == 'wall' && select.wall)
				granted = true;
			if (object.x_type == 'surface' && select.surface)
				granted = true;
			if (object.x_type == 'door' && select.door)
				granted = true;
			if (object.x_type == 'navi_node' && select.navi_node)
				granted = true;
			if (object.x_type == 'navi_line' && select.navi_line)
				granted = true;
			
			if (!object.x_is_background && granted)
				this.oppext.push_selected_object(object, color);
			else
			{
				this.oppext.last_selected_node = undefined;
				this.oppext.clear_selected_objects();
			}
		},
		disable: function()
		{
			this.oppext.clear_selected_objects();
		}
	});
	//this.event_cluster.Enable('selecter_clicker');

	this.event_cluster.addOppEvent('icon_clicker', this,
	{
		mouse_click: function()
		{
			var selected = this.oppext.selected_object;
			if (selected.x_type != 'surface')
				return;
			var icon_name = this.selected_icon == void 0 ? undefined : this.selected_icon.name;
			var surface = selected.x_obj;
			var text = undefined;

			//CLASSES DISABLED
			if (surface.room_id != void 0)
				return;
				//text = this.getRooms()[surface.room_id][this.rooms.namekey];

			if (surface.icon_name == void 0 && icon_name != void 0)
			{
				if (surface.text_mesh != void 0)
					this.scene.remove(surface.text_mesh);
				this.createTextMesh(text, surface, icon_name);
			}
			else
			{
				if (icon_name == void 0)
					$('#icon-' + surface.id).hide();
				else
				{
					$('#icon-' + surface.id).show();
					X.GEBI('icon-' + surface.id).src = this.selected_icon.file;
				}
			}

			surface.icon_name = icon_name;
		}
	});

	this.event_cluster.addOppEvent('navi_linker', this,
	{
		mouse_click: function()
		{
			//var selected_nodes = this.getSelectedNodes();
			var selected = this.oppext.selected_object;
			var last_selected = this.oppext.last_selected_object;

			if (selected.x_navi_node == void 0 && selected.x_type != 'navi_node')
				this.naviCreateNode({x: selected.position.z / this.px_zoom, y: selected.position.x / this.px_zoom}, selected);
			
			//if (selected != void 0 && last_selected != void 0 && last_selected != selected && selected.x_navi_node != void 0 && last_selected.x_navi_node != void 0)
			if (last_selected != selected && !X.VOID0([selected, last_selected]) && !X.VOID0([selected.x_navi_node, last_selected.x_navi_node]))
					this.naviConnectNodes(selected.x_navi_node, last_selected.x_navi_node);
		}
	});

	this.event_cluster.addOppEvent('selecter_rect', this,
	{
		enable: function(select)
		{
			select = select || {};
			this.oppext.selecter_rect_select = select;
			this.oppext.clear_selected_objects();
			this.selecting_rect_enabled = false;
		},
		mouse_down: function(client_event)
		{
			if (client_event.button != 0) return;
			//this.oppext.clear_selected_objects();
			this.selecting_rect_enabled = true;
			this.selecting_bp = this.info.intersect.point; //this.rayGetIntersects(client_event)[0].point;
			//this.selecter_rect.scale.set(0.1, 0.1);
			this.oppext.hover_enabled = false;
			this.oppext.clear_hover();
		},
		mouse_move: function(client_event)
		{
			if (!this.selecting_rect_enabled) return;
			this.selecting_ep = this.info.intersect.point; //this.rayGetIntersects(client_event)[0].point;
			var cx = (this.selecting_bp.x + this.selecting_ep.x) / 2;
			var cz = (this.selecting_bp.z + this.selecting_ep.z) / 2;
			var sx = Math.abs(this.selecting_bp.x - this.selecting_ep.x);
			var sz = Math.abs(this.selecting_bp.z - this.selecting_ep.z);
			this.selecter_rect.position.set(cx, this.h.selecter, cz);
			this.selecter_rect.scale.set(sx, sz);

			this.oppext.clear_selected_objects();
			cx -= sx / 2;
			cz -= sz / 2;
			sx = cx + sx;
			sz = cz + sz;
			var select = this.oppext.selecter_rect_select;
			for (var k in this.scene.children)
				this.oppext.selecter_rect(this.scene.children[k], cz, cx, sz, sx, select);
			for (var k in this.navi.group.children)
				this.oppext.selecter_rect(this.navi.group.children[k], cz, cx, sz, sx, select);
		},
		mouse_up: function(client_event)
		{
			this.oppext.hide_selecter_rect();
			this.oppext.hover_enabled = true;
		},
		disable: function()
		{
			this.oppext.hide_selecter_rect();
			this.oppext.clear_selected_objects();
		}
	});
	//this.event_cluster.Enable('selecter_rect');

	this.event_cluster.addOppEvent('connecter', this,
	{
		enable: function(p)
		{
			this.oppext.clear_selected_objects();
			this.oppext.last_selected_node = undefined;
			this.oppext.connecter_type = p;
		},
		mouse_click: function()
		{
			//var selected_nodes = this.getSelectedNodes();
			var selected_nodes = this.oppext.get_selected_nodes_of_type(this.oppext.connecter_type);
			if (selected_nodes == void 0 || selected_nodes.length == 0)
			{
				this.oppext.last_selected_node = undefined;
				return;
			}
			if (this.oppext.last_selected_node != void 0)
			{
				var n1 = this.oppext.last_selected_node;
				var n2 = selected_nodes[0];
				if (n2 == void 0) return;
				this.oppext.connect_nodes_of_type(this.oppext.connecter_type, n1, n2);
			}
			this.oppext.last_selected_node = selected_nodes[0];
		},
		disable: function()
		{
			//this.oppext.clear_selected_objects();
		}
	});
	//this.event_cluster.Enable('connecter');

	this.event_cluster.addOppEvent('dooring', this,
	{
		enable: function()
		{
			this.oppext.clear_selected_objects();
		},
		mouse_click: function(p)
		{
			var intersect = this.info.intersect;
			if (intersect.object.x_type != 'wall')
				return;
			var wall = intersect.object.x_obj;
			var p = intersect.point;
			this.addDoor({x:p.z / this.px_zoom, y:p.x / this.px_zoom}, wall);
			this.oppext.clear_selected_objects();
		},
		disable: function()
		{
			//this.oppext.clear_selected_objects();
		}
	});

	this.event_cluster.addOppEvent('surfacing', this,
	{
		enable: function()
		{
			this.oppext.clear_selected_objects();
		},
		mouse_click: function()
		{
			var selected_nodes = this.getSelectedNodes();

			var n1 = selected_nodes[0];
			if (n1 == undefined) return;
			var n2 = selected_nodes[selected_nodes.length - 1];
			if (n2 == undefined) return;
			if (n1 === n2 && selected_nodes.length > 3)
			{
				this.createSurface(X.GET_VALUES_OF_KEYS_IN_DIC(selected_nodes,'id'));
				this.oppext.clear_selected_objects();
			}
		},
		disable: function()
		{
			this.oppext.clear_selected_objects();
		}
	});
	//this.event_cluster.Enable('surfacing');

	//this.event_cluster.addOppEvent('rooming', this,
	//{
		// enable: function()
		// {
		// 	this.oppext.selected_room = undefined;
		// },
		// mouse_click: function()
		// {
		// 	var selected_surface = this.getSelectedSurfaces()[0];
		// 	if (selected_surface == void 0)
		// 	{
		// 		this.oppext.selected_room = null;
		// 		return;
		// 	}
		// 	this.oppext.selected_room = undefined;
			
		// 	rooms = this.getRooms();

		// 	if (rooms == void 0)
		// 		return;

		// 	this.oppext.selected_room = rooms[selected_surface.room_id];
		// },
		// disable: function()
		// {
		// 	this.oppext.selected_room = undefined;
		// }
	//});

	this.event_cluster.addOppEvent('mouse_move_call_update', this,
	{
		mouse_move: function(client_event)
		{
			var selected_nodes = this.getSelectedNodes();

			if (selected_nodes.length == 2)
			{
				var p1 = selected_nodes[0].scene_obj.position;
				var p2 = selected_nodes[1].scene_obj.position;
				this.info.hint = X.FORMAT('lengths: % : % = %',
					[((p2.z - p1.z) / this.px_zoom).toFixed(2), ((p2.x - p1.x) / this.px_zoom).toFixed(2), (p1.distanceTo(p2) / this.px_zoom).toFixed(2)], '%');
			}
			this.updateInfoFunction(this.info);
		}
	});
	this.event_cluster.Enable('mouse_move_call_update');
};
//------------------------------------------------------------------------------------------//