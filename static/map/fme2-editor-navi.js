FME2_EDITOR.prototype.naviInit = function()
{
	this.navi = {nodes: {}, mesh:{line: {}, node:{}}, removed_nodes:[]};
};

// FME2_EDITOR.prototype.naviSetData = function(nodes)
// {
// 	//this.navi_data.bid = nodes[-1].build;
// 	this.naviExtendNodes(nodes);
// }

FME2_EDITOR.prototype.getNavi = function()
{
	return {'nodes': this.navi.nodes, 'removed_nodes': this.navi.removed_nodes};
};

FME2_EDITOR.prototype.naviResetRemovedNodes = function()
{
	this.navi.removed_nodes = [];
};

FME2_EDITOR.prototype.naviExtendNodes = function(nodes)
{
	for (var n in nodes)
	{
		var p = nodes[n].position;
		nodes[n].position = new THREE.Vector3(p.x, p.y, p.z);
		nodes[n].id = parseInt(nodes[n].id);
	}
	$.extend(this.navi.nodes, nodes);
};

FME2_EDITOR.prototype.naviLoadLevel = function()
{
	this.navi.group = new THREE.Object3D();
	this.navi.group.name = 'navi_group';
	for (var n in this.navi.nodes)
	{
		var node = this.navi.nodes[n];
		if (node.build != this.build_id || node.level != this.level_id)
			continue;

		var next = {};
		for (var c in node.next)
		{
			var w = parseInt(node.next[c]);
			c = parseInt(c);
			next[c] = w;
		}
		node.next = next;
		this.naviCreateNode(node.position, undefined, node);
	}

	for (var n1id in this.navi.nodes)
	{
		var node = this.navi.nodes[n1id];
		if (node.build != this.build_id || node.level != this.level_id)
			continue;
		for (var n2id in node.next)
			this.naviConnectNodes(node, this.navi.nodes[n2id], true, true, false);
	}

	this.naviVisible(this.navi.visible);

	this.scene.add(this.navi.group);
};

FME2_EDITOR.prototype.navi_create_empty_node = function(b, f, position)
{
	if (this.build_info[b] == void 0)
		this.build_info[b] = this.emptyBuildInfo(b);
	var id = this.build_info[b].NAVI_NODE_BID * 10000 + b * 100 + f;
	this.build_info[b].NAVI_NODE_BID++;
	var n = {
		id: id,
		next: {},
		build: b,
		level: f,
		position: new THREE.Vector3(position.x, position.y, position.z),
		room_id: null
	};
	return n;
};

FME2_EDITOR.prototype.navi_connect = function(n1, n2, w)
{
	n1.next[n2.id] = w;
	n2.next[n1.id] = w;
	return true;
};


FME2_EDITOR.prototype.naviCreateNode = function(point, link_obj, store_navi)
{
	if (link_obj != void 0 && link_obj.x_type == 'navi_line')
		return;
	if (store_navi == void 0)
	{
		point.x *= this.px_zoom;
		point.y *= this.px_zoom;
	}

	var pos = {x: point.y, y: this.h.navi_node, z: point.x};
	var close = this.navi_closest_nodes(pos);
	if (close.length != 0 && link_obj != void 0)
		return;

	var color = store_navi != void 0 ? this.navi_node_color : this.navi_node_new;
	var np = store_navi || this.navi_create_empty_node(this.build_id, this.level_id, pos);

	var mesh = this.create_node_mesh(np, np.position, color, 'navi_node', this.navi_node_opacity);
	mesh.name = 'navi_node-' + np.id;
	mesh.x_navi_node = np;

	if (link_obj != void 0)
	{
		mesh.x_navi_link_obj = link_obj;
		link_obj.x_navi_node = np;
		if (link_obj.x_obj.room_id != void 0)
			np.room_id = link_obj.x_obj.room_id;
	}

	this.navi.nodes[np.id] = np;
	this.navi.group.add(mesh);
	this.navi.mesh.node[np.id] = mesh;

	return np;
};

FME2_EDITOR.prototype.naviPortal = function(n1id, n2id, w)
{
	this.navi.nodes[n1id].next[n2id] = w;
	this.navi.nodes[n2id].next[n1id] = w;
};

// FME2_EDITOR.prototype.navi_connect_nodes_id = function(n1id, n2id, no_mesh)
// {
// 	this.naviConnectNodes(this.navi.nodes[n1id], this.navi.nodes[n2id], undefined, undefined, no_mesh);
// }

