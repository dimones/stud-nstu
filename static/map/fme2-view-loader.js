'use strict';
var room_obj3d = {};
var background = null;
var assign_surfroom = {};

function create_scene_level()
{
    var scn = new THREE.Scene();
    // Lights
    var directionalLight = new THREE.DirectionalLight(0x999999);
    directionalLight.position.x = 0.5;
    directionalLight.position.y = 0.5;
    directionalLight.position.z = 0.5;
    directionalLight.position.normalize();
    scn.add(directionalLight);

    //scn.add(new THREE.DirectionalLightHelper(directionalLight, 3000));

    directionalLight = new THREE.DirectionalLight(0x999999);
    directionalLight.position.x = -0.5;
    directionalLight.position.y = 0.5;
    directionalLight.position.z = 0.5;
    directionalLight.position.normalize();
    scn.add(directionalLight);

    //scn.add(new THREE.DirectionalLightHelper(directionalLight, 3000));

    directionalLight = new THREE.DirectionalLight(0x444444);
    directionalLight.position.x = -0.5;
    directionalLight.position.y = 0.5;
    directionalLight.position.z = -0.5;
    directionalLight.position.normalize();
    scn.add(directionalLight);

    //scn.add(new THREE.DirectionalLightHelper(directionalLight, 3000));

    directionalLight = new THREE.DirectionalLight(0x444444);
    directionalLight.position.x = 0.5;
    directionalLight.position.y = 0.5;
    directionalLight.position.z = -0.5;
    directionalLight.position.normalize();
    scn.add(directionalLight);

    //scn.add(new THREE.DirectionalLightHelper(directionalLight, 3000));

    //scn.add(new THREE.AxisHelper(3000));

    //SURFACE
    var back_size = 20000;
    //var back_size = X.INT32_MAX;
    var back_color = data.options.surface_color;
    //var back_color = 0;
    var geometry = new THREE.PlaneGeometry(back_size, back_size);
    //data.options.surface_color = 0;
    var material = new THREE.MeshLambertMaterial(
    {
        color: back_color,
        side: THREE.FrontSide
    });
    var surface = new THREE.Mesh(geometry, material);
    surface.position.set(0, -opt.wall_height / 2 + opt.surface_y, 0);
    surface.rotation.set(-Math.PI / 2, 0, 0);
    surface.userData = {
        type: 'background'
    };
    surface.name = 'background';
    background = surface;
    scn.add(surface);

    return scn;
}
function level_blid(lvl)
{
    return lvl.build_id * 1000 + lvl.level_id;
}
function load_level(build_id, level_id)
{
    load_packed_level(data.builds[parseInt(build_id)][parseInt(level_id)]);
}
function load_packed_level(lvl)
{
    console.time('load_packed_level');

    if (lvl == void 0)
        return;

    if (css_renderer != void 0)
        css_renderer.domElement.style.display = 'none';

    //ДИЧЬ
    if (schedule_prm.enabled && current_level != void 0)
        clear_schedule_select();

    current_build_id = lvl.build_id;
    //current_level_id = lvl.level_id;

    var level = loaded_levels[level_blid(lvl)];
    if (level != undefined)
    {
        scene = level.scene;
        css_renderer = level.css_renderer;
        css_renderer.domElement.style.display = 'block';

        draw_navi(level.build_id, level.level_id);

        current_level = level;
        look_at_me();

        if (schedule_prm.enabled)
            schedule_changed_level();

        console.log('Loaded cached level ' + level_blid(lvl));
        console.timeEnd('load_packed_level');
        return;
    }

    level = {
        level_id: lvl.level_id,
        build_id: lvl.build_id
    };
    var material, geometry;
    level.scene = create_scene_level();
    scene = level.scene;
    scene.name = "scene-" + level.build_id + '-' + level.level_id;

    css_renderer = FME2.CSSXD.createCSS2DRenderer(container);
    css_renderer.setSize(render_width(), render_height());
    css_renderer.domElement.style.top = renderer.domElement.offsetTop + 'px';
    level.css_renderer = css_renderer;

    draw_navi(level.build_id, level.level_id);

    var main_wall_color = data.colors.subtypes[data.colors.type_ids.WALL[0]].color;

    //NODES
    level.nodes = {};
    var center = new THREE.Vector3();
    var node_count = 0;
    for (var n in lvl.nodes)
    {
        var nd = lvl.nodes[n];
        var p = nd.position;
        var node = {
            id: nd.id,
            position: new THREE.Vector3(p.x, opt.level_offset_y, p.z),
            get color()
            {
                return this.scene_obj.material.color.getHex();
            },
            set color(c)
            {
                return this.scene_obj.material.color.setHex(c);
            },
            scene_obj: new THREE.Mesh(
                new THREE.CylinderGeometry(opt.wall_width / 2, opt.wall_width / 2, opt.wall_height * opt.node_hei, 8),
                new THREE.MeshLambertMaterial(
                {
                    color: main_wall_color
                })
            )
        };
        center.add(node.position);
        node_count++;

        node.scene_obj.userData = {
            type: 'node',
            id: nd.id
        };
        node.scene_obj.name = 'node-' + nd.id;
        node.scene_obj.position.copy(node.position);
        level.nodes[node.id] = node;
        //scene.add(node.scene_obj);
    }
    center.divideScalar(node_count);
    controls.target = center;
    controls.update();

    //data.wall_heights[3] = 0.25;

    //WALLS
    level.walls = {};
    var p0 = new THREE.Vector3(1, 0, 0);
    for (var w in lvl.walls)
    {
        var wl = lvl.walls[w];
        var p1 = level.nodes[wl.nodes_ids[0]].position;
        var p2 = level.nodes[wl.nodes_ids[1]].position;
        //p1 = new THREE.Vector3(p1.x, p1.y, p1.z);
        //p2 = new THREE.Vector3(p2.x, p2.y, p2.z);
        var l = p1.distanceTo(p2);
        var a = p1.clone()
            .sub(p2)
            .setY(0)
            .angleTo(p0);
        if (p1.length() > p2.length())
            a = Math.PI * 2 - a;

        var p = p1.clone()
            .add(p2)
            .divideScalar(2)
            .setY(opt.level_offset_y);
        var wall = {
            id: wl.id,
            position: p,
            height: data.wall_heights[wl.color_id],
            get color()
            {
                return this.scene_obj.material.color.getHex();
            },
            set color(c)
            {
                return this.scene_obj.material.color.setHex(c);
            },
            scene_obj: new THREE.Mesh(new THREE.BoxGeometry(l, opt.wall_height * data.wall_heights[wl.color_id], opt.wall_width),
                new THREE.MeshLambertMaterial(
                {
                    color: main_wall_color
                }))
        };

        // if (wl.color_id == 3)
        // {
        // 	wall.scene_obj = new THREE.Mesh(new THREE.BoxGeometry(l, opt.wall_height * data.wall_heights[wl.color_id], opt.wall_width),
        // 		new THREE.MeshLambertMaterial({color: 0, transparent: true, opacity: 0.5}));
        // }

        wall.scene_obj.userData = {
            type: 'wall',
            id: wl.id
        };
        wall.scene_obj.name = 'wall-' + wl.id;
        wall.scene_obj.position.set(p.x, -opt.wall_height * (1 - wall.height) / 2 + opt.level_offset_y, p.z);
        wall.scene_obj.rotation.set(0, a, 0);
        level.walls[wall.id] = wall;
        //scene.add(wall.scene_obj);

        // if (wl.color_id == 3)
        // {
        // 	wall.scene_obj.x_navi = true;
        // 	//wall.scene_obj.scale.setY(0.5);
        // 	wall.scene_obj.position.set(p.x, 1 , p.z);
        // 	scene.add(wall.scene_obj);
        // }

        //[OPTIMIZATION] DOORWALL
        // var py = - opt.wall_height * opt.door_top;
        // var w = opt.wall_width * opt.door_width;
        // var h = opt.wall_height * (1 - opt.door_top);
        // var dm = new THREE.Mesh(new THREE.BoxGeometry(l, h, w), new THREE.MeshLambertMaterial({color: opt.door_color}));
        // dm.position.set(p.x, py, p.z);
        // dm.rotation.set(0, a, 0);
        //scene.add(dm);
    }

    //NODES HEIGHTING
    for (var n in lvl.nodes)
    {
        var wids = lvl.nodes[n].wall_ids;
        var height = 0;
        var h;
        for (var k in wids)
        {
            h = level.walls[wids[k]].height;
            if (h > height)
                height = h
        }
        if (height < 1)
        {
            var obj = level.nodes[lvl.nodes[n].id].scene_obj;
            obj.scale.setY(height);
            obj.position.setY(-opt.wall_height * (1 - height) / 2 + opt.level_offset_y);
        }
    }

    //NODES COLORING
    // for (var n in lvl.nodes)
    // {
    // 	var wids = lvl.nodes[n].wall_ids;
    // 	var colors = {};
    // 	var color;
    // 	for (var k in wids)
    // 	{
    // 		color = level.walls[wids[k]].color; 
    // 		if (colors[color] == void 0)
    // 			colors[color] = {color: color, c:1};
    // 		else
    // 			colors[color].c++;
    // 	}
    // 	color = {color: 0, c:-1};
    // 	for (var k in colors)
    // 		if (colors[k].c > color.c)
    // 			color = colors[k];

    // 	level.nodes[n].color = color.color;

    // 	if (color.color == 0)
    // 	{
    // 		//scene.remove(level.nodes[n].scene_obj);
    // 		level.nodes[n].scene_obj.material.transparent = true;
    // 		level.nodes[n].scene_obj.material.opacity = 0.3;
    // 		level.nodes[n].scene_obj.position.setY(1);
    // 	}
    // }

    //DOORING
    for (var d in lvl.doors)
    {
        var door = lvl.doors[d];
        var wall = level.walls[door.wall_id];

        var p = new THREE.Vector3(door.position.x, -opt.door_top * opt.wall_height + opt.level_offset_y, door.position.z);
        var pn = level.nodes[lvl.walls[wall.id].nodes_ids[0]].scene_obj.position;
        var a = p.clone()
            .sub(pn)
            .angleTo(p0);
        var dm = new THREE.Mesh(new THREE.BoxGeometry(data.options.door_length * data.options.px_zoom, opt.wall_height, opt.wall_width));
        dm.userData = {
            type: 'door',
            id: door.id
        };
        dm.name = 'door-' + door.id;
        dm.position.copy(p);
        dm.rotation.copy(wall.scene_obj.rotation);

        var wm = wall.scene_obj;
        scene.remove(wm);

        // csgw =  THREE.CSG.fromMesh(wm);
        // csgd =  THREE.CSG.fromMesh(dm);
        var csgw = new ThreeBSP(wm);
        var csgd = new ThreeBSP(dm);
        csgw = csgw.subtract(csgd);

        wm = csgw.toMesh(new THREE.MeshLambertMaterial(
        {
            color: wall.scene_obj.material.color.getHex()
        }));
        //wm = THREE.CSG.toMesh(csgw, new THREE.MeshLambertMaterial({color: wall.scene_obj.material.color.getHex()}));
        wall.scene_obj = wm;
        wall.scene_obj.userData = {
            type: 'wall',
            id: wall.id
        };
        wall.scene_obj.name = 'wall-' + wall.id;
        //scene.add(wm);

        //door.visible = false;
        if (door.visible != false)
        {
            dm.position.setY(-opt.wall_height * opt.door_top / 2 + opt.level_offset_y);
            dm.scale.setZ(opt.door_width);
            dm.scale.setY(1 - opt.door_top);
            dm.material.color.setHex(opt.door_color);
            scene.add(dm);
        }
    }

    //SURFACES
    level.surfaces = {};
    for (var s in lvl.surfaces)
    {
        var sr = lvl.surfaces[s];

        var californiaPts = [];
        for (var k in sr.points)
            californiaPts.push(new THREE.Vector2(sr.points[k].x, sr.points[k].y));

        var surface = {
            id: sr.id,
            points: californiaPts,
            room_id: sr.room_id,
            icon_name: sr.icon_name,
            get color()
            {
                return this.scene_obj.material.color.getHex();
            },
            set color(c)
            {
                return this.scene_obj.material.color.setHex(c);
            },
            __calc_positions: function()
            {
                var pc = new THREE.Vector2(0, 0);
                var c = 0;
                for (var k in this.points)
                {
                    pc.add(this.points[k]);
                    c++;
                }
                pc.divideScalar(c);
                var p = [];
                for (var k in this.points)
                    p.push(this.points[k].clone()
                        .sub(pc));
                return {
                    pc: pc,
                    ps: p
                };
            }
        };
        var pcs = surface.__calc_positions();

        var surface_shape = new THREE.Shape(pcs.ps);
        var geometry = new THREE.ShapeGeometry(surface_shape);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial(
        {
            color: data.colors.subtypes[sr.color_id].color,
            side: THREE.BackSide
        }));
        surface.scene_obj = mesh;
        mesh.userData = {
            type: 'surface',
            surface: surface,
            color: surface.color
        };
        mesh.name = 'surface-' + sr.id;
        mesh.rotation.set(Math.PI / 2, 0, 0);
        var room_surf_y = -opt.wall_height / 2 + opt.level_offset_y;
        mesh.position.set(pcs.pc.x, room_surf_y, pcs.pc.y);
        scene.add(mesh);

        var create_css2d_text = function (text, surface)
        {
            if (text == void 0 && surface.icon_name == void 0)
                return;
            var text_pos = surface.scene_obj.position.clone();

            text_pos.setY(text_pos.y + opt.text_h * opt.wall_height);
            var icon = surface.icon_name != void 0 ? '<img class="fme2icon" src="' + FME2.ICON_DATA.byname[surface.icon_name].file + '">' : '';

            var text_content = icon + (text == void 0 ? '' : '<font class="fme2label">' + text + '</font><br>');

            var obj3d = FME2.CSSXD.createCSS2DObject(text_content, text_pos, {}, {});

            surface.text_3d = obj3d;
            obj3d.userData = {
                type: 'text',
                surface: surface
            };
            obj3d.name = 'text-' + text + '-s' + surface.id;

            scene.add(obj3d);
            return obj3d;
        };

        if (surface.room_id != void 0)
        {
            mesh.name += '-r' + surface.room_id;
            //SHAPE
            var shgeo_h = opt.shape_height + 1;

            //var shgeo = surface_shape.extrude({amount: shgeo_h, bevelEnabled: false});
            var shgeo = new THREE.ExtrudeGeometry(surface_shape,
            {
                amount: shgeo_h,
                bevelEnabled: false
            });
            var shmesh = new THREE.Mesh(shgeo, new THREE.MeshLambertMaterial(
            {
                color: opt.selected_color,
                transparent: true,
                opacity: opt.selected_opacity
            }));
            //shmesh.material.opacity = 0;
            shmesh.visible = false;
            shmesh.position.copy(mesh.position);
            shmesh.position.setY(opt.shape_height + room_surf_y);
            shmesh.rotation.copy(mesh.rotation);
            scene.add(shmesh);
            //surface.scene_shape_obj = shmesh;
            shmesh.userData = {
                type: 'shape',
                surface: surface
            };
            shmesh.name = 'shape_of-s' + sr.id + '-r' + surface.room_id;
            mesh.userData.shape = shmesh;
            level.surfaces[sr.id] = surface;
            surface.scene_shape = shmesh;

            //room_text
            var room = rooms[lvl.build_id][surface.room_id];
            surface.room = room;
            if (room.MULTI == 1)
                surface.icon_name = 'projector';
            var obj3d = create_css2d_text(room.NUM, surface);

            if (room_obj3d[level_blid(lvl)] == void 0)
                room_obj3d[level_blid(lvl)] = [];
            room_obj3d[level_blid(lvl)].push(obj3d);

            assign_surfroom[surface.room_id] = surface;
        }
        else
        {
            create_css2d_text(undefined, surface);
        }
    }

    //MERGE GEOMETRYES
    var materall = new THREE.MeshLambertMaterial(
    {
        color: main_wall_color,
        transparent: false,
        opacity: 0.5
    });
    //MERGE 1
    var mergregeo = new THREE.Geometry();
    for (var w in level.walls)
    {
        var mesh = level.walls[w].scene_obj;
        mesh.updateMatrix();
        mergregeo.merge(mesh.geometry, mesh.matrix);
    }
    for (var n in level.nodes)
    {
        var mesh = level.nodes[n].scene_obj;
        mesh.updateMatrix();
        mergregeo.merge(mesh.geometry, mesh.matrix);
    }
    mergregeo.mergeVertices();
    var merged_meshes = new THREE.Mesh(mergregeo, materall);

    //UNION BSP //VERY LONG
    // var mergregeobsp = undefined;// = new ThreeBSP(level.walls[0].scene_obj);
    // for (var w in level.walls)
    // {
    // try
    // {
    // 	if (mergregeobsp == void 0)
    // 	{
    // 		mergregeobsp = new ThreeBSP(level.walls[w].scene_obj);
    // 		continue;
    // 	}

    // 	var mesh = level.walls[w].scene_obj;
    // 	var meshbsp = new ThreeBSP(mesh);
    // 	mergregeobsp = mergregeobsp.union(meshbsp);
    // }
    // catch(err)
    // {
    // 	console.error(err);
    // }
    // }
    // for (var n in level.nodes)
    // {
    // 	try
    // 	{
    // 		var mesh = level.nodes[n].scene_obj;
    // 		var meshbsp = new ThreeBSP(mesh);
    // 		mergregeobsp = mergregeobsp.union(meshbsp);
    // 	}
    // 	catch(err)
    // 	{
    // 		console.error(err);
    // 	}
    // }
    // merged_meshes = mergregeobsp.toMesh(materall);
    //merged_meshes.geometry.computeVertexNormals();

    //merged_meshes.userData = 'merged';
    merged_meshes.name = 'merged';
    scene.add(merged_meshes);

    current_level = level;
    loaded_levels[level_blid(level)] = level;
    look_at_me();
    console.log('Cached level ' + level_blid(lvl));
    console.timeEnd('load_packed_level');

    //ДИЧЬ
    if (schedule_prm.enabled)
        schedule_changed_level();

    //if (navi.enabled)
    //	draw_navi(level.build_id, level.level_id);
}