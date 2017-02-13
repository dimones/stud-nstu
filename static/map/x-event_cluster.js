//X EVENT CLUSTER
//MY CODE, MY RULES, MY NAMES!!
X.EVENT_CLUSTER = class
{
	constructor(){this.event_cluster = {};}

	new_node(context, funcs)
	{
		funcs = funcs || {};
		var node = 
		{
			mouse_down: function(){},
			mouse_up: function(){},
			mouse_click: function(){},
			mouse_move: function(){},
			key_down: function(){},
			key_up: function(){},
			enable: function(){},
			disable: function(){}
		};

		for (var k in node)
		{
			node[k] = funcs[k] || node[k];
			node[k] = X.BIND(node[k], context);
		}

		node.is_enable = false;
		node.context = context;
		return node;
	}

	addOppEvent(name, context, funcs)
	{
		this.event_cluster[name] = this.new_node(context, funcs);
	}

	doEvent(event_name, params)
	{
		for(var e in this.event_cluster)
		{
			var event_node = this.event_cluster[e];
			var event_function = event_node[event_name];
			if (event_node.is_enable && event_function != undefined)			
				event_function(params);			
		}
	}

	Enable(opportunity_name, params)
	{
		var event_node = this.event_cluster[opportunity_name];
		if (event_node != undefined)
		{
			event_node.is_enable = true;
			event_node.enable(params);
		}
	}

	Disable(opportunity_name, params)
	{
		var event_node = this.event_cluster[opportunity_name];
		if (event_node != undefined)
		{
			event_node.is_enable = false;
			event_node.disable(params);
		}
	}

	disableAll(params)
	{
		for (var n in this.event_cluster)
			this.Disable(n, params);
	}
};
//------------------------------------------------------------------------------------------//