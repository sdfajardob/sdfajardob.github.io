//############ global variables ############################################

// user gets petri net informations
var netinfo = true;

var http = null;	// initialisation value for AJAX (XMLHttpRequest)
// tests in the sequence files
var seqtests = 4;		// true=all, 1..n=1..n Tests, false=no tests

var sequencefiles = false;
// durations for the sequence part
var maxSeqDur = 10000;				// maximum duration 
var mstime_specfire = 4000;	// duration in ms, to fire special transitions in the sequenzfiles
var mstime_marking = 1400;	// duration in ms, to coloring after token-marking in the sequenzfiles
var mstime_coloring = 2600;	// duration in ms, to coloring transition after firing

// color-definitions for the sequence-part
var rgb_current_place = 'rgb(255,127,80)';		// color for current places
var rgb_put_place = 'rgb(245,222,179)';			// color for put places
var rgb_current_transition = 'rgb(255,0,0)';	// color for current transitions
var rgb_put_transition = 'rgb(240,230,140)';	// color for put transitions

// flags for sequence button activity
var seq_i = 0;				// stepnumber of the sequence-file
var stop_active = false;
var step_active = false;
var play_active = false;
var pause_active = false;

// sequence-index for step by step marking/firing
var seqindex = 0;

var sequences = false;	// default value for see the sequence-selection

// buffer for color reset after sequence-end
var pl_buffer = new Object();
var tr_buffer = new Object();

// returns assoz. array with all get parameters
function checkGetVariables()
{
	var s = window.location.search.substring(1).split('&');
	try
	{
		var parts = new Array();
		var arr = new Object();
		
		for(var i=0;i<s.length;i++)
		{
			parts[i] = s[i].split('=');
			arr[parts[i][0]] = parts[i][1];
		}
		return arr;
	}
	catch(e){}
}
var arr_get = checkGetVariables();		// Array with alle Get-Variables
// sets the global variable - if the get-variable initialize
if(arr_get['seqtests'])
{
	seqtests = arr_get['seqtests'];		// true=all, 1..n=1..n Tests, false=no tests
}
// show the place-/transition-id on mouseover (get-variable show_id=true)
function resetPTtitles()
{
	//var p = $$('g:Place');
	var plid, trid;
	$$('g.Place').each(function(pl)
	{
		plid = pl.getAttribute('id');
		pl.setAttribute('title','ID: '+plid);
	});
	$$('g.Transition').each(function(tr)
	{
		trid = tr.getAttribute('id');
		tr.setAttribute('title','ID: '+trid);
	});
}		
// calculate the maximum of all sequence-part-times in sec.
function getMaxMstime()
{
	var m1 = Math.max(mstime_specfire,mstime_coloring);
	var m2 = (Math.max(m1,mstime_marking)/1000);
	
	return m2;
}

