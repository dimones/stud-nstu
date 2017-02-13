//EVENTS OPPS
var enabled_mode = {node: true, wall: false, surface: false, door: false, icon: false,
    navi: {node: false, line: false, force: false, link: false, remove: false}};

function clear_opps_classes()//fake! classes is background color
{
    // $('#node_mode_btn').removeClass('btn-primary');
    // $('#wall_mode_btn').removeClass('btn-primary');
    // $('#surface_mode_btn').removeClass('btn-primary');
    $('#door_mode').hide();
    $('#room_mode').hide();
    $('#navi_mode').hide();
    $('#navi_action').hide();
    $('#navi_action_mode').hide();
    $('#portals').hide();
    $('#icon_mode').hide();
    //$('#navi_visible_switch_btn').hide();

    $('#node_mode_btn').css('background', '#EEEEEE');
    $('#wall_mode_btn').css('background', '#EEEEEE');
    $('#door_mode_btn').css('background', '#EEEEEE');
    $('#surface_mode_btn').css('background', '#EEEEEE');
    $('#room_mode_btn').css('background', '#EEEEEE');
    $('#navi_link_mode_btn').css('background', '#EEEEEE');
    $('#icon_mode_btn').css('background', '#EEEEEE');

    enabled_mode.node = false;
    enabled_mode.wall = false;
    enabled_mode.surface = false;
    enabled_mode.door = false;
    enabled_mode.room = false;
    enabled_mode.icon = false;
    enabled_mode.navi.node = false;
    enabled_mode.navi.line = false;
    enabled_mode.navi.link = false;

    editor.disableOpp('selecter_rect');
    editor.disableOpp('connecter');
    editor.disableOpp('surfacing');
    editor.disableOpp('selecter_clicker');
    editor.disableOpp('dooring');
    editor.disableOpp('navi_linker');
    editor.disableOpp('icon_clicker');
}

function set_opp_selected_btn(id){$('#' + id).css('background', '#009688');}

//NODE
function node_mode_opps(to_navi_force)
{
    clear_opps_classes();
    set_opp_selected_btn('node_mode_btn');
    enabled_mode.node = true;
    enabled_mode.navi.force = false;

    $('#to_std_mode_btn').html('<i class="material-icons">fiber_manual_record</i>');
    $('#navi_mode').show();
    to_navi_mode_css(false);

    editor.enableOpp('selecter_rect',{node: true});
    editor.enableOpp('selecter_clicker',{node: true, multiselect: true});

    if (to_navi_force)
        navi_mode_opps();
}

//WALL
function wall_mode_oops(to_navi_force)
{
    clear_opps_classes();
    set_opp_selected_btn('wall_mode_btn');
    enabled_mode.wall = true;
    enabled_mode.navi.force = false;

    $('#to_std_mode_btn').html('<i class="material-icons">border_inner</i>');
    $('#navi_mode').show();
    to_navi_mode_css(false);

    editor.enableOpp('selecter_rect',{wall: true});
    editor.enableOpp('connecter', 'node');
    editor.enableOpp('selecter_clicker',{wall: true, node: true});

    if (to_navi_force)
        navi_mode_opps();
}
function onWallMode()
{
    wall_mode_oops(enabled_mode.navi.force);
}

//SURFACE
function surface_mode_oops()
{
    clear_opps_classes();
    set_opp_selected_btn('surface_mode_btn');
    enabled_mode.surface = true;
    enabled_mode.navi.force = false;

    editor.enableOpp('selecter_rect',{surface: true});
    editor.enableOpp('surfacing');
    editor.enableOpp('selecter_clicker',{node: true, surface: true, multiselect: true});
}
function onSurfaceMode()
{
    surface_mode_oops();
}

//DOOR
function door_mode_oops()
{
    clear_opps_classes();
    set_opp_selected_btn('door_mode_btn');
    enabled_mode.door = true;
    enabled_mode.navi.force = false;
    $('#door_mode').show();

    editor.enableOpp('selecter_rect',{door: true});
    editor.enableOpp('selecter_clicker',{door: true, wall: true, multiselect: true});
    editor.enableOpp('dooring');
}
function onDoorMode()
{
    door_mode_oops();
}
function setDoorModeVisible(v)
{
    editor.setVisisbleDoors(editor.getSelectedDoors(), v);
}

//ROOM
function room_mode_oops()
{
    clear_opps_classes();
    set_opp_selected_btn('room_mode_btn');
    enabled_mode.room = true;
    enabled_mode.navi.force = false;
    $('#room_mode').show();

    editor.enableOpp('selecter_clicker',{surface: true});
}
function onRoomMode()
{
    room_mode_oops();
}

