//FME2 COMMON
var FME2 = {};

FME2.__FME2_ICON_DATA = function(root_folder)
{
	var source = 
	[
		{name: 'projector', 	file: 'projector.png'},
		{name: 'transfer', 		file: 'transfer.png'},
		{name: 'male', 			file: 'human-male.png'},
		{name: 'female', 		file: 'human-female.png'},
		{name: 'lift',			file: 'swap-vertical.png'},
		{name: 'stair', 		file: 'stair.png'},
		{name: 'male-female', 	file: 'human-male-female.png'}
	];

	this.byname = {};
	//this.id = {};

	this.undefined_file = 'undefined.png';

	this.sourcing = function()
	{
		this.byname = {};
		//this.id = {};	

		this.undefined_file = root_folder + this.undefined_file;
		for (var i in source)
		{
			source[i].file = root_folder + source[i].file;
			this.byname[source[i].name] = source[i];
			//this.id[i] = source[i];
		}
	};

	this.processing = function(func, key)
	{
		for (var i in source)
			source[i].key = func(source[i]);

		//sourcing();
	};

	this.sourcing();
};

FME2.ICON_DATA = new FME2.__FME2_ICON_DATA("/static/mynstu/map/icons/");

FME2.CSSXD = 
{
	//CSS 3D
	createCSS3DRenderer: function(container, width, height)
	{
		var renderer = new THREE.CSS3DRenderer();
		//renderer.setSize(width, height);
		container.appendChild(renderer.domElement);
		return renderer;
	},
	createCSS3DSprite: function(src, position, el, el_style)
	{
		var img = document.createElement('img');
		img.src = src;

		for (var k in el)
			img[k] = el[k];
		for (var k in el_style)
			img.style[k] = el_style[k];
	
		var object = new THREE.CSS3DSprite(img);
		object.position.copy(position);
	
		object.matrixAutoUpdate = false;
		object.updateMatrix();
		return object;
	},
	createCSS3DObject: function(content, position, el, el_style)
	{
		var element = document.createElement('div');
		// element.className = 'fme2label';
		// if (color != void 0)
		// 	element.style.color = '#' + color.toString(16);
		for (var k in el)
			element[k] = el[k];
		for (var k in el_style)
			element.style[k] = el_style[k];
		element.textContent = content;
		
		var object = new THREE.CSS3DObject(element);
		object.position.copy(position);
		return object;
	},

	//CSS 2D
	createCSS2DRenderer: function(container, width, height)
	{
		//width = width || window.innerWidth;
		//height = height || window.innerHeight;

		var renderer = new THREE.CSS2DRenderer();
		//renderer.setSize(width, height);
		renderer.domElement.style.position = 'absolute';
		//renderer.domElement.style.top = '40px';
		renderer.domElement.style.pointerEvents = 'none';
		container.appendChild(renderer.domElement);
		return renderer;
	},
	createCSS2DObject: function(content, position, el, el_style)
	{
		var element = document.createElement('div');
		// element.className = 'fme2label';
		// if (color != void 0)
		// 	element.style.color = '#' + color.toString(16);
		for (var k in el)
			element[k] = el[k];
		for (var k in el_style)
			element.style[k] = el_style[k];
		//element.textContent = content;
		element.innerHTML = content;
		
		var object = new THREE.CSS2DObject(element);
		object.position.copy(position);
		return object;
	}
};
//------------------------------------------------------------------------------------------//