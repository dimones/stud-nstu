//EVENTS NODE MODE
function ANCHMOD_1M()
{
	node_mode.M1M = true;
	node_mode.MM1 = false;
}

function ANCHMOD_M1()
{
	node_mode.M1M = false;
	node_mode.MM1 = true;
}

function updateNodeMode()
{
	if (node_mode.line_count < 2)
		ANCHMOD_M1();
	else
		ANCHMOD_1M();
}

function onCloseNodeMode()
{
	// var ex = document.getElementById('add_node_x-' + 0);
	// var ey = document.getElementById('add_node_y-' + 0);
	// if (ex == null || ex == undefined || ey == null || ey == undefined) 
	// 	cf = true;
	// else
	// {
	// 	ex = parseFloat(ex.value);
	// 	ey = parseFloat(ey.value);
	var cf;
	//isNaN(ex) && isNaN(ey) &&
	if (node_mode.line_count < 2)
		cf = true;
	else
		cf = true;//X.PROCONF('confirm',"WARNING! DATA WILL LOST. CLOSE?");
	// }

	if (cf == undefined) return;
	node_mode.with_save = false;
	$('#modal_node_mode').modal('hide');
}

//SHIT CODING
function onNodeMode(clear_only, __moded__)
{
	if (!enabled_mode.node && !enabled_mode.navi.node)
	{
		node_mode_opps(enabled_mode.navi.force);
		return;
	}
	var nsl = editor.getSelectedNodes().length;
	if (__moded__ != true && node_mode.with_save)
	{
		if (nsl < 2)
		{
			onNodeMode(false, true);
			return;
			// if (node_mode.M1M)
			// {
			// 	var cf = X.PROCONF('confirm',"WARNING! MODE CHANGED FROM 1->M TO M->1. NEED CLEAR. CLEAR?");
			// 	if (cf == undefined) return;
			// 	node_mode.with_save = false;
			// }

		}
		else
		{
			if (node_mode.MM1)
			{
				var cf = X.PROCONF('confirm',"WARNING! MODE CHANGED FROM M->1 TO 1->M. NEED CLEAR. CLEAR?");
				if (cf == undefined) return;
				node_mode.with_save = false;
			}
		}
		onNodeMode(false, true);
		return;
	}

	if (nsl < 2)
	{
		//$('#node_mode_title').html('ADDING NODES. M->1.' + (nsl == 0?'':' SELECTED NODES ' + nsl +'.<br>RELATIVE COORDINATES!'));
		$('#node_mode_add_line').show();
		ANCHMOD_M1();
	}
	else
	{
		//$('#node_mode_title').html('ADDING NODES. 1->M. SELECTED NODES ' + nsl + '.<br>RELATIVE COORDINATES!');
		//$('#node_mode_add_line').hide();
		$('#node_mode_add_line').show();
		ANCHMOD_1M();
	}

	if (!node_mode.with_save || clear_only)
	{
		var grant = true;
		if (clear_only == true)
		{
			var cf = X.PROCONF('confirm',"CLEAR?");
			if (cf == undefined) grant = false;
		}
		if (grant)
		{
			var inject = 
			'<tr id="add_nodes_line-0">'+
			'<td>1</td>'+
			'<td><input class="form-control input" type="number" step="any" value="0" id="add_node_x-0"></td>'+
			'<td><input class="form-control input" type="number" step="any" value="0" id="add_node_y-0"></td>'+
			'<td><a class="btn btn-raised btn-danger" href="javascript:onRemoveNodeLine(0);"><i class="material-icons">delete</i></a></td>'+
			'</tr>'+
			'<tr id="add_nodes_line-1">'+
			'</tr>';
			$('#node_mode_tbody').html(inject);
			node_mode.bid = 1;
		}
		$('#invert').prop('checked', false);
	}
	if (clear_only != true)
		$('#modal_node_mode').modal({backdrop: 'static', keyboard: false});

}

function onRemoveNodeLine(nid)
{
	$('#add_nodes_line-' + nid).replaceWith('');
	node_mode.line_count--;
	updateNodeMode();
}

function onAddNodeLine()
{
	var nid = node_mode.bid;
	var replace = '<tr id="add_nodes_line-' + nid + '"><td>' + (nid + 1) + '</td>' + 
	'<td><input class="form-control input" type="number" step="any" value="0" id="add_node_x-' + nid + '"></td>' + 
	'<td><input class="form-control input" type="number" step="any" value="0" id="add_node_y-' + nid + '"></td>' + 
	'<td><a class="btn btn-raised btn-danger" href="javascript:onRemoveNodeLine(' + nid + ');">' + 
	'<i class="material-icons">delete</i></a></td></tr><tr id="add_nodes_line-' + (nid + 1) + '"></tr>';
	var eid = '#add_nodes_line-' + nid.toString();
	$(eid).replaceWith(replace);
	node_mode.bid++;
	node_mode.line_count++;
	updateNodeMode();
}

