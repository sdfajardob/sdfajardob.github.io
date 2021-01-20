var errorsearching = true;

// search for errors in positions
function searchNegativePositions()
{
	// gets all relevant svg graphic elements
	var e_circles = $$('circle');
	var e_texts = $$('text');
	var e_rects = $$('rect');
	var e_polylines = $$('polyline');
	
	// checking all circle elements
	for(var i=0;i<e_circles.length;i++)
	{
		try
		{
			if(Number(e_circles[i].getAttribute('cx'))<0)
			{
				alert("Attention: this net has a position error\nx = "+Number(e_circles[i].getAttribute('cx')));
				return false;
			}
			if(Number(e_circles[i].getAttribute('cy'))<0)
			{
				alert("Attention: this net has a position error\ny = "+Number(e_circles[i].getAttribute('cy')));
				return false;
			}
			if(Number(e_circles[i].getAttribute('r'))<0)
			{
				alert("Attention: this net has a position error\nr = "+Number(e_circles[i].getAttribute('r')));
				return false;
			}
		}
		catch(e)
		{
			// if an attribute is undefined
		}
	}
	// checking all text elements
	for(var i=0;i<e_texts.length;i++)
	{
		try
		{
			if(Number(e_texts[i].getAttribute('x'))<0)
			{
				alert("Attention: this net has a position error\nx = "+Number(e_texts[i].getAttribute('x')));
				return false;
			}
			if(Number(e_texts[i].getAttribute('y'))<0)
			{
				alert("Attention: this net has a position error\ny = "+Number(e_texts[i].getAttribute('y')));
				return false;
			}
		}
		catch(e)
		{
			// if an attribute is undefined
		}
	}
	// checking all rect elements
	for(var i=0;i<e_rects.length;i++)
	{
		try
		{
			if(Number(e_rects[i].getAttribute('x'))<0)
			{
				alert("Attention: this net has a position error\nx = "+Number(e_rects[i].getAttribute('x')));
				return false;
			}
			if(Number(e_rects[i].getAttribute('y'))<0)
			{
				alert("Attention: this net has a position error\ny = "+Number(e_rects[i].getAttribute('y')));
				return false;
			}
			if(Number(e_rects[i].getAttribute('width'))<0)
			{
				alert("Attention: this net has a position error\nr = "+Number(e_rects[i].getAttribute('width')));
				return false;
			}
			if(Number(e_rects[i].getAttribute('height'))<0)
			{
				alert("Attention: this net has a position error\nr = "+Number(e_rects[i].getAttribute('height')));
				return false;
			}
		}
		catch(e)
		{
			// if an attribute is undefined
		}
	}
	// checking all polyline elements
	for(var i=0;i<e_polylines.length;i++)
	{
		try
		{
			if(e_polylines[i].getAttribute('points').indexOf('-') != -1)
			{
				alert("Attention: this net has a position error\nx = "+e_polylines[i].getAttribute('points'));
				return false;
			}
		}
		catch(e)
		{
			// if an attribute is undefined
		}
	}
}

// search for multiple IDs
function multipleIDs()
{
	// gets all svg elements
	var e_all = document.documentElement;
	e_all = $$('');
	
	var ids = '';
	var meldung = true;
	// checks all elements for IDs
	for(var i=0;i<e_all.length;i++)
	{
		if(e_all[i].hasAttribute('id'))
		{
			if(ids.indexOf('[id]'+e_all[i].getAttribute('id')+'[/id]') == -1)
			{
				ids = ids+'[id]'+e_all[i].getAttribute('id')+'[/id] ';
			}
			else
			{
				// errormessage for the user
				alert("this net has multiple IDs\nid = "+e_all[i].getAttribute('id'));
				meldung = false;
			}
		}
	}
	return meldung;
}

// search for net-number-gaps
function checkSubnets()
{
	// gets all svg elements
	var e_all = document.documentElement;
	e_all = $$('');
	
	var netnr = '';
	var nr = new Array();
	
	// checks all elements for IDs
	for(var i=0;i<e_all.length;i++)
	{
		if(e_all[i].hasAttributeNS(Snoopy.namespace, 'net'))
		{
			var net = e_all[i].getAttributeNS(Snoopy.namespace, 'net');
			// if net number does not exists -> write it in the net string
			if(netnr.indexOf("[net]"+net+"[/net]") == -1)
			{
				netnr = netnr + "[net]"+net+"[/net] ";
				nr[net] = net;
			}
		}
		
	}
	// search net number 0 (old nets)
	if(nr[0])
	{
		alert('Notice: this is an old net - with a net number 0');
	}
	// procedure to find net number gaps
	var max = nr.length-1;		// maximum of net numbers
	// search net gaps
	for(var j=1;j<=max;j++)
	{
		if(nr[j]){}
		else
		{
			alert('Attention: this net has a subnet error (subnet '+(j)+' does not exists)');
		}
	}
}
// search for id-Attributes of choosen object (class-name)
function getAllObjectIDs(obj)
{
	if(obj=='Place')
	{
		var id_list = "Places:\n";
		$$('g.'+obj).each(function(pl)
		{
			id_list = id_list+(pl.getAttribute('id'))+"\n";
		});
		alert(id_list);
	}
	else if(obj=='Transition')
	{
		var id_list = "Transitions:\n";
		$$('g.'+obj).each(function(t)
		{
			id_list = id_list+(t.getAttribute('id'))+"\n";
		});
		alert(id_list);
	}
	
}
/* change edge source- and target ids 
(this function is a test implementation for multiple ID-errors) 
 */
function changeEdgeIDs(obj)
{
	var id_list = "Edge-Sources:\n";
	$$('g.Edge').each(function(es)
	{
		es_id = es.getAttributeNS(Snoopy.namespace, 'source');
		$$('g.Place').each(function(p)
		{
			if(es_id == p.getAttribute('id'))	// Source-ID als Platz identifiziert
			{
				es.setAttributeNS(Snoopy.namespace, 'source', 'p'+es_id);
			}
		});
		$$('g.Transition').each(function(t)
		{
			t.getAttribute('id');
			if(es_id == t.getAttribute('id'))	// Source-ID als Transition identifiziert
			{
				es.setAttributeNS(Snoopy.namespace, 'source', 't'+es_id);
			}
		});
		
	});
	
	$$('g.Edge').each(function(et)
	{
		et_id = et.getAttributeNS(Snoopy.namespace, 'target');
		$$('g.Place').each(function(p)
		{
			if(et_id == p.getAttribute('id'))	// Target-ID als Platz identifiziert
			{
				//alert('Target: '+et_id+' ist ein Platz');
				et.setAttributeNS(Snoopy.namespace, 'target', 'p'+et_id);
				
			}
		});
		$$('g.Transition').each(function(t)
		{
			t.getAttribute('id');
			if(et_id == t.getAttribute('id'))	// Target-ID als Transition identifiziert
			{
				//alert('Target: '+et_id+' ist eine T.');
				et.setAttributeNS(Snoopy.namespace, 'target', 't'+et_id);
			}
		});
	});
	
	// alle IDs der Plätze und Transitionen werden überschrieben
	$$('g.Place').each(function(p)
	{
		p.setAttribute('id','p'+p.getAttribute('id'));
	});
	$$('g.Transition').each(function(t)
	{
		t.setAttribute('id','t'+t.getAttribute('id'));
	});
}