FME2_EDITOR.prototype.naviConnectNodes = function(n1, n2, no_connect, no_error, no_group_mesh)
{
	if (no_error != true)
		for (var n2id in n1.next)
		{
			if (n2.id == n2id)
			{
				this.showErrorFunction('Link error','Navi connection already exist!');
				return false;
			}
		}

	var nnid = X.ID21(n1.id, n2.id);
	if (this.navi.mesh.line[nnid] != void 0)
	{
		if (no_error != true)
			this.showErrorFunction('Link error','Navi line '+nnid+' already exist!');
		return false;
	}

	var line = this.create_wall_line3d(n1.position, n2.position, {id: nnid, n1: n1, n2: n2}, this.navi_line_color, 'navi_line');
	line.name = 'navi_line-'+n1.id+'-'+n2.id;
	line.position.setY(this.h.navi_line);
	this.navi.mesh.line[nnid] = line;

	if (no_group_mesh != true)
		this.navi.group.add(line);

	if (no_connect != true)
		return this.navi_connect(n1, n2, line.x_length / this.px_zoom);
	return true;
};

FME2_EDITOR.prototype.naviVisibleGet = function()
{
	return this.navi.visible;
};

FME2_EDITOR.prototype.naviVisible = function(to)
{
	this.navi.visible = to;

	if (this.navi.group != void 0)
		if (this.navi.visible == void 0 || this.navi.visible == true)
			this.navi.group.visible = true;
		else
			this.navi.group.visible = false;
};

//DELETING
FME2_EDITOR.prototype.naviDisconnectIDs = function(n1id, n2id, no_mesh)
{
	n1id = parseInt(n1id);
	n2id = parseInt(n2id);

	if (this.navi.nodes[n1id] != void 0)
		delete this.navi.nodes[n1id].next[n2id];
	if (this.navi.nodes[n2id] != void 0)
		delete this.navi.nodes[n2id].next[n1id];
	if (no_mesh != true)
	{
		var nnid = X.ID21(n1id,n2id);
		var mesh = this.navi.mesh.line[nnid];
		if (mesh != void 0)
		{
			var parent = mesh.parent;
			parent.remove(mesh);
			//mesh.visible = false;
		}
	}
};

FME2_EDITOR.prototype.naviRemoveNodeID = function(id)
{
	var node = this.navi.nodes[id];
	for (var n in node.next)
		this.naviDisconnectIDs(node.id, n);
	delete this.navi.nodes[id];
	this.navi.removed_nodes.push(id);
	var mesh = this.navi.mesh.node[id];
	if (mesh != void 0)
	{
		var parent = mesh.parent;
		parent.remove(mesh);
		//mesh.visible = false;
	}
};

FME2_EDITOR.prototype.removeSelectedNavi = function()
{
	this.removeSelectedNaviLines();
	this.removeSelectedNaviNodes();
};
FME2_EDITOR.prototype.removeSelectedNaviLines = function()
{
	var lines = this.getSelectedNaviLines();
	for (var l in lines)
	{
		var line = lines[l];
		this.naviDisconnectIDs(line.n1.id, line.n2.id);
	}
};
FME2_EDITOR.prototype.removeSelectedNaviNodes = function()
{
	var nodes = this.getSelectedNaviNodes();
	for (var n in nodes)
	{
		var node = nodes[n];
		this.naviRemoveNodeID(node.id);
	}
};
FME2_EDITOR.prototype.naviReDistance = function()
{
	var nodes = this.navi.nodes;
	for (var n in nodes)
	{
		var next = nodes[n].next;

		for (var nn in next)
			next[nn] = nodes[n].position.distanceTo(nodes[nn].position) / this.px_zoom;
		
		nodes[n].next = next;
	}
	return "Navi ReDistanced";
};

FME2_EDITOR.prototype.navi_closest_nodes = function(position)
{
	var p = new THREE.Vector3(position.x, position.y, position.z);
	var p = position;
	var nodes = this.navi.nodes;
	var closests = [];
	for (var n in nodes)
	{
		if (nodes[n].position.distanceTo(p) <= this.node_size)
			closests.push(nodes[n]);
	}
	return closests;
};

FME2_EDITOR.prototype.parseNodeID = function(id)
{
	var f = id % 100;
	id = Math.floor(id / 100);
	var b = id % 100;
	id = Math.floor(id / 100);
	return {id: id, b: b, l: f};
};

FME2_EDITOR.prototype.getPortalsGates = function(build_id)
{
	var portals = [];
	var gates = [];
	for (var n in this.navi.nodes)
	{
		var node = this.navi.nodes[n];
		var id = this.parseNodeID(node.id);
		var next = node.next;
		var f = {node_id: node.id, id: id.id, b: id.b, l: id.l};
		for (var nn in next)
		{
			var nnode = this.navi.nodes[nn];
			var nid = this.parseNodeID(nnode.id);
			var t = {node_id: nnode.id, id: nid.id, b: nid.b, l: nid.l};
			if (id.b == nid.b && id.b == build_id && id.l != nid.l)
				portals.push({f: f, t: t, w: next[nn]});
			if (id.b != nid.b)
				gates.push({f: f, t: t, w: next[nn]});
		}
	}
	return {portals: portals, gates: gates};
};
