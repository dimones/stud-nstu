'use strict';
//         _.-'~~~~~~`-._    
//        /      ||      \   
//       /       ||       \  
//      |        ||        | 
//      | _______||_______ | 
//      |/ ----- \/ ----- \|      
//     /  (     )  (     )  \     
//    / \  ----- () -----  / \    
//   /   \      /||\      /   \   
//  /     \    /||||\    /     \  
// /       \  /||||||\  /       \ 
///_        \o========o/        _\
//  `--...__|`-._  _.-'|__...--'  
//          |    `'    |            
//MAY THE FORCE WILL BE WITH YOU
//
//  ██████╗██████╗ ██╗   ██╗████████╗ ██████╗██╗  ██╗    ██████╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
// ██╔════╝██╔══██╗██║   ██║╚══██╔══╝██╔════╝██║  ██║    ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██║   ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
// ██║     ██████╔╝██║   ██║   ██║   ██║     ███████║    ██████╔╝██████╔╝██║   ██║██║  ██║██║   ██║██║        ██║   ██║██║   ██║██╔██╗ ██║
// ██║     ██╔══██╗██║   ██║   ██║   ██║     ██╔══██║    ██╔═══╝ ██╔══██╗██║   ██║██║  ██║██║   ██║██║        ██║   ██║██║   ██║██║╚██╗██║
// ╚██████╗██║  ██║╚██████╔╝   ██║   ╚██████╗██║  ██║    ██║     ██║  ██║╚██████╔╝██████╔╝╚██████╔╝╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
//  ╚═════╝╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝  ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
//  _        _
// ( `-.__.-' )
//  `-.    .-'
//     \  /
//      ||
//      ||
//     //\\
//    //  \\
//   ||    ||
//   ||____||
//   ||====||
//    \\  //
//     \\//
//      ||
//      ||
//      ||
//      ||
//      ||
//      ||
//      ||
//      ||
//      []

//GLOBAL X

var X = {
	get INT32_MAX(){return 4294967296},
	BIND: function(func, context){return function(){return func.apply(context, arguments);};},
	
	STR_FILL_TO_LENGTH: function(str, char, count, side)
	{
		var rpt = '';
		count -= str.length;
		for (var i = 0; i < count; i++) rpt+=char;
			if (side == 'left')	return rpt + str;
		if (side == 'right') return str + rpt;
		return undefined;
	},
	

	GET_VALUES_OF_DIC_BY_KEY_VALUE: function(array, key, value)
	{
		var objs = [];
		for (var k in array)
			if (array[k][key] == value)
				objs.push(array[k]);
			return objs;
	},

	GET_VALUES_OF_KEYS_IN_DIC: function(array, key)
	{
		var ids = [];
		for (var k in array)
			ids.push(array[k][key]);
		return ids;
	},

	FILT_DIC_BY_KEYS: function(array, key_array)
	{
		var objs = [];
		for (var k in key_array)
			objs.push(array[k]);
		return objs;
	},

	PROCONF: function(mode, text)
	{
		var pc;
		if (mode == 'promt')
			pc = prompt(text);
		if (mode == 'confirm')
			pc = confirm(text);
		if (pc == "" || pc == void 0) return undefined;
		return pc;
	},

	GET_URL_PARAMETER: function(sParam)
	{
		var sPageURL = decodeURIComponent(window.location.search.substring(1));
		var sURLVariables = sPageURL.split('&');
		var sParameterName;
		var i;

		for (i = 0; i < sURLVariables.length; i++)
		{
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam)
			{
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	},

	GEBI: function(id)
	{
		return document.getElementById(id);
	},

	TFU: function(tfu,t,f)
	{
		return tfu == t ? true : (tfu == f ? false : undefined);
	},

	ID21: function(id1, id2)
	{
		if (id1 < id2) return id1 * 100000000 + id2;
		else return id2 * 100000000 + id1;
	},

	FORMAT: function(string, array, replace)
	{
		if (replace == void 0)
			replace = "{x}";

		string = String(string).split(replace);
		var result = string[0];
		for (var i in array)
		{
			i = parseInt(i);
			result += array[i] + string[i+1];
		}
		return result;
	},

	VOID0: function(args)
	{
		for (var a in args)
			if (args[a] == void 0)
				return true;
		return false;
	},

	FULLHTML: function (id)
	{
		return $(id).wrap('<div>').parent().html();
	}
	// POSITION3_TO_FIXED: function(p, n)
	// {
	// 	return {x: parseFloat(p.x).toFixed(2).toString(), y: parseFloat(p.y).toFixed(2).toString(), z: parseFloat(p.z).toFixed(2).toString()};
	// },

	// POSITION2_TO_FIXED: function(p, n)
	// {
	// 	return {x: parseFloat(p.x).toFixed(2).toString(), y: parseFloat(p.y).toFixed(2).toString()};
	// }
};

// var multicall_exaple = function(arg1, arg2)
// {
// 	console.log(arg1 + arg2);
// 	return multicall_exaple;
// };

//------------------------------------------------------------------------------------------//