// define the call-back-function for sequence-combobox
var callBackSequence = function(group,str,i)
{
	// tests the sequence file
	if(seqtests!=false)
	{
		testSequenceFile1(seq[Number(i)].url);
	}
	
	// get sequence-infos to the user
	if(confirm(seq[Number(i)].description+"\r\n\r\ndo you want to start this sequence?"))
	{
		// sets the normal object-colors
		setNormalColors();
		if(!sequences)
			return;
		else
		{
			// starts the sequenzfile 
			startJSON(seq[Number(i)].url);
		}
	}
	else
		myMapApp.comboboxes["seqstart"].deselectAll(false);
	
};
// start function for reading the JSON-file on runtime
function startJSON(file)
{
	if(window.XMLHttpRequest) 
	{
	   http = new XMLHttpRequest();
	} 
	else if(window.ActiveXObject) 
	{
	   http = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(http != null) 
	{
		try{
			http.open("GET", file, true);
			http.onreadystatechange = writeJSONOrder;
			
			http.send(null);
		}
		catch(e)
		{
			http.abort();
			alert('error - sequence file not found');
		}
	}
	else
	{
		alert("error - no execution possible");
	}
}

// looks for sequence mainfile
function searchForFiles()
{
	// if sequences are defined for this net -> set the sequence-selection
	if(typeof(seq) != 'undefined')
	{	
		sequences = true;
		sequencefiles = seq.length;
	}
	else
	{
		// no message
	}
}
// net information on start
function getAllObjectAmounts()
{
	if(sequences==true)
	{
		alert("net information:\n\nplaces: "+Number($$('g.Place').length)
				+"\ntransitions: "+Number($$('g.Transition').length)
				+"\nsequence files: "+sequencefiles);
	}
	else if(sequences==false)
	{
		alert("net information:\n\nplaces: "+Number($$('g.Place').length)
			+"\ntransitions: "+Number($$('g.Transition').length));
	}
	else
	{
		// no message		
	}
}
// start function for reading the JSON-file on runtime
function writeJSONOrder() 
{
	if(http==null)
	{
		alert('no sequence chosen, please select a sequence!');
		return;
	}
	// when the request is ready, read the JSON-File
	if(http.readyState == 4)
	{
		var daten = http.responseText;
		
		try
		{
			if(!sequences)	// file not found -> break
				return;
			// read the JSON-Data in a 2D-Array
			data = eval("(" + daten + ")");
		}
		catch(e)
		{
			http.abort();
		}
		// JSON-Array-End is not reached
		if(seq_i!=data.length)
		{
			// get next row from JSON-Array
			var jsondata = data[seq_i];
			
			if(jsondata.pid != null)
			{
				var pl = document.getElementById(jsondata.pid);
				var plcol = pl.getElementsByTagName("circle")[0].getAttribute('fill');
				if(typeof(pl_buffer[jsondata.pid])=='undefined')
				{
					pl_buffer[jsondata.pid] = plcol;
				}				
				// if a place-id is defined, set new marking with the tokenvalue
				setTokenSpecial(jsondata.pid,jsondata.token);
				
				if(stop_active==true)
				{
					// enable combobox for using
					myMapApp.comboboxes["seqstart"].enableCombobox(callBackSequence);
					stop_active=false;
					seq_i=0;
					return;
				}
				else if(step_active==true)
				{
					// if it the first step, the net gets the normal colors
					if(seq_i==0)
					{
						// sets the normal object-colors
						//setNormalColors(); // error?
					}
					// increments arrayindex
					seq_i++;
					return;
				}
				else if(pause_active==true)
				{
					// increments arrayindex
					seq_i++;
					return;
				}
				else
				{
					// increments arrayindex
					seq_i++;
					// starts the function after a special timeinterval
					setTimeout("writeJSONOrder()",mstime_marking);
				}
			}
			
			if(jsondata.tid != null)
			{
				if(typeof jsondata.tid=="object")
				{
					var tr;
					var trcol;
					for(var j=0;j<jsondata.tid.length;j++)
					{
						tr = document.getElementById(jsondata.tid[j]);
						trcol = tr.getElementsByTagName("rect")[0].getAttribute('fill');
						if(typeof(tr_buffer[jsondata.tid[j]])=='undefined')
						{
							tr_buffer[jsondata.tid[j]] = trcol;
						}
						fireSpecial(jsondata.tid[j]);
					}
				}
				else
				{
					var tr = document.getElementById(jsondata.tid);
					var trcol = tr.getElementsByTagName("rect")[0].getAttribute('fill');
					if(typeof(tr_buffer[jsondata.tid])=='undefined')
					{
						tr_buffer[jsondata.tid] = trcol;
					}						
					// if a transition-id is defined, start firing with this id
					fireSpecial(jsondata.tid);
				}
				if(stop_active==true)
				{
					// enable combobox for using
					myMapApp.comboboxes["seqstart"].enableCombobox(callBackSequence);
					stop_active=false;
					seq_i=0;
					return;
				}
				else if(step_active==true)
				{
					// increments arrayindex
					seq_i++;
					//seqStepForwardPressed();
					return;
				}
				else if(pause_active==true)
				{
					// increments arrayindex
					seq_i++;
					return;
				}
				else
				{
					// increments arrayindex
					seq_i++;
					// starts the function after a special timeinterval
					setTimeout("writeJSONOrder()",mstime_specfire);
				}
			}
		}
		// if JSON-Array-End is reached
		else
		{
			alert('END - no more steps in the sequence file');
			seq_i=0;
			stop_active = false;
			step_active = false;
			play_active = false;
			pause_active = false;
			// enable combobox for using
			myMapApp.comboboxes["seqstart"].enableCombobox(callBackSequence);
		}
	}
}
// get connection to the sequence file
function testSequenceFile1(file)
{
	if(window.XMLHttpRequest) 
	{
	   http = new XMLHttpRequest();
	} 
	else if(window.ActiveXObject) 
	{
	   http = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(http != null) 
	{
		try{
			http.open("GET", file, true);
			http.onreadystatechange = testSequenceFile2;
			http.send(null);
		}
		catch(e)
		{
			http.abort();
			alert('error - sequence file not found');
			// ToDo: Ablauf abbrechen
			sequences = false;
		}
	}
	else
	{
		alert("error - no request possible");
	}
}
// tests orders after valid IDs
function testSequenceFile2()
{
	if(http==null)
	{
		alert('no sequence chosen, please select a sequence!');
		return;
	}
	// when the request is ready, read the JSON-File
	if(http.readyState == 4)
	{
		var daten = http.responseText;
		
		try
		{
			// read the JSON-Data in an 2D-Array
			data = eval("(" + daten + ")");
			if(seqtests==true)
			{
				var tests = data.length;
			}
			else if(seqtests>data.length)
			{
				var tests = data.length;
			}
			else
			{
				var tests = seqtests;
			}
			var ch_ok;
			for(var l=0;l<tests;l++)	// checks only the first 4 data (for better performance)
			{
				ch_ok = false;
				// checks the places
				if(data[l].pid != null)
				{
					var ps = $$('g.Place');
					for(var k=0;k<ps.length;k++)
					{
						if(data[l].pid == ps[k].getAttribute('id'))	// Tid found in the net -> OK
						{
							ch_ok = true;
							k=ps.length;	// breaks the search
						}
					}
				}
				// checks the transitions
				else if(data[l].tid != null)
				{
					var ts = $$('g.Transition');
					for(var j=0;j<ts.length;j++)
					{
						if(data[l].tid == ts[j].getAttribute('id'))	// Tid found in the net -> OK
						{
							ch_ok = true;
							j=ts.length;	// breaks the search
						}
					}
				}
				if(ch_ok == false)	// error the ID in the sequence-file is not valid for this net
				{
					alert('error - this sequence file is not valid for this net!');
					sequences = false;
					sequencefiles = false;
					return false;
				}
			}
			return true;
		}
		catch(e)
		{
			http.abort();
		}		
	}
	
}
/* #############################  END - Sequence-Part  ################################################### */

var myMapApp = null;
var netBox = null;
var svg = null;
var Snoopy = {};
Snoopy.namespace = 'http://www-dssz.informatik.tu-cottbus.de/';
Snoopy.net = {moveable:false, panning:false, x:0, y:0, tx:0, ty:0, initialMarking: new Array()};
Snoopy.animation = {
	step:true, duration:1000, stepping:'single', play:false, pause:false, stop:true, transitions:new Array(),
	firedTransitions:new Array(), currentStep:0, currentMaxSteps:500, maxSteps:500
};
var arrLogicTransitions = [];

window.addEvent('domready', function() 
{
	// search for sequence-files
	searchForFiles();
	
	try{
		if(arr_get['netinfo']==null)
		{
			// user gets net informations
			getAllObjectAmounts();
		}
		if(arr_get['show_id'])
		{
			resetPTtitles();	// show ID on mouseover
		}
		// when the script errorsearch.js is include
		if(errorsearching)
		{
			if(arr_get['negpos'])
			{
				searchNegativePositions();
			}
			if(arr_get['multi_id'])
			{
				multipleIDs();				// find multple IDs
			}
			if(arr_get['subnets'])
			{
				checkSubnets();
			}
			if(arr_get['places'])
			{
				getAllObjectIDs('Place');		// gets all Place-IDs 
			}
			if(arr_get['transitions'])
			{
				getAllObjectIDs('Transition');	// gets all Transition-IDs
			}
		}
	}
	catch(e)
	{}
	
	svg = $$('svg');
	setSVGSize();
	Snoopy.net.places = $$('circle.Place');
	Snoopy.net.texts = $$('text.Name');
	Snoopy.net.texts.combine($$('text.Edge'));
	
	Snoopy.net.coarsePlaces = $$('g.CoarsePlace');
	
	Snoopy.net.transitions = $$('rect.Transition');
	Snoopy.net.coarseTransitions = $$('g.CoarseTransition');
	Snoopy.net.edges = $$('polyline.Edge');
	
	setInitialMarking();
		
	// after setMarking() add the generated Tokens
	Snoopy.net.tokens = $$('.Token');
	
	// onclick-event append to every transition
	$$('g.Transition').each(function(transition){
		transition.addEvent('click', transition.fire.bind(transition));
	});
	
	Snoopy.net.coarseTransitions.each(function(transition)
	{
		transition.addEvent('click', transition.fire.bind(transition));
	});
	$$('g.Transition').each(function(t)
	{
		if(t.getAttribute('snp:logic')==1)
		{
			arrLogicTransitions.include(t.getAttribute('id'));
		}
	});
	
	/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%   START navWindow   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
	myMapApp = new mapApp();

	//first a few styles
	var winPlaceholderStyles = {"fill":"none","stroke":"dimgray","stroke-width":1.5};
	var windowStyles = {"fill":"aliceblue","stroke":"dimgray","stroke-width":1};
	var titlebarStyles = {"fill":"gainsboro","stroke":"dimgray","stroke-width":1};
	var statusbarStyles = {"fill":"aliceblue","stroke":"dimgray","stroke-width":1};
	var titletextStyles = {"font-family":"verdana,Arial,helvetica,sans-serif","font-size":12,"fill":"dimgray"};
	var statustextStyles = {"font-family":"verdana,Arial,helvetica,sans-serif","font-size":10,"fill":"dimgray"};
	var buttonStyles = {"fill":"gainsboro","stroke":"dimgray","stroke-width":1};
	var titlebarHeight = 17;
	var statusbarHeight = 13;
	var buttonTextChange;
	var nwin_width = 210;
	
	var anz_tcoarse = Snoopy.net.coarseTransitions.length;
	// gets variabel height for the navigation window
	if(sequences==true && anz_tcoarse>0)
	{
		var nwin_height = 350;
		var seqbox_y = 290;
	}
	else if(sequences==false && anz_tcoarse>0)
	{
		var nwin_height = 280;
		var seqbox_y = 295;
	}
	else if(sequences==true && anz_tcoarse==0)
	{
		var nwin_height = 300;
		var seqbox_y = 240;
	}
	else
	{
		var nwin_height = 230;
		var seqbox_y = 295;
	}
	
	var navX = 150;
	// new menu-position on the right side for FF
	if (window.innerWidth && window.innerWidth<=screen.width)
	{
		// set navigation-window on the right
		navX = window.innerWidth-210-50;
	}
	// new menu-position on the right side for IE
	else if (document.body && document.body.offsetWidth && document.body.offsetWidth<=screen.width) 
	{
		// set navigation-window on the right
		navX = document.body.offsetWidth-210-50;
	} 
	else 
	{
		navX = 150;
	}
	if(navX>1024)
		navX = 950;
	// Navigation-Window were generated
	// Windo(id,parentNode,width,height,transX,transY,moveable,constrXmin,constrYmin,constrXmax,constrYmax,showContent,placeholderStyles,windowStyles,margin,titleBarVisible,statusBarVisible,titleText,statusText,closeButton,minimizeButton,maximizeButton,titlebarStyles,titlebarHeight,statusbarStyles,statusbarHeight,titletextStyles,statustextStyles,buttonStyles,functionToCall)
	myMapApp.Windows["navWindow"] = new Windo("navWindow","main",nwin_width,nwin_height, navX, 100,true,10,10,9000,9000,true,winPlaceholderStyles,windowStyles,3,true,false,"Patty v1.2","",false,false,false,titlebarStyles,titlebarHeight,statusbarStyles,statusbarHeight,titletextStyles,statustextStyles,buttonStyles,buttonTextChange);
	
	//define some styles for the map object
	var zoomRectStyles = {"fill":"none","stroke":"crimson","stroke-width":0.002,"stroke-dasharray":"0.012,0.002"};
	var highlightStyles = {"stroke":"crimson","stroke-width":0.002};
	var dragRectStyles = {"fill":"lightskyblue","fill-opacity":0.5};
	
	//first the slider styles
	var sliderStyles={"stroke":"dimgray","stroke-width":3};
	var invisSliderWidth = 14;
	
	//callbackFunction
	var zoomSlide = function(type, id, value)
	{
		if(type=="release") 
		{
			zooming(value);
		}	
	};
	// slider(id,parentNode,x1,y1,value1,x2,y2,value2,startVal,sliderStyles,invisSliderWidth,sliderSymb,functionToCall,mouseMoveBool)
	myMapApp.sliders["zoom"] = new slider("zoom","navWindow",20,52,2,20,152,0.1,1,sliderStyles,invisSliderWidth,"sliderSymbol",zoomSlide,true);

	//first a few styles
	//button styles, adopt the style settings to match your needs
	var buttonTextStyles = {"font-family":"verdana,Arial,helvetica,sans-serif","fill":"dimgray","font-size":10};
	var buttonStyles = {"fill":"white"};
	var shadeLightStyles = {"fill":"rgb(235,235,235)"};
	var shadeDarkStyles = {"fill":"dimgray"};
	
	//callbackFunction
	var panPressed = function(group, evt, active){
		if(active) {
			Snoopy.net.moveable = true;
			$('net').setStyle('cursor', 'move');
		} else {
			Snoopy.net.moveable = false;
			$('net').setStyle('cursor', 'pointer');
		}
	};
	
	myMapApp.buttons["panManual"] = new switchbutton("panManual","navWindow",panPressed,"rect",undefined,"symbPan",10,180,20,20,buttonTextStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,1);
	
	var stopPressed = function()
	{
		stopNet();
		setNormalColors();
		try{myMapApp.comboboxes["seqstart"].deselectAll(false);}
		catch(e){}
	};
	var playStepForwardPressed = function(group, evt, active)
	{
		/*if(active) 
		{
			playNet(1);
		} 
		else 
		{
			pauseNet();
		}*/
		playNet(1);
	};
	var playForwardPressed = function(group, evt, active)
	{
		if(active) 
		{
			Snoopy.animation.currentMaxSteps = Snoopy.animation.maxSteps;
			playNet(Snoopy.animation.currentMaxSteps);
		} 
		else 
		{
			pauseNet();
		}
	};
	
	// callback-methods for sequence steering buttons
	var seqStopPressed = function()
	{
		stop_active = true;
		myMapApp.buttons["SeqPlay"].setSwitchValue(false, false);
		step_active = false;
		play_active = false;
		pause_active = false;
		seq_i=0;
		// enable combobox for using
		myMapApp.comboboxes["seqstart"].enableCombobox(callBackSequence);
		try{myMapApp.comboboxes["seqstart"].deselectAll(false);}
		catch(e){}
		stopNet();
		setNormalColors();
	};
	var seqStepForwardPressed = function()
	{
		step_active = true;
		
		if(play_active==true)
		{
			var st_ans = confirm("you has choose the sequence stepping\ndo you want to play the sequence step by step?\n(the next step starts after "+Number(getMaxMstime())+" seconds)");
			
			if(st_ans==false)
			{
				return;
			}
			else
			{
				myMapApp.buttons["SeqPlay"].setSwitchValue(false, false);
				play_active = false;
				// starts one step after an short time
				setTimeout("writeJSONOrder()",Number(100+Number(getMaxMstime()*1000)));
				return;
			}
		}
		stop_active = false;
		pause_active = false;
		
		// if it the first step, the net gets the normal colors
		if(seq_i==0)
		{
			// sets the normal object-colors
			setNormalColors();
		}
		// starts one step after an short time
		setTimeout("writeJSONOrder()",400);
	};
	var seqPlayPressed = function(group, evt, active)
	{
		if(active) 
		{
			var fromstepping = false;		// checkvalue for button event history
			// checks button event history
			if(step_active == true)
			{
				if(confirm("you break off the sequence step-by-step-mode\ndo you want to run the sequence continuously?\n(sequence starts after "+Number(getMaxMstime())+" seconds)"))
				{
					fromstepping = true;
				}
				else
				{
					myMapApp.buttons["SeqPlay"].setSwitchValue(false, false);
					return;
				}
			}
			play_active = true;
			step_active = false;
			stop_active = false;
			
			if(http==null)
			{
				alert('no sequence chosen, please select a sequence!');
				return;
			}
			if(pause_active == true)
			{
				// starts one step after a short time
				setTimeout("writeJSONOrder()",1000);
			}
			else
			{
				if(fromstepping == false)
				{
					// sets the normal object-colors
					setNormalColors();
				}
				// starts one step after a short time
				setTimeout("writeJSONOrder()",Number(100+Number(getMaxMstime()*1000)));
			}
			pause_active = false;
		} 
		else
		{
			myMapApp.buttons["SeqPlay"].setSwitchValue(false, false);
			pause_active = true;
			play_active = false;
			step_active = false;
			stop_active = false;
			alert("you paused the current sequence.\nto continue, click on the Play button again!");
		}
	};
	
	// button(id,parentNode,functionToCall,buttonType,buttonText,buttonSymbolId,x,y,width,height,textStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,shadowOffset)
	myMapApp.buttons["SeqStop"] = new button("SeqStop","navWindow",seqStopPressed,"rect",undefined,"stopIcon",60,30,20,20,buttonTextStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,1);
	myMapApp.buttons["SeqStepForward"] = new button("SeqStepForward","navWindow",seqStepForwardPressed,"rect",undefined,"playStepIcon",85,30,20,20,buttonTextStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,1);
	myMapApp.buttons["SeqPlay"] = new switchbutton("SeqPlay","navWindow",seqPlayPressed,"rect",undefined,"playIcon",110,30,20,20,buttonTextStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,1);
	// at scriptstart the sequencebuttons are hide
	myMapApp.buttons["SeqStop"].hideButton();
	myMapApp.buttons["SeqStepForward"].hideButton();
	myMapApp.buttons["SeqPlay"].hideButton();
	
	// button(id,parentNode,functionToCall,buttonType,buttonText,buttonSymbolId,x,y,width,height,textStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,shadowOffset)
	myMapApp.buttons["stop"] = new button("stop","navWindow",stopPressed,"rect",undefined,"stopIcon",60,30,20,20,buttonTextStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,1);
	myMapApp.buttons["playStepForward"] = new button("playStepForward","navWindow",playStepForwardPressed,"rect",undefined,"playStepIcon",85,30,20,20,buttonTextStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,1);
	myMapApp.buttons["playForward"] = new switchbutton("playForward","navWindow",playForwardPressed,"rect",undefined,"playIcon",110,30,20,20,buttonTextStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,1);
		
	//callbackFunction
	var zoomInButtonPressed = function(groupId, evt)
	{
		zoomIn(0.30);
	};
	
	//callbackFunction
	var zoomOutButtonPressed = function(groupId, evt)
	{
		zoomOut(0.30);
	};
	
	myMapApp.buttons["zoomIn"] = new button("zoomIn","navWindow",zoomInButtonPressed,"rect",undefined,"magnifyerZoomIn",10,30,20,20,buttonTextStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,1);
	myMapApp.buttons["zoomOut"] = new button("zoomOut","navWindow",zoomOutButtonPressed,"rect",undefined,"magnifyerZoomOut",10,153,20,20,buttonTextStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,1);
	
	// change control of the action-buttons
	var setStepping = function(id, selectedId, labelText)
	{
		// if the sequence radiobutton is checked - exchange button steering
		if(cbSequence.checkedStatus==true)
		{
			//myMapApp.buttons["stop"].fireFunction("seqStopPressed");
			myMapApp.buttons["stop"].hideButton();
			myMapApp.buttons["playStepForward"].hideButton();
			myMapApp.buttons["playForward"].hideButton();
			myMapApp.buttons["SeqStop"].showButton();
			myMapApp.buttons["SeqStepForward"].showButton();
			myMapApp.buttons["SeqPlay"].showButton();
		}
		else
		{
			myMapApp.buttons["SeqStop"].hideButton();
			myMapApp.buttons["SeqStepForward"].hideButton();
			myMapApp.buttons["SeqPlay"].hideButton();
			myMapApp.buttons["stop"].showButton();
			myMapApp.buttons["playStepForward"].showButton();
			myMapApp.buttons["playForward"].showButton();
			
			Snoopy.animation.stepping = labelText;
		}
		
	};

	var steppingText = new Element('text', 
	{
		'id':'stepping',
		'x':'60',
		'y':'70'
	});
	var txt = document.createTextNode('stepping');
	steppingText.appendChild(txt);	
	steppingText.injectInside('navWindow');
	
	//labeltext styles
	var labeltextStyles = {"font-family":"verdana,Arial,helvetica,sans-serif","fill":"dimgray","font-size":12};
	//now create a new radioButtonGroup instance
	var radioGroupStepping = new radioButtonGroup("radioGroupStepping",setStepping);
	//the following three checkboxes are added to the radio button group stored in the object instance 'radioGroup'
	var cbSingle = new checkBox("single","navWindow",70,85,"radioBorder","radioPoint",true,"single",labeltextStyles,12,4,radioGroupStepping,undefined);		
	var cbIntermediate = new checkBox("intermediate","navWindow",70,100,"radioBorder","radioPoint",false,"intermediate",labeltextStyles,12,4,radioGroupStepping,undefined);	
	var cbMaximum = new checkBox("maximum","navWindow",70,115,"radioBorder","radioPoint",false,"maximum",labeltextStyles,12,4,radioGroupStepping,undefined);
	
	//the following three checkboxes are added to the radio button group stored in the object instance 'radioGroup'
	// checkBox(id,parentNode,x,y,checkboxId,checkcrossId,checkedStatus,labelText,textStyles,labelDistance,labelYOffset,radioButtonGroup,functionToCall)
	var cbSequence = new checkBox("cbSequence","navWindow",70,135,"radioBorder","radioPoint",false,"sequence",labeltextStyles,12,4,radioGroupStepping,undefined);		

	
	Snoopy.net.coarseNets = new Hash;
	Snoopy.net.coarseNets.set('1', getCoarseNet(1));
	
		//this array contains the values
		var nets = new Array();
		nets[0] = {'key': 'top level', 'value': true};
		var n = 1;
		
		Snoopy.net.coarseTransitions.each(function(g)
		{
			var coarse = Number(g.getAttributeNS(Snoopy.namespace, 'coarse'));
			Snoopy.net.coarseNets.set(coarse, getCoarseNet(coarse));
			try{
			var name = g.getElement('text').get('text');}
			catch(e){var name = Number(n);}
			nets[n] = {'key': name, 'value': false};
			n++;
		});
		
		Snoopy.net.coarsePlaces.each(function(g)
		{
			var coarse = Number(g.getAttributeNS(Snoopy.namespace, 'coarse'));
			Snoopy.net.coarseNets.set(coarse, getCoarseNet(coarse));
			var name = g.getElement('text').get('text');
			if(name=='') {
				name = 'Coarse ('+coarse+')';
			}
			nets[n] = {'key': name, 'value': false};
			n++;
		});

		setNetOpacity(1, '1', '0');

		//first a few styling parameters:
		var comboBoxCellHeight = 16;
		var comboBoxTextpadding = 3;
		var comboBoxtextStyles = {"font-family":"verdana,Arial,helvetica,sans-serif","font-size":10,"fill":"dimgray"};
		var comboBoxStyles = {"stroke":"dimgray","stroke-width":1,"fill":"white"};
		var comboBoxScrollbarStyles = {"stroke":"dimgray","stroke-width":1,"fill":"whitesmoke"};
		var comboBoxSmallrectStyles = {"stroke":"dimgray","stroke-width":1,"fill":"lightgray"};
		var comboBoxHighlightStyles = {"fill":"dimgray","fill-opacity":0.3};
		var comboBoxTriangleStyles = {"fill":"dimgray"};

		//callbackFunction
		var showNet = function(group, str, i){
			setNetOpacity(Number(i)+1, '1', '0');
		};

		var container = "navWindow";	// navigation window
		// no subnets -> no combobox
		if(Snoopy.net.coarseNets.getKeys().length<2) 
		{
			var g = new Element('g', {
				'id':'hiddenCombo'
			});
			g.set('opacity', 0);	// hides combobox
			$('main').adopt(g);
			container = "hiddenCombo";	// overwrite the target window
		}
		// no scrollbar -> box width resized
		if(anz_tcoarse<3)
		{
			var netboxwidth = 205;
		}
		else
		{
			var netboxwidth = 190;
		}
		//now initialize the combobox
		// combobox(id,parentNode,elementsArray,width,xOffset,yOffset,cellHeight,textPadding,heightNrElements,multiple,offsetValue,textStyles,boxStyles,scrollbarStyles,smallrectStyles,highlightStyles,triangleStyles,functionToCall) 
		myMapApp.comboboxes["nets"] = new combobox("nets", container, nets, netboxwidth, 10, 225,comboBoxCellHeight,comboBoxTextpadding,3,true,50,comboBoxtextStyles,comboBoxStyles,comboBoxScrollbarStyles,comboBoxSmallrectStyles,comboBoxHighlightStyles,comboBoxTriangleStyles,showNet);
	
	// label text for "current Step"
	var currentStep = new Element('text', {
		'id':'currentStep',
		'x':'60',
		'y':'165'
	});
	var txt = document.createTextNode('current step: '+Snoopy.animation.currentStep);
	currentStep.appendChild(txt);
	currentStep.injectInside('navWindow');
	
	// label text for "max. Steps"
	var maxStepsText = new Element('text', {
		'id':'maxStepsText',
		'x':'60',
		'y':'190'
	});
	var txt = document.createTextNode('max. steps:');
	maxStepsText.appendChild(txt);
	maxStepsText.injectInside('navWindow');

	var setMaxSteps = function(groupId, value, changetype){
		Snoopy.animation.maxSteps = Number(value);
	};
	
	// initialize style variables for the textboxes
	var textStyles = {"fill":"dimgray"};
	var boxStyles = {"fill":"white","stroke":"dimgray","stroke-width":1};
	var cursorStyles = {"stroke":"red","stroke-width":1};
	var selBoxStyles = {"fill":"blue","opacity":0.5};
	
	// textbox for the maxSteps value
	myMapApp.textboxes["max_steps"] = new textbox("max_steps","navWindow",Snoopy.animation.maxSteps,8,150,175,50,20,15,textStyles,boxStyles,cursorStyles,selBoxStyles,"[0-9]",setMaxSteps);
	// start for the duration part
	var durationText = new Element('text', {
		'id':'durationText',
		'x':'60',
		'y':'215'
	});
	var txt = document.createTextNode('duration:');
	durationText.appendChild(txt);
	durationText.injectInside('navWindow');
	
	var setDuration = function(groupId, value, changetype){
		Snoopy.animation.duration = Number(value);
	};
	// textbox for the duration value
	//myMapApp.textboxes["max_steps"] = new textbox("max_steps","navWindow",Snoopy.animation.maxSteps,8,150,175,50,20,15,textStyles,boxStyles,cursorStyles,selBoxStyles,"[0-9]",setMaxSteps);
	myMapApp.textboxes["duration"] = new textbox("duration","navWindow",Snoopy.animation.duration,8,150,200,50,20,15,textStyles,boxStyles,cursorStyles,selBoxStyles,"[0-9]",setDuration);
	
	// if sequences are found -> create the sequence selection
	function setSequenceSelection()
	{
		var seqHeadline = new Element('text', {
		'id':'seqHeadline',
		'x':'37',
		'y':seqbox_y
		});
		var htxt = document.createTextNode('available sequences');
		seqHeadline.appendChild(htxt);
		seqHeadline.injectInside('navWindow');
		
		// a few styling parameters:
		var comboBoxCellHeight = 16;
		var comboBoxTextpadding = 3;
		var comboBoxtextStyles = {"font-family":"verdana,Arial,helvetica,sans-serif","font-size":10,"fill":"dimgray"};
		var comboBoxStyles = {"stroke":"dimgray","stroke-width":1,"fill":"white"};
		var comboBoxScrollbarStyles = {"stroke":"dimgray","stroke-width":1,"fill":"whitesmoke"};
		var comboBoxSmallrectStyles = {"stroke":"dimgray","stroke-width":1,"fill":"lightgray"};
		var comboBoxHighlightStyles = {"fill":"dimgray","fill-opacity":0.3};
		var comboBoxTriangleStyles = {"fill":"dimgray"};
		
		//this array contains the values
		var arr_seq = new Array();
		
		for(var l=0;l<seq.length;l++)
		{
			arr_seq[l] = {'key': seq[l].title, 'value': false};
		}
		// no scrollbar -> box width resized
		if(seq.length<4)
		{
			var boxwidth = 205;
		}
		else
		{
			var boxwidth = 190;
		}
		// combobox for sequences
		myMapApp.comboboxes["seqstart"] = new combobox("seqstart","navWindow", arr_seq, boxwidth, 10, (seqbox_y+5),comboBoxCellHeight,comboBoxTextpadding,3,true,50,comboBoxtextStyles,comboBoxStyles,comboBoxScrollbarStyles,comboBoxSmallrectStyles,comboBoxHighlightStyles,comboBoxTriangleStyles,callBackSequence);
	}
	if(sequences==true)
	{
		setSequenceSelection();
	}
	try{
		if(arr_get['scale']<1 && arr_get['scale']>0.09)
		{
			zooming(arr_get['scale']);
			myMapApp.sliders["zoom"].setValue(arr_get['scale'],false);
		}
		else if(arr_get['scale']==1)
		{
			zooming(1);
		}
		else if(arr_get['scale']>1 && arr_get['scale']<2.1)
		{
			zooming(arr_get['scale']);
			myMapApp.sliders["zoom"].setValue(arr_get['scale'],false);
		}
	}
	catch(e){}
	/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%   END navWindow   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
	/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  START optionWindow   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
	
	myMapApp2 = new mapApp();

	//window styles
	var winPlaceholderStyles2 = {"fill":"none","stroke":"dimgray","stroke-width":1.5};
	var windowStyles2 = {"fill":"rgb(180,180,180)","stroke":"dimgray","stroke-width":1};
	var titlebarStyles2 = {"fill":"gainsboro","stroke":"dimgray","stroke-width":1};
	var statusbarStyles2 = {"fill":"aliceblue","stroke":"dimgray","stroke-width":1};
	var titletextStyles2 = {"font-family":"verdana,Arial,helvetica,sans-serif","font-size":11,"fill":"dimgray"};
	var statustextStyles2 = {"font-family":"verdana,Arial,helvetica,sans-serif","font-size":9,"fill":"dimgray"};
	//var buttonStyles2 = {"fill":"gainsboro","stroke":"dimgray","stroke-width":1};
	var titlebarHeight2 = 20;
	var statusbarHeight2 = 14;
	var buttonTextChange2;
	var owin_width = 300;
	var owin_height = 280;
	var navX2 = 150;
	var navY2 = 50;
	// new menu-position on the right side for FF
	if (window.innerWidth && window.innerWidth<screen.width)
	{
		// set navigation-window on the right
		navX2 = window.innerWidth-575;
	}
	// new menu-position on the right side for IE
	else if (document.body && document.body.offsetWidth && document.body.offsetWidth<screen.width) 
	{
		// set navigation-window on the right
		navX2 = document.body.offsetWidth-575;
	} 
	else 
	{
		navX2 = screen.width-600;
	}
	// styles for color buttons
	var butStyCurT = {"fill":rgb_current_transition};
	// styles for color buttons
	var butStyPutT = {"fill":rgb_put_transition};
	// styles for color buttons
	var butStyCurPl = {"fill":rgb_current_place};
	// styles for color buttons
	var butStyPutPl = {"fill":rgb_put_place};
	
	// callBackFunction for optionWindow-button 1
	function pressColChange()
	{
		
		switch(this.id)
		{
			case 'curTcolor':
				var color = prompt("new color for current transitions: ", rgb_current_transition); // color for current transitions
				if(color==null)
				{
					color = rgb_current_transition;
				}
				break;
			case 'putTcolor':
				var color = prompt("new color for used transitions: ", rgb_put_transition); // color for current transitions
				if(color==null)
				{
					color = rgb_put_transition;
				}
				break;
			case 'curPlcolor': 
				var color = prompt("new color for current places: ", rgb_current_place); // color for current transitions
				if(color==null)
				{
					color = rgb_current_place;
				}
				break;
			case 'putPlcolor': 
				var color = prompt("new color for used places: ", rgb_put_place); // color for current transitions
				if(color==null)
				{
					color = rgb_put_place;
				}
				break;
			default: alert('error in sequence options');
		}
		
		newButSty = {"fill":color};
		
		switch(this.id)
		{
			case 'curTcolor': rgb_current_transition = color; // color for current transitions
				break;
			case 'putTcolor': rgb_put_transition = color; // color for put transitions
				break;
			case 'curPlcolor': rgb_current_place = color; // color for current places
				break;
			case 'putPlcolor': rgb_put_place = color; // color for put places
				break;
			default: alert('error in sequence options');
		}
		// delete old Button (in button.js - no method to change button-colors)
		this.removeButton();
		
		// switchbutton(id,parentNode,functionToCall,buttonType,buttonText,buttonSymbolId,x,y,width,height,textStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,shadowOffset)
		myMapApp.buttons[this.id] = new button(this.id,"optionWindow",pressColChange,this.buttonType,undefined,"",this.x,this.y,20,20,buttonTextStyles,newButSty,shadeLightStyles,shadeDarkStyles,1);
	}
	// initialisation of the Sequence Option Window
	function openNewOptionWindow()
	{
		// Sequence-Option-Window were generated
		// Windo(id,parentNode,width,height,transX,transY,moveable,constrXmin,constrYmin,constrXmax,constrYmax,showContent,placeholderStyles,windowStyles,margin,titleBarVisible,statusBarVisible,titleText,statusText,closeButton,minimizeButton,maximizeButton,titlebarStyles,titlebarHeight,statusbarStyles,statusbarHeight,titletextStyles,statustextStyles,buttonStyles,functionToCall)
		myMapApp2.Windows["optionWindow"] = new Windo("optionWindow","main",owin_width,owin_height, navX2, navY2,true,10,10,9000,9000,true,winPlaceholderStyles2,windowStyles2,3,true,false,"sequence options","",true,false,false,titlebarStyles2,titlebarHeight2,statusbarStyles2,statusbarHeight2,titletextStyles2,statustextStyles2,buttonStyles2,buttonTextChange2);
		
		// description text for color options
		var descColorText1 = new Element('text', {'id':'descColorText1','x':'10','y':'35'});
		var txt = document.createTextNode("to change the colors of the object state");
		descColorText1.appendChild(txt);
		descColorText1.injectInside('optionWindow');
		var descColorText2 = new Element('text', {'id':'descColorText2','x':'10','y':'50'});
		var txt = document.createTextNode("enter new color (Hex, RGB or color name)");
		descColorText2.appendChild(txt);
		descColorText2.injectInside('optionWindow');
		
		// switchbutton(id,parentNode,functionToCall,buttonType,buttonText,buttonSymbolId,x,y,width,height,textStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,shadowOffset)
		myMapApp.buttons["curTcolor"] = new button("curTcolor","optionWindow",pressColChange,"rect",undefined,"",25,60,20,20,buttonTextStyles,butStyCurT,shadeLightStyles,shadeDarkStyles,1);
		// button text
		var curTcolorText = new Element('text', {'id':'curTcolorText','x':'55','y':'75'});
		var txt = document.createTextNode('color for current transitions');
		curTcolorText.appendChild(txt);
		curTcolorText.injectInside('optionWindow');
		
		// button(id,parentNode,functionToCall,buttonType,buttonText,buttonSymbolId,x,y,width,height,textStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,shadowOffset) {	
		myMapApp.buttons["putTcolor"] = new button("putTcolor","optionWindow",pressColChange,"rect",undefined,"",25,85,20,20,buttonTextStyles,butStyPutT,shadeLightStyles,shadeDarkStyles,1);
		// button text
		var putTcolorText = new Element('text', {'id':'putTcolorText','x':'55','y':'100'});
		var txt = document.createTextNode('color for used transitions');
		putTcolorText.appendChild(txt);
		putTcolorText.injectInside('optionWindow');
		
		// switchbutton(id,parentNode,functionToCall,buttonType,buttonText,buttonSymbolId,x,y,width,height,textStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,shadowOffset)
		myMapApp.buttons["curPlcolor"] = new button("curPlcolor","optionWindow",pressColChange,"ellipse",undefined,"",25,110,20,20,buttonTextStyles,butStyCurPl,shadeLightStyles,shadeDarkStyles,1);
		// button text
		var curPlcolorText = new Element('text', {'id':'curPlcolorText','x':'55','y':'125'});
		var txt = document.createTextNode('color for current places');
		curPlcolorText.appendChild(txt);
		curPlcolorText.injectInside('optionWindow');
		
		// button(id,parentNode,functionToCall,buttonType,buttonText,buttonSymbolId,x,y,width,height,textStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,shadowOffset) {	
		myMapApp.buttons["putPlcolor"] = new button("putPlcolor","optionWindow",pressColChange,"ellipse",undefined,"",25,135,20,20,buttonTextStyles,butStyPutPl,shadeLightStyles,shadeDarkStyles,1);
		// button text
		var putPlcolorText = new Element('text', {'id':'putPlcolorText','x':'55','y':'150'});
		var txt = document.createTextNode('color for used places');
		putPlcolorText.appendChild(txt);
		putPlcolorText.injectInside('optionWindow');
		
		// durations for the sequence part
		
		// description text for color options
		var descDurText1 = new Element('text', {'id':'descDurText1','x':'10','y':'175'});
		var txt = document.createTextNode("to change the duration time (1000 ms = 1 sec.)");
		descDurText1.appendChild(txt);
		descDurText1.injectInside('optionWindow');
		var descDurText2 = new Element('text', {'id':'descDurText2','x':'10','y':'190'});
		var txt = document.createTextNode("edit the value in the textbox (max. 10,000)");
		descDurText2.appendChild(txt);
		descDurText2.injectInside('optionWindow');
		
		// initialize style variables for the textboxes
		var textStyles = {"fill":"dimgray"};
		var boxStyles = {"fill":"white","stroke":"dimgray","stroke-width":1};
		var cursorStyles = {"stroke":"red","stroke-width":1};
		var selBoxStyles = {"fill":"blue","opacity":0.5};
		
		// label text for markingTime
		var markingTimeText = new Element('text', {'id':'markingTimeText','x':'10','y':'215'});
		var txt = document.createTextNode("dur. in ms, to color place(s)");
		markingTimeText.appendChild(txt);
		markingTimeText.injectInside('optionWindow');
		var setMarkingTime = function(groupId, value, changetype)
		{
			if(maxSeqDur>=Number(value))
			{
				mstime_marking = Number(value);
			}
			else
			{
				alert('error - you have exceeded the max duration ('+maxSeqDur+' ms)');
				myMapApp.textboxes["markingTime"].setValue(mstime_marking,false);		// reset the value in the textbox
			}
		};
		
		// textbox for the markingTime value
		myMapApp.textboxes["markingTime"] = new textbox("markingTime","optionWindow",mstime_marking,8,245,200,50,20,15,textStyles,boxStyles,cursorStyles,selBoxStyles,"[0-9]",setMarkingTime);
		
		// label text for coloringTimeText
		var coloringTimeText = new Element('text', {'id':'coloringTimeText','x':'10','y':'240'});
		var txt = document.createTextNode("dur. in ms, to color transition(s)");
		coloringTimeText.appendChild(txt);
		coloringTimeText.injectInside('optionWindow');
		var setSpecfireTime = function(groupId, value, changetype)
		{
			if(maxSeqDur>=Number(value))
			{
				mstime_coloring = Number(value);
			}
			else
			{
				alert('error - you have exceeded the max duration ('+maxSeqDur+' ms)');
				myMapApp.textboxes["coloringTime"].setValue(mstime_coloring,false);		// reset the value in the textbox
			}
		};
		// textbox for the coloringTime value
		myMapApp.textboxes["coloringTime"] = new textbox("coloringTime","optionWindow",mstime_coloring,8,245,225,50,20,15,textStyles,boxStyles,cursorStyles,selBoxStyles,"[0-9]",setSpecfireTime);
		
		// label text for specfireTime
		var specfireTimeText = new Element('text', {'id':'specfireTimeText','x':'10','y':'265'});
		var txt = document.createTextNode("dur. in ms, between two transitions to fire");
		specfireTimeText.appendChild(txt);
		specfireTimeText.injectInside('optionWindow');
		var setSpecfireTime = function(groupId, value, changetype)
		{
			if(maxSeqDur>=Number(value))
			{
				mstime_specfire = Number(value);
			}
			else
			{
				alert('error - you have exceeded the max duration ('+maxSeqDur+' ms)');
				myMapApp.textboxes["specfireTime"].setValue(mstime_specfire,false);		// reset the value in the textbox
			}
		};
		// textbox for the specfireTime value
		myMapApp.textboxes["specfireTime"] = new textbox("specfireTime","optionWindow",mstime_specfire,8,245,250,50,20,15,textStyles,boxStyles,cursorStyles,selBoxStyles,"[0-9]",setSpecfireTime);
		
	}
	// callBackFunction for the seqoption-button in the navigation window
	function seqoptionsPressed()
	{
		if(myMapApp2.Windows["optionWindow"]==undefined)
		{
			openNewOptionWindow();
		}
		else if(myMapApp2.Windows["optionWindow"].closed==true)
		{
			myMapApp2.Windows["optionWindow"].windowGroup.setAttributeNS(null,"display","inherit");
			myMapApp2.Windows["optionWindow"].closed = false;
		}
	}
	var buttonTextStyles2 = {"font-family":"verdana,Arial,helvetica,sans-serif","fill":"dimgray","font-size":10};
	var buttonStyles2 = {"fill":"white"};
	var shadeLightStyles2 = {"fill":"rgb(235,235,235)"};
	var shadeDarkStyles2 = {"fill":"dimgray"};
	
	// BUTTON for the sequence options - switchbutton(id,parentNode,functionToCall,buttonType,buttonText,buttonSymbolId,x,y,width,height,textStyles,buttonStyles,shadeLightStyles,shadeDarkStyles,shadowOffset)
	myMapApp.buttons["panManual"] = new button("panManual","navWindow",seqoptionsPressed,"rect",undefined,"wrench",180,125,20,20,buttonTextStyles2,buttonStyles2,shadeLightStyles2,shadeDarkStyles2,1);	
	
	/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  END optionWindow   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
	
	$('net').addEvents({
		'click': function(e)
		{
			
		},
		'mousedown': function(e)
		{
			var evt = new Event(e);
			if(Snoopy.net.moveable) {
				
				Snoopy.net.x = evt.client.x;
		        Snoopy.net.y = evt.client.y;
		
				if($('moveBox')) $('moveBox').destroy();
				Snoopy.net.panning = true;
				var moveBox = new Element('rect', {
					'id': 'moveBox',
					'width': '9000',
					'height': '9000'
				});
				
				$('net').adopt(moveBox);
				
			}
		},
		'mousemove': function(e)
		{
			if(Snoopy.net.moveable && Snoopy.net.panning) {
				var evt = new Event(e);
				
		        var dx = evt.client.x - Snoopy.net.x;
		        var dy = evt.client.y - Snoopy.net.y;
		
		        Snoopy.net.x = evt.client.x;
		        Snoopy.net.y = evt.client.y;
		
		        Snoopy.net.tx += dx;
		        Snoopy.net.ty += dy;
		        var scale = $('net').getAttributeNS(Snoopy.namespace, 'scale');
		        $('net').set("transform", "translate("+Snoopy.net.tx+","+Snoopy.net.ty+") scale("+scale+")");
			}
		},
		'mouseup': function(e)
		{
			if(Snoopy.net.moveable && Snoopy.net.panning) {
				Snoopy.net.panning = false;
				
				$('net').removeAttribute("snp:translate");
				$('net').setAttributeNS(Snoopy.namespace, 'snp:translate', Snoopy.net.tx+','+Snoopy.net.ty);
				
				if($('moveBox')) $('moveBox').destroy();
			}
		}
	});
	// creating pseudo line breaks for text elements
	createLineBreaks2();
});
// SVG size = window size
function setSVGSize() 
{
	var netBox = getScreenBBox($('net')), width = Number(netBox.get('width')), height = Number(netBox.get('height'));
	/*
	// new menu-position on the right side for FF
	if (window.innerWidth && window.innerWidth<=screen.width)
	{
		// set navigation-window on the right
		widthIs = window.innerWidth;
		heightIs = window.innerHeight;
	}
	// new menu-position on the right side for IE
	else if (document.body && document.body.offsetWidth && document.body.offsetWidth<screen.width) 
	{
		// set navigation-window on the right
		widthIs = document.body.offsetWidth;
		heightIs = document.body.offsetHeight;
	} 
	else 
	{
		widthIs = screen.width-100;
		heightIs = screen.height-70;
	}
	if(width<widthIs) 
	{
		svg.set('width', widthIs);
		svg.set('height', heightIs);
	}
	else
	{
		svg.set('width', width+100);
		svg.set('height', height+100);
	}
	*/
	if(width<1024)
	{
		width = 1024;
		height = 768;
	}
	svg.set('width', width+300);
	svg.set('height', height+300);
}

function setInitialMarking() 
{
	$$('g.Place').each(function(place)
	{
		var marking = Number(place.getAttributeNS(Snoopy.namespace, 'marking'));
		if(marking!=0) {
			setMarking(place, marking);
		}
		
		Snoopy.net.initialMarking.push({'id':place.get('id'), 'marking':marking});
		
		// new procedure at mouseclick 
		place.addEvent('click', function(e)
		{
			var evt = new Event(e);
			if(evt.shift) {
				decreaseMarking(place, 1);
			} else {
				increaseMarking(place, 1);
			}
		});
	});
}
// reset token number of all places
function resetInitialMarking() 
{
	Snoopy.net.initialMarking.each(function(place)
	{
		var g_place = $(String(place.id));
		if(g_place) 
		{
			setMarking(g_place, place.marking);
		}
	});
}

function getCoarseNet(coarse) 
{
	var coarse = Number(coarse);
	var coarseNet = {};
	coarseNet.transitions = new Array();
	coarseNet.coarseTransitions = new Array();
	coarseNet.places = new Array();
	coarseNet.coarsePlaces = new Array();
	coarseNet.edges = new Array();
	coarseNet.tokens = new Array();
	coarseNet.texts = new Array();
	
	Snoopy.net.transitions.each(function(transition){
		if(Number(transition.getAttributeNS(Snoopy.namespace, 'net'))==coarse) {
			coarseNet.transitions.push(transition);
		}
	});
	
	Snoopy.net.coarseTransitions.each(function(coarseTransition){
		if(Number(coarseTransition.getAttributeNS(Snoopy.namespace, 'net'))==coarse) {
			coarseNet.coarseTransitions.push(coarseTransition);
		}
	});
	
	Snoopy.net.places.each(function(place){
		if(Number(place.getAttributeNS(Snoopy.namespace, 'net'))==coarse) {
			coarseNet.places.push(place);
		}
	});
	
	Snoopy.net.coarsePlaces.each(function(coarsePlace){
		if(Number(coarsePlace.getAttributeNS(Snoopy.namespace, 'net'))==coarse) {
			coarseNet.coarsePlaces.push(coarsePlace);
		}
	});	
	
	Snoopy.net.edges.each(function(edge){
		if(Number(edge.getAttributeNS(Snoopy.namespace, 'net'))==coarse) {
			coarseNet.edges.push(edge);
		}
	});
	
	Snoopy.net.tokens.each(function(token){
		if(Number(token.getAttributeNS(Snoopy.namespace, 'net'))==coarse) {
			coarseNet.tokens.push(token);
		}
	});
	
	Snoopy.net.texts.each(function(text){
		if(Number(text.getAttributeNS(Snoopy.namespace, 'net'))==coarse) {
			coarseNet.texts.push(text);
		}
	});
	
	return coarseNet;
}
function fireCoarseTransition(coarse)
{
	var arr_trans = [];
	Snoopy.net.coarseNets.get(coarse).transitions.each(function(transition)
	{
		//transition.getParent().fire();
		if(transition.getParent().canFire()) // firing possible
		{
			arr_trans.include(transition.getParent());
		}
	});
	if(arr_trans.length>0)
	{
		arr_trans.getRandom().fire();
	}
	else
	{
		// Kantentyp prüfen und spezielle Meldung ausgeben
		alert("firing not possible,\r\nrequired: m(p)>=w.");
	}
}
function fireSingle(transitions) 
{
	// copy Array
	var transitions = $A(transitions);
	if(transitions.length>0) 
	{
		var randomTransition = transitions.getRandom();
		if(randomTransition.fire()) 
		{
			return true;
		} 
		else 
		{
			transitions.erase(randomTransition);
			fireSingle(transitions);
		}	
	} 
	else 
	{
		setTimeout("alert('dead state - no transitions to fire')",2500); // message after fire-animation
		return false;
	}
}
// shuffle function for transition-arrays
Array.implement({
	shuffle:function() {
		this.sort(function (x,y) { return Math.floor(Math.random()*3)-1; });
		return this;
	}
});
function fireIntermediate(transitions) 
{
	var 
	transitions = $A(transitions),		// Copy Array for manipulation
	readyToFire = new Array(), 			// Array for transitions that are able to fire
	randomTrans = 0; 					// random value for intermediate stepping
	
	// check what transition can fire
	transitions.each(function(transition) 
	{
		if(transition.canFire()) 
		{
			readyToFire.push(transition);
		}
	});
	randomTrans = $random(1, readyToFire.length);
	readyToFire.shuffle(); // mix the Tr-Object
	readyToFire.each(function(transition, index) 
	{
		if(index<randomTrans) 
		{
			transition.fire();	
		}
	});
}
function fireMaximum()
{
	trans = $$('g.Transition');
	trans.shuffle();
	trans.each(function(transition)
	{
		transition.fire();
	});
}
function fireLogicTransition(transition) 
{
	if(transition.canFire()) // firing possible
	{
		return true;
	}
	else	// only for spped (for spept, you must look for the input-edge arctype)
	{
		alert("firing not possible,\r\nrequired: m(p)>=w.");
		return false;
	}
}
/* #########################################  sequence part   ###############################################################################*/
// fire a special transition over there id
function setTokenSpecial(place_id,value) 
{
	myMapApp.comboboxes["seqstart"].disableCombobox(); // deativate the combobox for the user

	var place = $(place_id);
	
	// coloring the active place
	colorCurrentPlace(place_id);
	// after a variable time coloring the place as worn-out
	window.setTimeout("colorPutPlace("+place_id+")",mstime_marking); // keine Objekte übergeben -> MooTools-Fehler
	if(setMarking(place, value)) 
	{
		return true;
	} 
	else 
	{
		return false;
	}
}
// current place gets new color
function colorCurrentPlace(place)
{
	document.getElementById(place).getElementsByTagName("circle")[0].setAttribute('fill',rgb_current_place);
}
// place gets new color
function colorPutPlace(place)
{
	document.getElementById(place).getElementsByTagName("circle")[0].setAttribute('fill',rgb_put_place);
}
// fire a special transition over there id
function fireSpecial(transition_id) 
{
	var transition = $(transition_id);
	
	try
	{
		// funktioniert nicht bei CoarseTransition ?!?
		var transfill = transition.getElementsByTagName("rect")[0].getAttribute('fill');
		
		if(transfill!=rgb_current_transition)
		{
			//window.setTimeout("colorTransition("+transition_id+")",mstime_coloring); // keine Objekte übergeben -> MooTools-Fehler
			colorCurrentTransition(transition_id); // keine Objekte übergeben -> MooTools-Fehler
			// after a variable time coloring the transition as worn-out
			if(transition.fire())
			{
				window.setTimeout("colorFiredTransition("+transition_id+")",mstime_coloring); // keine Objekte übergeben -> MooTools-Fehler
			}
			else
			{
				window.setTimeout("colorFiredTransition("+transition_id+")",transfill); // keine Objekte übergeben -> MooTools-Fehler
			}
		}			
	}
	catch(e)
	{
		// . .
	}
	return true;
}
// set transitions and places in the starting-point
function setNormalColors()
{
	seq_i = 0;				// global seq-step-id get 0
	// set old marking
	resetInitialMarking();
	// all used nodes gets the normal color
	for(var i in pl_buffer)
	{
		var buf = document.getElementById(i);
		buf.getElementsByTagName("circle")[0].setAttribute('fill',pl_buffer[i]);
	}
	for(var j in tr_buffer)
	{
		var buf2 = document.getElementById(j);
		buf2.getElementsByTagName("rect")[0].setAttribute('fill',tr_buffer[j]);
	}
}
// current transition gets new color
function colorCurrentTransition(trans)
{
	// gets the SVG-rect-element for the transition
	var transition = document.getElementById(trans).getElementsByTagName("rect")[0].setAttribute('fill',rgb_current_transition);
}
// fired transition gets other color
function colorFiredTransition(trans)
{
	// gets the SVG-rect-element for the transition
	var transition = document.getElementById(trans).getElementsByTagName("rect")[0];
	
	if(transition.getAttribute('fill') == rgb_current_transition)
	{
		transition.setAttribute('fill',rgb_put_transition);
	}
}

/* ###################################  END - sequence part  ########################################################################## */


function playNet(maxSteps) 
{
	
	// in case of playStepForwardPressed()
	if(maxSteps==1) 
	{
		maxSteps = (Snoopy.animation.currentStep==0) ? 1 : Snoopy.animation.currentStep + maxSteps;
		Snoopy.animation.currentMaxSteps = (Snoopy.animation.currentStep==0) ? 0 : maxSteps;
	}

	Snoopy.animation.play = true;
	Snoopy.animation.pause = false;
	Snoopy.animation.stop = false;

	Snoopy.animation.transitions = new Array();
	Snoopy.animation.firedTransitions = new Array();

	if(Number(Snoopy.animation.currentStep)<Number(maxSteps)) 
	{
		switch(Snoopy.animation.stepping) 
		{
			case 'single':
				fireSingle($$('g.Transition'));
				break;
			case 'intermediate':
				fireIntermediate($$('g.Transition'));
				break;
			case 'maximum':
				fireMaximum();
				break;
			case 'sequence': break;
			default: 
		}
	} 
	else 
	{
		pauseNet();
	}
}

function pauseNet() 
{
	
	Snoopy.animation.play = false;
	Snoopy.animation.pause = true;
	Snoopy.animation.stop = false;
	
	myMapApp.buttons["playForward"].setSwitchValue(false, false);
	//myMapApp.buttons["playStepForward"].setSwitchValue(false, false);
}

function stopNet() 
{
	Snoopy.animation.play = false;
	Snoopy.animation.pause = false;
	Snoopy.animation.stop = true;
	
	Snoopy.animation.currentStep=0;
	if($('currentStep')) {
		$('currentStep').firstChild.data = 'current step: '+Snoopy.animation.currentStep;	
	}
	myMapApp.buttons["playForward"].setSwitchValue(false, false);
	resetInitialMarking();
}

function getScreenBBox(element) 
{
  // macro to create an SVGPoint object
  function createPoint (x, y) 
  {
	var point = document.documentElement.createSVGPoint();
    point.x = x;
    point.y = y;
    return point;
  }

  // macro to create an SVGRect object
  function createRect (x, y, width, height)
  {
	var rect = new Element('rect', {
		'class':'bbox',
		'x':x,
		'y':y,
		'width':width,
		'height':height
	});//document.documentElement.createSVGRect();

    return rect;
  }
  // Fehleranfällig selten!! -> element has no proberties (Teillsg. try+catch)
	try{
  // get the complete transformation matrix
  var matrix = element.getScreenCTM();
  // get the bounding box of the target element
  var box = element.getBBox();
}
catch(e){}
  // create an array of SVGPoints for each corner
  // of the bounding box and update their location
  // with the transform matrix
  var corners = [];
  var point = createPoint(box.x, box.y);
  corners.push( point.matrixTransform(matrix) );
  point.x = box.x + box.width;
  point.y = box.y;
  corners.push( point.matrixTransform(matrix) );
  point.x = box.x + box.width;
  point.y = box.y + box.height;
  corners.push( point.matrixTransform(matrix) );
  point.x = box.x;
  point.y = box.y + box.height;
  corners.push( point.matrixTransform(matrix) );
  var max = createPoint(corners[0].x, corners[0].y);
  var min = createPoint(corners[0].x, corners[0].y);

  // identify the new corner coordinates of the
  // fully transformed bounding box
  for (var i = 1; i < corners.length; i++) 
  {
    var x = corners[i].x;
    var y = corners[i].y;
    if (x < min.x) 
	{
      min.x = x;
    }
    else if (x > max.x) 
	{
      max.x = x;
    }
    if (y < min.y) 
	{
      min.y = y;
    }
    else if (y > max.y) 
	{
      max.y = y;
    }
  }
  // return the bounding box as an SVGRect object
  return createRect(min.x, min.y, max.x - min.x, max.y - min.y);
}
/* ########################       ZOOM        ################################################################ */
function zooming(value)
{
	$('net').set('opacity', 0);
	var translate = $('net').getAttributeNS(Snoopy.namespace, 'translate');
	
	$('net').removeAttribute('snp:scale');
	$('net').setAttributeNS(Snoopy.namespace, 'snp:scale', value);
	
	$('net').setAttribute('transform', 'scale('+value+') translate('+translate+')');
	$('net').set('opacity', 1);
	setSVGSize();
}

function zoomIn(value){
	var scale = Number($('net').getAttributeNS(Snoopy.namespace, 'scale')) + value;
	if(scale<2.1 && scale>0.09)
	{
		myMapApp.sliders["zoom"].setValue(scale,false);
		zooming(scale);
	}
}

function zoomReset()
{
  var scale = 1;
  var translate = $('net').getAttributeNS(Snoopy.namespace, 'translate');
  $('net').setAttribute('transform', 'scale('+scale+') translate('+translate+')');
  $('net').removeAttribute('snp:scale');
  $('net').setAttributeNS(Snoopy.namespace, 'snp:scale', scale);
}

function zoomOut(value)
{
	var scale = Number($('net').getAttributeNS(Snoopy.namespace, 'scale')) - value;
	if(scale<2.1 && scale>0.09) 
	{
		myMapApp.sliders["zoom"].setValue(scale,false);
		zooming(scale);
	}
}
function setTokenOpacity(token_element, token_coarse) 
{
	if(myMapApp!=null) 
	{
		var coarse = Number(myMapApp.comboboxes["nets"].getCurrentSelectionsIndex())+1;
		Snoopy.net.coarseNets.get(token_coarse).tokens.push(token_element);
		setNetOpacity(coarse, '1', '0');
	}
}
function setNetOpacity(coarse, opacity, opacity2) 
{
	Snoopy.net.coarseNets.each(function(coarseNet, i)
	{
		if(i==coarse) 
		{
			coarseNet.transitions.each(function(transition)
			{
				transition.set('opacity', opacity);
			});
			coarseNet.coarseTransitions.each(function(coarseTransition)
			{
				coarseTransition.set('opacity', opacity);
			});
			coarseNet.places.each(function(place)
			{
				place.set('opacity', opacity);
			});
			coarseNet.coarsePlaces.each(function(coarsePlace)
			{
				coarsePlace.set('opacity', opacity);
			});
			coarseNet.edges.each(function(edge)
			{
				edge.set('opacity', opacity);
			});
			coarseNet.tokens.each(function(token)
			{
				token.set('opacity', opacity);
			});
			coarseNet.texts.each(function(text)
			{
				text.set('opacity', opacity);
			});
		} 
		else 
		{
			coarseNet.transitions.each(function(transition){
				transition.set('opacity', opacity2);
			});
			coarseNet.coarseTransitions.each(function(coarseTransition){
				coarseTransition.set('opacity', opacity2);
			});
			coarseNet.places.each(function(place){
				place.set('opacity', opacity2);
			});
			coarseNet.coarsePlaces.each(function(coarsePlace){
				coarsePlace.set('opacity', opacity2);
			});
			coarseNet.edges.each(function(edge){
				edge.set('opacity', opacity2);
			});
			coarseNet.tokens.each(function(token){
				token.set('opacity', opacity2);
			});
			coarseNet.texts.each(function(text){
				text.set('opacity', opacity2);
			});
		}
	});
	$('net').set('opacity', 1);
	var scale = $('net').getAttributeNS(Snoopy.namespace, 'scale');
	var translate = $('net').getAttributeNS(Snoopy.namespace, 'translate');
	$('net').setAttribute('transform', 'scale('+scale+') translate('+translate+')');
	
}
/* fire rules and animation */
Element.implement
({
	fire: function()
	{
		var canFire = true,
		firing = this.getAttributeNS(Snoopy.namespace, 'firing');

		if(this.hasClass('CoarseTransition')) 
		{
			var coarse = Number(this.getAttributeNS(Snoopy.namespace, 'coarse'));
			fireCoarseTransition(coarse);
		} 
		else 
		{
			if(firing!='0' && firing!='') 
			{
				canFire = false;
	      	} 
			else 
			{
				// part for logic transitions
				if(arrLogicTransitions.contains(this.get('id')))
				{
					var valid = fireLogicTransition(this);
				}
				else // no logic transition
				{
					var valid = true;
				}
				if(valid)
				{
					var rects = this.getElements('rect.Transition');
				
					rects.each(function(rect)
					{
						var outputs = getEdges(rect.get('id'), 'source');
						var inputs = getEdges(rect.get('id'), 'target');
						
						if(inputs.length>0) 
						{
							var fehler = false;
							
							inputs.each(function(input)
							{
								var place = $(input.getAttributeNS(Snoopy.namespace, 'source'));
								if(place) 
								{
									var multiplicity = Number(input.getParent().getAttributeNS(Snoopy.namespace, 'multiplicity'));
									var marking = Number(place.getParent().getAttributeNS(Snoopy.namespace, 'marking'));
									// gets arctype
									var arctype = input.getParent().getAttribute("class");
									
									// normal fire rule
									if(arctype=='Edge' && (marking<multiplicity || marking==0)) 
									{
										canFire = false;
										fehler = "firing not possible,\r\nrequired: m(p)>=w.";
									}
								}
							});
							if(canFire)
							{
								animatePreStep(rect, inputs, outputs);
							}
							else
							{
								if(!Snoopy.animation.play == true) // if playNet activated -> no fire rule messages
									alert(fehler);
							}
						}
						else 
						{
							animatePostStep(rect, inputs, outputs);
						}
					});
				}
				else
				{
					
				}
			}
			if(canFire) 
			{
				Snoopy.animation.currentStep++;
				if($('currentStep')) 
				{
					$('currentStep').firstChild.data = 'current Step: '+Snoopy.animation.currentStep;	
				}
			}
		}
		return canFire;
	},
	canFire: function() {
		var canFire = true, firing = this.getAttributeNS(Snoopy.namespace, 'firing');
		if(firing!='0' && firing!='') 
		{
        	canFire = false;
      	} 
		else 
		{
			var rects = this.getElements('rect.Transition');
			rects.each(function(rect)
			{
				var outputs = getEdges(rect.get('id'), 'source');
				var inputs = getEdges(rect.get('id'), 'target');
				
				if(inputs.length>0) // Sind Kanten anliegend
				{
					inputs.each(function(input)
					{
						var place = $(input.getAttributeNS(Snoopy.namespace, 'source'));
						if(place) 
						{
							var multiplicity = Number(input.getParent().getAttributeNS(Snoopy.namespace, 'multiplicity'));
							var marking = Number(place.getParent().getAttributeNS(Snoopy.namespace, 'marking'));
							
							if(marking < multiplicity || marking == 0) 
							{
								canFire = false;
							}
						}
					});
				} 
				else 
				{
					canFire = true;
				}
			});
		}
		return canFire;
	}
});
// gets the arcs were closed at the choosen transition and returns these as objects in an Array
function getEdges(transitionId, attribute)
{
	var edges = [];
	$$('polyline.Edge').each(function(polyline){
		if(String(polyline.getAttributeNS(Snoopy.namespace, attribute))==String(transitionId)) {
			edges.push(polyline);
		}
	});
	return edges;
}

/* Animationsablauf bei Feuerbereitschaft (canFire)
 * 1.Parameter: transition - Array mit Rect-Objekten - Transitions
 * 2.Parameter: inputs - Array mit Polyline-Objekten - Kanten
 * 3.Parameter: outputs - Array mit Folge-Place-Objekten - Places
 */
function animatePreStep(transition, inputs, outputs)
{
	transition.getParent().removeAttribute('snp:firing');
	transition.getParent().setAttributeNS(Snoopy.namespace, 'snp:firing', '1');
	
    var preAnimator;
    var preToken = new Array();
    var completeToken = new Array();
    
	inputs.each(function(input)
	{
		var polylines = input.getParent().getElements('polyline');
		polylines.each(function(polyline)
		{
			var points = polyline.get("points").trim().split(" ");
			var path = new Array();
			
			points.each(function(point, n)
			{
				path[n] = {x: point.split(",")[0], y: point.split(",")[1]};
			});
			
	        var startpoint = points[0];
	        var x1 = Number(startpoint.split(",")[0]);
	        var y1 = Number(startpoint.split(",")[1]);
	        var netId = polyline.getAttributeNS(Snoopy.namespace, 'net');

	        var token = new Token
			({
				'x': x1, 
				'y': y1,
				'fill': '#f00',
				'net': netId
			});
			
			var token_element = token.create();
			setTokenOpacity(token_element, netId);
	        $('net').adopt(token_element);
	
			preToken[preToken.length] = token_element;

			var animators = new Array();
			
			path.each(function(point, n)
			{
				if((n+1)<path.length) 
				{
					var subjectX = new NumericalStyleSubject(token_element, 'cx', point.x, path[n+1].x);
			        var subjectY = new NumericalStyleSubject(token_element, 'cy', point.y, path[n+1].y);
					animators[n] = new Animator({
						duration: Snoopy.animation.duration,
						transition: Animator.tx.linear,
						onComplete: function() {
							completeToken.push("ready");
							if(completeToken.length==inputs.length){
								preToken.each(function(token){
									token.destroy();
								});
								transition.getParent().removeAttribute('snp:firing');
								transition.getParent().setAttributeNS(Snoopy.namespace, 'snp:firing', '0');
								animatePostStep(transition, inputs, outputs);
							}
						}
			        }).addSubject(subjectX).addSubject(subjectY);
				}
			});
			
			animators.each(function(animator, n)
			{
				if(animators.length>1)
				{
					animator.setOptions
					({
						duration : Snoopy.animation.duration/animators.length,
						onComplete: function()
						{
							if((n+1)<animators.length)
							{
								animators[n+1].play();
							}
							if((n+1)==animators.length)
							{
								completeToken.push("ready");
								if(completeToken.length==inputs.length)
								{
									preToken.each(function(token)
									{
										token.destroy();
									});
									transition.getParent().removeAttribute('snp:firing');
									transition.getParent().setAttributeNS(Snoopy.namespace, 'snp:firing', '0');
									animatePostStep(transition, inputs, outputs);
								}	
							}
						}
					});
				}
			});
			
			animators[0].play();
	      	var source = $(String(input.getParent().getAttributeNS(Snoopy.namespace, 'source')));
			// Bestimmung von W des Vorgänger-Platzes
	      	var multiplicity = input.getParent().getAttributeNS(Snoopy.namespace, 'multiplicity');
	      	if(multiplicity==null || multiplicity=='') multiplicity = 1;
			// Token des Vorgänger-Platzes bestimmen
			var place = $(input.getAttributeNS(Snoopy.namespace, 'source'));
			if(place)
			{
				var mp = Number(place.getParent().getAttributeNS(Snoopy.namespace, 'marking'));
			}
			var arctype = input.getParent().getAttribute("class");
			
			switch(arctype)
			{
				case "Edge": 
					decreaseMarking(source, multiplicity);
					break;
				default: 
			}
		});
	});
  }
  
  function animatePostStep(transition, inputs, outputs)
  {
	var postAnimator;
    var postToken = new Array();
    var completeToken = new Array();
	
    if(outputs.length>0)
	{
		transition.getParent().removeAttribute('snp:firing');
		transition.getParent().setAttributeNS(Snoopy.namespace, 'snp:firing', '1');
		outputs.each(function(output)
		{
			Snoopy.animation.transitions[Snoopy.animation.transitions.length] = output;
			var polylines = output.getParent().getElements('polyline');
			polylines.each(function(polyline)
			{
				var points = polyline.get("points").trim().split(" ");
				var path = new Array();

				points.each(function(point, n)
				{
					path[n] = {x: point.split(",")[0], y: point.split(",")[1]};
				});
				
				var startpoint = points[0];
		        var x1 = Number(startpoint.split(",")[0]);
		        var y1 = Number(startpoint.split(",")[1]);
		        var netId = polyline.getAttributeNS(Snoopy.namespace, 'net');
				var token = new Token({
					'x': x1, 
					'y': y1,
					'fill': '#f00',
					'net': netId
				});

				var token_element = token.create();
				setTokenOpacity(token_element, netId);
		        $('net').adopt(token_element);

				postToken[postToken.length] = token_element;

				var animators = new Array();

				path.each(function(point, n)
				{
					if((n+1)<path.length)
					{
						var subjectX = new NumericalStyleSubject(token_element, 'cx', point.x, path[n+1].x);
				        var subjectY = new NumericalStyleSubject(token_element, 'cy', point.y, path[n+1].y);
						animators[n] = new Animator
						({
							duration: Snoopy.animation.duration,
							transition: Animator.tx.linear,
							onComplete: function()
							{
								completeToken.push("ready");
								Snoopy.animation.firedTransitions.push('ready');
								
								if(completeToken.length==outputs.length)
								{
									postToken.each(function(token)
									{
										token.destroy();
									});
									outputs.each(function(output)
									{
										var target = $(String(output.getParent().getAttributeNS(Snoopy.namespace, 'target')));
								      	var multiplicity = output.getParent().getAttributeNS(Snoopy.namespace, 'multiplicity');
								      	if(multiplicity==null || multiplicity=='') multiplicity = 1;
										
										if($(String(output.getAttributeNS(Snoopy.namespace, 'target'))).getAttribute('class')!='CoarsePlace')
										{
											increaseMarking(target, multiplicity);
										}
									});
									transition.getParent().removeAttribute('snp:firing');
									transition.getParent().setAttributeNS(Snoopy.namespace, 'snp:firing', '0');
									if(Snoopy.animation.firedTransitions.length==Snoopy.animation.transitions.length && Snoopy.animation.play)
									{
										playNet.delay(100, transition, Snoopy.animation.currentMaxSteps);
									}
									
								}
							}
				        }).addSubject(subjectX).addSubject(subjectY);
					}
				});

				animators.each(function(animator, n)
				{
					if(animators.length>1)
					{
						animator.setOptions
						({
							duration : Snoopy.animation.duration/animators.length,
							onComplete: function()
							{
								if((n+1)<animators.length)
								{
									animators[n+1].play();
								}
								if((n+1)==animators.length)
								{
									completeToken.push("ready");
									Snoopy.animation.firedTransitions.push('ready');
									if(completeToken.length==outputs.length)
									{
										postToken.each(function(token)
										{
											token.destroy();
										});
										outputs.each(function(output)
										{
											var target = $(String(output.getParent().getAttributeNS(Snoopy.namespace, 'target')));
									      	var multiplicity = output.getParent().getAttributeNS(Snoopy.namespace, 'multiplicity');
									      	if(multiplicity==null || multiplicity=='')
												multiplicity = 1;
											
											if($(String(output.getAttributeNS(Snoopy.namespace, 'target'))).getAttribute('class')!='CoarsePlace')
											{
												increaseMarking(target, multiplicity);
											}
										});
										transition.getParent().removeAttribute('snp:firing');
										transition.getParent().setAttributeNS(Snoopy.namespace, 'snp:firing', '0');
										
										if(Snoopy.animation.firedTransitions.length==Snoopy.animation.transitions.length && Snoopy.animation.play)
											playNet.delay(100, transition, Snoopy.animation.currentMaxSteps);
										
									}	
								}
							}
						});
					}
				});

				animators[0].play();
			});
		});
	} 
	else
	{
		if(Snoopy.animation.play)
			playNet.delay(200, transition, Snoopy.animation.currentMaxSteps);
	}
  }
	// new function
	function setNewMarking(place, value)
	{
		if(value>=0)
		{
			setMarking(place, value);			
		}
		else
			return false;
	}
	// add value with old token
	function increaseMarking(place, value)
	{
		setMarking(place, Number(place.getAttributeNS(Snoopy.namespace, 'marking'))+Number(value));
    }
	function decreaseMarking(place, value)
	{
		if(place.getAttributeNS(Snoopy.namespace, 'marking')>0)
		{
			setMarking(place, Number(place.getAttributeNS(Snoopy.namespace, 'marking'))-Number(value));			
		}
		else
			return false;
    }
	function setMarking(place, value)
	{
      var marking = Number(place.getAttributeNS(Snoopy.namespace, 'marking'));
		
      var tokenCircles = place.getElements('circle.Token');
      var placeCircles = place.getElements('circle.Place'); // Fehlerhaft
	  
      var tokenTexts = place.getElements('text.Token');

      var cx = 0;
      var cy = 0;
	
      if(value>3)
	  {
			if(tokenCircles.length!=0)
			{
			  for(var i=0;i<tokenCircles.length;i++)
			  {
				place.removeChild(tokenCircles[i]);
			  }
			}
			if(tokenTexts.length==0) 
			{
			  for(var i=0;i<placeCircles.length;i++)
			  {
				cx = Number(placeCircles[i].getAttribute('cx'));
				cy = Number(placeCircles[i].getAttribute('cy'));
				var textNode = document.createTextNode(value);
				var text = document.createElementNS("http://www.w3.org/2000/svg","text");
				
				text.setAttribute('class', 'Token');
				text.setAttributeNS(Snoopy.namespace, 'snp:net', placeCircles[i].getAttributeNS(Snoopy.namespace, 'net'));
				
				if(value>9 && value<100)
				{
					text.setAttribute('x', cx-7);
				}
				else if(value>99)
				{
					text.setAttribute('x', cx-10);
				}
				else
				{
					text.setAttribute('x', cx-4);
				}
				text.setAttribute('y', cy+4);
				text.appendChild(textNode);
				
				setTokenOpacity(text, placeCircles[i].getAttributeNS(Snoopy.namespace, 'net'));
				
				place.adopt(text);
			  }
			} 
			else 
			{
			  for(var i=0;i<tokenTexts.length;i++)
			  {
				var text = tokenTexts[i];
				if(Number(value)==10) text.setAttribute('x', Number(text.getAttribute('x'))-3);
				if(Number(value)==100) text.setAttribute('x', Number(text.getAttribute('x'))-3);
				text.firstChild.nodeValue = value;
			  }
			}
      }
	  // ??? - Vergleich mit if(value==3)
      if(value<4)
	  {
			if(tokenTexts.length!=0)
			{
			  for(var i=0;i<tokenTexts.length;i++)
			  {
			   place.removeChild(tokenTexts[i]);
			  }
			}
			if(tokenCircles.length!=0){
			  for(var i=0;i<tokenCircles.length;i++)
			  {
				place.removeChild(tokenCircles[i]);
			  }
			}
      }
	  // ???
      if(value==3)
	  {
        for(var i=0;i<placeCircles.length;i++)
		{
          cx = Number(placeCircles[i].getAttribute('cx'));
          cy = Number(placeCircles[i].getAttribute('cy'));
		  var netId = placeCircles[i].getAttributeNS(Snoopy.namespace, 'net');
          var token_1 = new Token({
			'net': netId,
			'x': cx,
			'y': cy-4, 
			'r': 2
		  });
		  var token_element = token_1.create();
		  setTokenOpacity(token_element, netId);
          place.adopt(token_element);
          var token_2 = new Token({
			'net': netId,
			'x': cx+3.5,
			'y': cy+2, 
			'r': 2
		  });
		  var token_element = token_2.create();
		  setTokenOpacity(token_element, netId);
          place.adopt(token_element);
          var token_3 = new Token({
			'net': netId,
			'x': cx-3.5,
			'y': cy+2, 
			'r': 2
		  });
		  var token_element = token_3.create();
		  setTokenOpacity(token_element, netId);
          place.adopt(token_element);
        }
      }
      if(value==2)
	  {
        for(var i=0;i<placeCircles.length;i++){
          cx = Number(placeCircles[i].getAttribute('cx'));
          cy = Number(placeCircles[i].getAttribute('cy'));
		  var netId = placeCircles[i].getAttributeNS(Snoopy.namespace, 'net');
          var token_1 = new Token({
			'net': netId,
			'x':cx-3.5,
			'y':cy, 
			'r':2
		  });
		  var token_element = token_1.create();
		  setTokenOpacity(token_element, netId);
          place.adopt(token_element);
          var token_2 = new Token({
			'net': netId,
			'x':cx+3.5,
			'y':cy, 
			'r':2
		  });
		  var token_element = token_2.create();
		  setTokenOpacity(token_element, netId);
          place.adopt(token_element);
        }
      }
      if(value==1)
	  {
		for(var i=0;i<placeCircles.length;i++){
          cx = Number(placeCircles[i].getAttribute('cx'));
          cy = Number(placeCircles[i].getAttribute('cy'));
		  var netId = placeCircles[i].getAttributeNS(Snoopy.namespace, 'net');
          var token = new Token({
			'net': netId,
			'x':cx, 
			'y':cy, 
			'r':2
		  });
		  var token_element = token.create();
		  setTokenOpacity(token_element, netId);
          place.adopt(token_element);
        }
      }
	  place.removeAttribute("snp:marking");
      place.setAttributeNS(Snoopy.namespace, 'snp:marking', value);
    }

var Token = new Class
({
	
	Implements: [Chain, Events, Options],
	options: 
	{
		'id': $time(),
		'net': '1',
		'x':0,
		'y':0,
		'r':4,
		'stroke':'rgb(0,0,0)',
		'fill':'rgb(0,0,0)'
	},
	initialize: function(options)
	{
		this.setOptions(options);
	},
	// set new token
	create: function()
	{
		var element = new Element('circle');
		element.setAttribute('id', String(this.options.id));
		element.setAttribute('class', String('Token'));
		element.setAttribute('cx', String(this.options.x));
		element.setAttribute('cy', String(this.options.y));
		element.setAttribute('r', String(this.options.r));
		element.setAttribute('stroke', String(this.options.stroke));
		element.setAttribute('fill', String(this.options.fill));
		element.setAttributeNS(Snoopy.namespace, 'snp:net', String(this.options.net));
		return element;
	}
});
// text Comment data in a Table
function createLineBreaks2() 
{
	// comment-correction for y-dimension
	var g_text = $$('g.Comment');
	var y_neu;
	g_text.each(function(t)
	{
		y_neu = (t.getChildren()[0].get('y')-15);
		t.getChildren()[0].set('y',y_neu);		
	});
	var texts = $$('text');
	texts.each(function(text){
		var temp = text.get('text'),
		lines = temp.split('\n'),
		parent_x = text.get('x');
		if(lines.length>1) {
			text.empty();
			lines.each(function(line, i){
				var whitespaces = line.split('');
				if(line.clean()!='')
				{	
					var tspan_line = new Element('tspan', {
						'x':parent_x-50,
						'dy':'15'
					}).appendText(line).injectInside(text);	
					tspan_line.injectInside(text);
				}
			});
		}
	});
	var texts_tab = $$('text.table');
	texts_tab.each(function(text)
	{
		var temp = text_tab.get('text'),
		lines = temp.split('\n'),
		parent_x = text_tab.get('x');
		parent_y = text_tab.get('y');
		
		if(lines.length>1) 
		{
			//text.empty();
			var k=0;
			for(var i=0;i<lines.length;i++)
			{
				
				if(lines[i].clean()!='') 
				{	
					var newtext = document.createElement("text");
					newtext.setAttribute("x",parent_x);
					newtext.setAttribute("y",(Number(parent_y)+Number(20*(k+1))));
					newtext.setAttribute("style","font-family:courier,monospace;font-size:9px;");
					if((k%2)==0)
					{
						newtext.setAttribute("dx","1em");
					}
					else
					{
						newtext.setAttribute("dx","2.4em");
					}
					var cols = lines[i].split(' ');
					
					for(var j=0;j<cols.length;j++)
					{
						if(cols[j]!='')
						{
							var columntext = document.createTextNode(cols[j]);
							var t_span = document.createElement("tspan");
							t_span.appendChild(columntext);
							newtext.appendChild(t_span);
						}
					}
					g_text[0].appendChild(newtext);
					k++;
				}
			}
		}
	});
}
