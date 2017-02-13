//EVENTS COLORS
function onSelectColor(type, id)
{
	editor.setSelectedColor(type, id);
	var selected;
	if (type == 'SURFACE')
		selected = editor.getSelectedSurfaces();
	if (type == 'WALL')
		selected = editor.getSelectedWalls();
	editor.clearSelectedObjects();
	editor.setObjectsColorToColor(selected, editor.getSelectedColor(type), true);
	reloadColors(type);
}

function loadColors(element_id_selected_color, element_id_menu_color, color_type)
{
	var prot = String('{0}{1} <div style="width: 30px; height: 10px; background: #{2}; display: inline-block;"></div>\n');

	var selected = editor.getSelectedColor(color_type);
	var h = editor.getWallHeightByColorID(selected.id);
	var element = document.getElementById(element_id_selected_color);//$('#' + element_id_selected_color);
	if (selected == undefined)
		element.innerHTML = color_type + ": NOT SELECTED";
	else
		element.innerHTML = 
	prot
	.replace('{0}', selected.type + ': ')
	.replace('{1}', selected.subtype + (h == void 0 ? '' : ' [' + h.toFixed(2) + ']'))
	.replace('{2}', X.STR_FILL_TO_LENGTH(String(selected.color.toString(16)),'0',6,'left'));

	element = document.getElementById(element_id_menu_color);//$('#' + element_id_menu_color);

	element.innerHTML = '';
	if (editor.colors.type_ids[color_type] != undefined)
	{
		for (var st_id in editor.colors.type_ids[color_type])
		{
			var subtype = editor.colors.subtypes[editor.colors.type_ids[color_type][st_id]];
			h = editor.getWallHeightByColorID(subtype.id);
			element.innerHTML += "<li><a href=\"javascript:onSelectColor('"+ subtype.type + "', '" + subtype.id + "');\">" +
			prot
			.replace('{0}', '')
			.replace('{1}', subtype.subtype + (h == void 0 ? '' : ' [' + h.toFixed(2) + ']'))
			.replace('{2}', X.STR_FILL_TO_LENGTH(String(subtype.color.toString(16)),'0',6,'left')) + '</a></li>\n';
		}
	}

	colors_elements_ids[color_type] = {sel: element_id_selected_color, menu: element_id_menu_color};
}

function reloadColors(type){loadColors(colors_elements_ids[type].sel, colors_elements_ids[type].menu, type);}

function visibity_wall_height(type)
{
	if (type == editor.Enums.STR.WALL)
	{
		$('#add_wall_height_label').show();
		$('#add_wall_height').show();
		$('#warning_main_color_wall').show();
		document.getElementById('add_wall_height').value = '1';
	}
	else
	{
		$('#add_wall_height_label').hide();
		$('#add_wall_height').hide();	
		$('#warning_main_color_wall').hide();
	}
}

function onAddColor(type)
{
	visibity_wall_height(type);
	$('#add_color_type').html(type);
	document.getElementById('add_color_sb_name').value = '';
	$('#add_color_picker').colorpicker('setValue', '#00AABB');
	var addbtn = $('#add_color_btn');
	addbtn.attr('onclick',"addColor('" + type + "','add');");
	addbtn.html('ADD');
	$('#modal_add_color').modal('show');
}

function onEditColor(type)
{
	visibity_wall_height(type);
	$('#add_color_type').html(type);
	var selected_color = editor.getSelectedColor(type);
	if (selected_color == undefined) return;
	document.getElementById('add_color_sb_name').value = selected_color.subtype;
	var h = editor.getWallHeightByColorID(selected_color.id);
	document.getElementById('add_wall_height').value = h;
	var colorstyle = X.STR_FILL_TO_LENGTH(String(selected_color.color.toString(16)),'0',6,'left');
	$('#add_color_picker').colorpicker('setValue', colorstyle);
	var addbtn = $('#add_color_btn');
	addbtn.attr('onclick',"addColor('" + type + "','replace');");
	addbtn.html('CHANGE');
	$('#modal_add_color').modal('show');
}

function addColor(type, mode)
{
	var subtype = document.getElementById('add_color_sb_name').value;
	var color = parseInt(document.getElementById('add_color').value.substring(1), 16);
	var repl_mode = mode == 'replace';
	var h = document.getElementById('add_wall_height').value;
	h = type == editor.Enums.STR.WALL ? h : undefined;
	if (!repl_mode)
		if (editor.addColor(type, subtype, color, h) == undefined) return;
	if (repl_mode)
	{
		var sid = editor.getSelectedColor(type).id;
		if (editor.editColor(sid, subtype, color, h) == undefined) return;
		editor.setSelectedColor(type, sid);
	}

	reloadColors(type);
	$('#modal_add_color').modal('hide');
}