function onAddNodes()
{
	var xys = [];
	var invert = $('#invert').prop('checked');
	for (var i = 0; i < node_mode.bid; i++) 
	{
		var point = {};
		var ex = document.getElementById('add_node_x-' + i);
		var ey = document.getElementById('add_node_y-' + i);
		if (ex == null || ex == undefined || ey == null || ey == undefined) continue;
		point.x = parseFloat(ex.value);
		point.y = parseFloat(ey.value);
		if (isNaN(point.x) || isNaN(point.y))
		{
			showError('Parse Error','Values must be float. Line #' + (i+1));
			return;
		}
		// var tcn = editor.toCloseToNodes(point);
		// if (tcn != undefined)
		// {
		// 	showError('Value Error','To close to node #' + tcn.id + '. Line #' + (i+1));
		// 	return;
		// }
		if (invert)
		{
			point.x = -point.x;
			point.y = -point.y;
		}
		xys.push(point);
	}

	var selected_nodes = enabled_mode.node ? editor.getSelectedNodes() : 
	(enabled_mode.navi.node ? editor.getSelectedNaviNodes() : undefined);
	if (selected_nodes != void 0 && selected_nodes.length > 0)
	{
		for (var n in selected_nodes)
		{
			var position = enabled_mode.navi.node ? selected_nodes[n].position : selected_nodes[n].scene_obj.position;
			var fp = editor.getPositionMeters(position);
			for (var k in xys)
			{	
				fp.x += xys[k].x;
				fp.y += xys[k].y;
				if (enabled_mode.node)
					editor.addNode({x: fp.x, y: fp.y});
				if (enabled_mode.navi.node)
					editor.naviCreateNode({x: fp.x, y: fp.y});
			}
		}
	}
	else
	{
		for (var k in xys)
		{
			if (enabled_mode.node)
				editor.addNode(xys[k]);
			if (enabled_mode.navi.node)
				editor.naviCreateNode(xys[k]);
		}
	}
}

//CRIMINAL FUNCTION [LOW LEVEL]
function cheat_surfaces()
{
	var nodes = editor.getSelectedNodes();

	function getp(node) { return {x: node.scene_obj.position.z.toFixed(2), y: node.scene_obj.position.x.toFixed(2)};}

	function find_xy(x, y)
	{
		for (var n in nodes)
		{
			var node = nodes[n];
			var p = getp(node);
			if (p.x == x && p.y == y)
				return node;
		}
		return undefined;
	}

	function get_surface(fnode)
	{
		var p = getp(fnode);
		var mx = X.INT32_MAX;
		var my = X.INT32_MAX;
		var cnx, cny, l, node, np;
		for (var n in nodes)
		{
			node = nodes[n];
			np = getp(node);
			if (np.y == p.y)
			{
				l = np.x - p.x;
				if (l>0 && l<mx)
				{
					cnx = node;
					mx = l;
				}
			}
			if (np.x == p.x)
			{
				l = np.y - p.y;
				if (l>0 && l<my)
				{
					cny = node;
					my = l;
				}
			}
		}
		if (!X.VOID0([cnx, cny]))
		{
			var n4 = find_xy(getp(cnx).x, getp(cny).y);
			if (n4 != void 0)
				return [fnode.id, cnx.id, n4.id, cny.id];
			else
				return undefined;
		}
	}

	for (var n in nodes)
	{
		var node = nodes[n];
		var ids = get_surface(node);
		if (ids != void 0)
			editor.createSurface(ids);
	}
}

function navi_node_move()
{
	var node = editor.getSelectedNaviNodes()[0];
	if (node == void 0) return;

	var prms = X.PROCONF('promt','Navi node move [crime / need reboot after update]:\n[~]x [~]y meters');
	if (prms == void 0) return;

	prms = String(prms).split(' ');
	if (prms.length != 2) return;
	var px = editor.px_zoom;
	var a1, a2;
	if (prms[0][0] == '~')
	{
		a1 = true;
		prms[0] = String(prms[0]).substr(1);
	}
	if (prms[1][0] == '~')
	{
		a2 = true;
		prms[1] = String(prms[0]).substr(1);
	}
	var x = parseInt(prms[0])*px;
	var y = parseInt(prms[1])*px;

	if (a1)
		node.position.setZ(node.position.z + x);
	else
		node.position.setZ(x);

	if (a2)
		node.position.setX(node.position.x + y);
	else
		node.position.setX(x);
}

function navi_redistance()
{
	alert(editor.naviReDistance());
}

function fillPortals()
{
	var portals = editor.getPortalsGates(selected_build_id).portals;
	$('#portals_table').html('');
	var html = '';
	var pattern =
		'<tr class="info" onclick="showPortal({x},{x},{x});">'/
			'<td>{x}</td>'/
			'<td>{x}</td>'/
			'<td>{x}</td>'/
			'<td>{x}</td>'/
			'<td>{x}</td>'/
		'</tr>';
	for (var i in portals)
	{
		var p = portals[i];
		var w = p.w.toFixed(2);
		html += X.FORMAT(pattern, [p.f.node_id, p.t.node_id, w, p.f.id, p.f.l, p.t.id, p.t.l, w]);
	}
	$('#portals_table').html(html);
}

function showPortal(fid, tid, w)
{
	X.GEBI('navi_fid').value = fid;
	X.GEBI('navi_tid').value = tid;
	X.GEBI('navi_w').value = w;
}

function portalSet()
{
	var fid = X.GEBI('navi_fid').value;
	var tid = X.GEBI('navi_tid').value;
	var w = X.GEBI('navi_w').value;

	fid = parseInt(fid);
	tid = parseInt(tid);
	w = parseInt(w);

	try
	{
		if (w > 0)
			editor.naviPortal(fid, tid, w);
		else
			editor.naviDisconnectIDs(fid, tid, true);
	}
	catch (err)
	{
		showError('Portal Error', err.message);
	}
	fillPortals();
}