//NAVI
function std_mode_opps()
{
    enabled_mode.navi.force = false;
    if (enabled_mode.navi.node)
        node_mode_opps();
    if (enabled_mode.navi.line)
        wall_mode_oops();
}
function navi_mode_opps()
{
    //clear_opps_classes();
    //set_opp_selected_btn('node_mode_btn');
    if (enabled_mode.node)
    {
        enabled_mode.navi.node = true;

        editor.enableOpp('selecter_rect',{navi_node: true});
        editor.disableOpp('connecter');
        editor.enableOpp('selecter_clicker',{navi_node: true, multiselect: true});
    }
    if (enabled_mode.wall)
    {
        enabled_mode.navi.line = true;

        editor.enableOpp('selecter_rect',{navi_line: true});
        editor.enableOpp('connecter', 'navi_node');
        editor.enableOpp('selecter_clicker',{navi_node: true, multiselect: true});
    }
    $('#navi_action').show();

    editor.disableOpp('surfacing');
    editor.disableOpp('dooring');
    editor.disableOpp('navi_linker');

    enabled_mode.node = false;
    enabled_mode.wall = false;
    enabled_mode.navi.force = true;

    //$('#node_mode').show();
    to_navi_mode_css(true);
}

//NAVI LINK
function navi_link_mode_oops()
{
    clear_opps_classes();
    set_opp_selected_btn('navi_link_mode_btn');
    enabled_mode.navi.link = true;
    enabled_mode.navi.force = false;

    $('#to_navi_link_mode_btn').css('background', '#009688');
    $('#to_navi_remove_mode_btn').css('background', '#EEEEEE');
    $('#navi_action').show();
    $('#navi_action_mode').show();
    $('#navi_visible_switch_btn').show();
    $('#portals').show();

    editor.enableOpp('selecter_clicker',{surface: true, door: true, navi_node: true, navi_line: true});
    editor.enableOpp('navi_linker');

    fillPortals();
}

//[SUBMODE OF NAVI LINK] NAVI REMOVE
function navi_remove_mode_oops()
{
    clear_opps_classes();
    set_opp_selected_btn('navi_link_mode_btn');
    enabled_mode.navi.remove = true;
    enabled_mode.navi.force = false;

    $('#to_navi_link_mode_btn').css('background', '#EEEEEE');
    $('#to_navi_remove_mode_btn').css('background', '#009688');
    $('#navi_action').show();
    $('#navi_action_mode').show();
    $('#navi_visible_switch_btn').show();

    editor.enableOpp('selecter_rect',{navi_node: true, navi_line: true});
    editor.enableOpp('selecter_clicker',{navi_node: true, navi_line: true, multiselect: true});
}


//EVENTS NAVI / NAVI LINK MODE
function to_navi_mode_css(to_navi)
{
    if (!to_navi)
    {
        $('#to_navi_mode_btn').css('background', '#EEEEEE');
        $('#to_std_mode_btn').css('background', '#009688');
    }
    else
    {
        $('#to_navi_mode_btn').css('background', '#009688');
        $('#to_std_mode_btn').css('background', '#EEEEEE');
    }
}

function updateNaviNodes()
{
    //savePrimaryData(current_type ,db_update_navi_nodes,[editor.naviGetNodes()]);
    db_update_build_info(editor.getCurrentBuildInfo(), db_update_navi_nodes,[editor.getNavi()]);
}

function naviVisibleSwitch()
{
    var v = editor.naviVisibleGet();
    if (v == void 0)
        v = true;

    if (v)
        $('#navi_visible_switch_btn').html('<i style="font-size: 22px" class="material-icons">flip_to_back</i>');
    else
        $('#navi_visible_switch_btn').html('<i style="font-size: 22px" class="material-icons">flip_to_front</i>');

    editor.naviVisible(!v);
}

//ICONS
function icpn_mode_oops()
{
    clear_opps_classes();
    set_opp_selected_btn('icon_mode_btn');
    enabled_mode.room = true;
    enabled_mode.navi.force = false;
    $('#icon_mode').show();

    editor.enableOpp('selecter_clicker',{surface: true});
    editor.enableOpp('icon_clicker');
}
function updateSelectedIcon(selected_icon) {
    if (selected_icon == void 0)
        $('#selected_icon').attr('src', FME2.ICON_DATA.undefined_file);
    else
        $('#selected_icon').attr('src', selected_icon.file);
}

function onSelectIcon(icon_name)
{
    if (icon_name == 'undefined')
        icon_name = undefined;
    updateSelectedIcon(editor.selectIconName(icon_name));
}

function loadIconSelecter() 
{
    var s = '<button type="button" class="btn btn-raised" onclick="onSelectIcon(\'{X}\');"><img class="fme2editor-icon" src="{X}"></button>';
    var c = X.FORMAT(s, ['undefined', FME2.ICON_DATA.undefined_file], '{X}');
    for (var i in FME2.ICON_DATA.byname)
        c += X.FORMAT(s, [i, FME2.ICON_DATA.byname[i].file], '{X}');
    $('#icon_selecter').html(c);
}