'use strict';
//КОД ПОРТИРОВАН С ПЕРВОЙ ВЕРСИИ КАРТЫ
//ДИЧЬ, НО РАБОТАЕТ

//MODERNIZAION

var schedule;

var schedule_prm = 
{
    enabled: false,
    my_group: "",
    day: 1,
    pair: 1,
    week: 1,
    now_week: 1,
    odd: 1,
    //^= week_num
    day_str: ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"],
    pair_srt: ["1 пара", "2 пара", "3 пара", "4 пара", "5 пара", "6 пара", "7 пара"]
};

function schedule_callback()
{
    //$("#schedule_switcher").attr("src","/static/mynstu/images/nstu_map_traffic.png");
    schedule_prm.enabled = true;
    update_schedule_view(current_level.level_id, rooms[current_build_id]);
}
function schedule_set_day(d, run)
{
    $("#schedule_drop_down_day").html(schedule_prm.day_str[d - 1]);
    schedule_prm.day = d;
    if (run && schedule_prm.enabled)
    {
        clear_schedule_select();
        schdeule_RUN(current_level.level_id, schedule_prm.day, schedule_prm.pair, schedule_prm.odd);
    }
}
function schedule_set_day_next()
{
    var d = schedule_prm.day + 1;
    if (d > 6) d = 6;
    schedule_set_day(d, true);
}
function schedule_set_day_prev()
{
    var d = schedule_prm.day - 1;
    if (d < 1) d = 1;
    schedule_set_day(d, true);
}
function schedule_set_pair(d, run)
{
    schedule_prm.pair = d;
    $("#schedule_drop_down_pair").html(schedule_prm.pair_srt[d - 1]);
    if (run && schedule_prm.enabled)
    {
        clear_schedule_select();
        schdeule_RUN(current_level.level_id, schedule_prm.day, schedule_prm.pair, schedule_prm.odd);
    }
}
function schedule_set_pair_next()
{
    var d = schedule_prm.pair + 1;
    if (d > 7) d = 7;
    schedule_set_pair(d, true);
}
function schedule_set_pair_prev()
{
    var d = schedule_prm.pair - 1;
    if (d < 1) d = 1;
    schedule_set_pair(d, true);
}
function schedule_next_week()
{
    schedule_prm.week++;
    schedule_set_odd(schedule_prm.week, true);
}
function schedule_prev_week()
{
    schedule_prm.week--;
    schedule_set_odd(schedule_prm.week, true);
}
function schedule_cur_week()
{
    schedule_set_odd(schedule_prm.now_week, true);
}
function schedule_set_odd(num, run)
{
    if (num<1) num=1;    
    if (num>20) num=20;
    
    schedule_prm.week = num;
    schedule_prm.odd = num;
    //^ % 2;
    $("#week_num").html(num);
    if (run && schedule_prm.enabled)
    {
        clear_schedule_select();
        schdeule_RUN(current_level.level_id, schedule_prm.day, schedule_prm.pair, schedule_prm.week);
    }
}
function schdeule_RUN_TO_RUN()
{
    schedule_callback();
    // if (schedule_prm.enabled)
    //     schdeule_RUN(current_level.level_id, day, pair, odd);
}
function schedule_RUN_SWITCHER()
{
    if (schedule_prm.enabled)
    {
        $('#schedule_runer_btn').css('background', '#EEEEEE');
        $('#schedule_control').hide();
        schedule_STOP();
    }
    else
    {
        $('#schedule_runer_btn').css('background', '#009688');
        $('#schedule_control').show();
        schedule_prm.my_group = Cookies.get('userGroup');
        schedule_get_week(schedule_RUN_FROM_SWITCHER);
    }
}
function schedule_RUN_FROM_SWITCHER()
{
    schdeule_RUN(current_level.level_id, schedule_prm.day, schedule_prm.pair, schedule_prm.odd);
}
function schdeule_RUN(floor, day, pair, odd)
{
    schedule_prm.enabled = true;
    get_schedule(floor, day, pair, odd, schedule_callback);
}
function schedule_STOP()
{
    //$("#schedule_switcher").attr("src","/static/mynstu/images/nstu_map_no_traffic.png");
    schedule_prm.enabled = false;
    clear_schedule_select();
}
function getWeekNumber(termBegin) {
    var cur = new Date;
    var temp = termBegin.split(/\./);
    var begin = new Date(temp[2], temp[1] - 1, temp[0]);
    var weekday = begin.getDay();
    var d = (cur - begin)  / 1000 / 60 / 60 / 24;
    d = (d + weekday) / 7;
    return parseInt(d) + 1;
}
function schedule_set_day_pair_odd_now(week_num)
{
    //odd: 0 чет, 1 неч, -1 оба
    var ret = {};
    var date = new Date();
    ret.day = date.getDay();
    if (ret.day == 0)
    {
        ret.day++;
        week_num++;
        ret.pair = 1;    
    }
    else
    {
        var ps = {2:9*60+55,3:11*60+35,4:13*60+15,5:15*60+10,6:16*60+50,7:18*60+30,8:20*60};
        var t = date.getHours()*60+date.getMinutes();
        ret.pair = 1;
        for (var p in ps)
        {
            if (t>ps[p])
                ret.pair = p;
        }
        if (ret.pair == 8)
        {
            ret.day = (ret.day + 1) % 7;
            if (ret.day == 0)
            {
                ret.day++;
                week_num++;
            }
            ret.pair = 1;
        }
    }
    
    schedule_set_pair(ret.pair,false);
    schedule_set_day(ret.day,false);
    schedule_set_odd(week_num,false);
    schedule_prm.now_week = week_num;
    
    return ret;
}
function schedule_get_week(callback_success)
{
    $.get(server_address + "2/get_semester_begin")
    .done(function(data)
    {
        var b = getWeekNumber(JSON.parse(data).semester_begin);
        schedule_set_day_pair_odd_now(b);
        callback_success();
    })
    .fail(function(data)
    {
        var err = "OOPS!\nget_semestr_begin failed";
        console.log(err);
        console.log(data);
        //alert(err);
    });
}
function schedule_show_modal(info)
{
    var content = info.roomname + '<br>' + info.discname;
    $('#modal_sch_room_title').html(content);
    content = "";
    for (var p in info.persons)
    {
        var per = info.persons[p];
        content+='<p><a href="'+per.link+'"><u><font >'+per.name+'<font></u></a></p>';
    }
    $('#modal_sch_room_teachers').html(content);
    content = "";
    for (var g in info.groups)
    {
        var group = info.groups[g];
        content+='<p>'+group+'</p>';
    }
    $('#modal_sch_room_groups').html(content);
    
    $('#modal_sch_room').modal('show');
}
function get_schedule(floor, day, pair, odd, callback_success)
{
    $.get(server_address + "getGroupsFromFloor?floor=" + floor + "&day=" + day + "&pair=" + pair + "&odd=" + odd)
        .done(function(data)
        {
            schedule = JSON.parse(data);
            //console.log(data);
            if (callback_success != undefined)
                callback_success();
            else
                console.log("callback_success is indefined");
        })
        .fail(function(data)
        {
            var err = "OOPS!\nSchedule loading failed\n" + "day=" + day + " pair=" + pair + " odd=" + odd;
            console.log(err);
            console.log(data);
            alert(err);
        });
}
function get_schedule_info_of_room(room)
{
    var gs = schedule[room.NAME];
    if (gs == void 0)
        return undefined;

    var ret = {};
    ret.roomname = room.NAME;
    ret.discname = gs.discname;
    ret.persons = gs.persons;
    ret.groups = gs.groups;
    
    return ret;
}
function get_busy_rooms(floor,rooms)
{
    var rs = [];
    var sch;
    for (var r in rooms)
    {
        if (rooms[r].FLOOR == floor)
        {
            sch = schedule[rooms[r].NAME];
            if (sch != undefined)
                rs.push(rooms[r]);
        }
    }
    return rs;
}
function schedule_group_in_busy_room(group, room)
{
    var sch = schedule[room.NAME];
    if (sch == void 0)
        return false;
    else
        for (var g in sch.groups)
            if (sch.groups[g] === group)
                return true;

    return false;
}
function update_schedule_view(floor, rooms)
{
    var br = get_busy_rooms(floor, rooms);

    for (var broom in br)
    {
        var b = br[broom];
        var shape = current_level.surfaces[b.SURFACE_ID];
        if (shape != void 0)
        {
            shape = shape.scene_shape;
            shape.userData.busy = true;
            var color = opt.selected_schedule_color;
            
            var sch = schedule[b.NAME];
            for (var g in sch.groups)
                if (schedule_prm.my_group == sch.groups[g])
                    color = opt.selected_schedule_group_color;

            shape.material.color.setHex(color);
            select_shape_view(shape, true);
            //shape.material.opacity = opt.selected_opacity;
        }
    }
}
//NEW

function show_clicked_room_schedule(room)
{
    if (schedule_prm.enabled != true)
        return;
    var sch = get_schedule_info_of_room(room);
    if (sch == void 0)
        return;
    schedule_show_modal(sch);
}
function clear_schedule_select()
{
    var surfaces = current_level.surfaces;
    for (var s in surfaces)
    {
        select_shape_view(surfaces[s].scene_shape, false);
        //surfaces[s].scene_shape.material.opacity = 0;
        surfaces[s].scene_shape.userData.busy = false;
    }
}
function schedule_changed_level()
{
    clear_schedule_select();
    schedule_RUN_FROM_SWITCHER()
}