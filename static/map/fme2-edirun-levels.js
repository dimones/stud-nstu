//LEVEL SELECTER
function reload_level_selecters(bdids, build_id, level_id)
{
	load_build_selector(bdids);
	if (build_id != null || build_id != void 0)
	{
		onSelectBuild(build_id, function(level_id)
		{
			if (level_id != null || level_id != void 0)
				onSelectLevel(level_id);
		},[level_id]);
	}
}

function load_build_selector(bdids)
{
	$('#selected_build_id').html('UNSELECTED');
	var menu = document.getElementById('builds_dropdown_menu');
	menu.innerHTML = '';
	for (var k in bdids)
		menu.innerHTML += '<li><a href="javascript:onSelectBuild(' + bdids[k] + ');">BUILD ' + bdids[k] + '</a></li>';
}

function load_level_selector(levels)
{
	selected_level_id = undefined;
	$('#selected_level_id').html('UNSELECTED');
	var menu = document.getElementById('levels_dropdown_menu');
	menu.innerHTML = '';
	for (var k in levels)
		menu.innerHTML += '<li><a href="javascript:onSelectLevel(' + k + ');">LEVEL ' + k + '</a></li>';
}

function on_select_build(build, build_id, callback, callback_args)
{
	$('#selected_build_id').html('BUILD ' + build_id);
	load_level_selector(build);
	selected_build_id = build_id;
	fillPortals();
	if (callback != void 0)
		callback.apply(this, callback_args);
}

function onSelectBuild(build_id, callback, callback_args)
{
	// if (editor.getBuild(build_id) == undefined)
	// {
	// 	db_load_rooms_of_build(build_id, 
	// 		function()
	// 		{
	// 			db_load_source_rooms_of_build(build_id,
	// 				function()
	// 				{
	// 					db_load_data(bt(build_id, current_type),
	// 						function(data_b)
	// 						{
	// 							editor.setBuild(data_b, build_id);
								
	// 							db_get_navi_nodes_build(build_id, 
	// 								function(nodes)
	// 								{
	// 									editor.naviExtendNodes(nodes);

	// 									on_select_build(data_b, build_id, callback, callback_args);
	// 								});
	// 						});
	// 				});
	// 		});
	// }
	// else
	// {
	// 	on_select_build(editor.getBuild(build_id), build_id, callback, callback_args);
	// }

	if (editor.getBuild(build_id) == undefined)
	{
		db_get_build_nana(build_id, 
			function()
			{
				db_load_data(bt(build_id, current_type),
					function(data_b)
					{
						editor.setBuild(data_b, build_id);

						on_select_build(data_b, build_id, callback, callback_args);
					});
			});
	}
	else
	{
		on_select_build(editor.getBuild(build_id), build_id, callback, callback_args);
	}
}

function onSelectLevel(level_id)
{
	editor.loadLevel(selected_build_id, level_id);
	$('#selected_level_id').html('LEVEL ' + level_id);
	selected_level_id = level_id;
	editor.postSurfaceTexts();
}

function onDeleteLevel()
{
	var conf = X.PROCONF('confirm','Delete level '+selected_build_id+'->'+selected_level_id);
	if (conf == void 0) return;

	editor.removeLevel(selected_build_id, selected_level_id);
	load_build_selector(editor.data.builds);
	$('#selected_level_id').html('UNSELECTED');
	document.getElementById('levels_dropdown_menu').innerHTML = '';
}

function promt_level_adress()
{
	var lvl = X.PROCONF('promt','Enter level adress');
	if (lvl == void 0) return undefined;
	lvl = lvl.split('-');
	lvl[0] = parseInt(lvl[0]);
	lvl[1] = parseInt(lvl[1]);
	if (isNaN(lvl[0]) || isNaN(lvl[1]))
	{
		showError('Input Error', 'Invalid value');
		return undefined;
	}
	return {build_id: lvl[0], level_id: lvl[1]};
}

function onAddLevel()
{
	var bl = promt_level_adress();
	if (bl == void 0) return;

	if (editor.createLevel(bl.build_id, bl.level_id))
		reload_level_selecters(editor.data.builds, bl.build_id, bl.level_id);
}

function onCopyLevel()
{
	var bl = promt_level_adress();
	if (bl == void 0) return;

	if (editor.copyLevel(bl.build_id, bl.level_id))
	{
		onSaveData(data_type_key);
		$.snackbar({content: 'RELOADING ['+data_type_key+']', style: 'toast', timeout: 10000});
		setTimeout(function (){location.reload();}, 3000);
	}
}