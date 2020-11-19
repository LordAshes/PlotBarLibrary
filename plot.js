//---------------------------------------------------------------------
// Plot.js is a library for creating 3D looking bar plots.
//
// The library is powerful in that it has a lot parameters allowing
// all kinds of complex plots including overlapping bars while still
// keeping it fairly simple to create simple bar graphs.
//---------------------------------------------------------------------

var width = 1024;
var height = 768;
var tSpace = 50;
var bSpace = 50;
var rSpace = 50;
var lSpace = 50;
var pWidth = 1024-rSpace-lSpace;
var pHeight = 768-tSpace-bSpace;
var minVal = 0;
var maxVal = 100;
var zoom = 1.0;

// Function for setting the zoom factor of the plot, allowing creation of smaller
// or bigger versions of the plot without having to adjust all creation parameters
function setZoom(factor)
{
	// Store for use by the Area function
	zoom = factor;
}

//---------------------------------------------------------
// Function for creating a plot area. Draws plot bacground
//---------------------------------------------------------
// canvas = Canvas object on which to draw the plots
// title = Title of the plot. Appears above plot area
// col = Color of plot background
// min = Minimum value on the scale
// max = Maximum value on the scale
// w = Width of the plot
// h = Height of the plot
// xs = Indent space to vertial scale values in pixels
// ts = Indent space from top to top of plot
// bs = Indent space from bottom to bottom of plot
// rs = Indent space from right side to right of plot
// ls = Indent space from left side to left of plot
// depth = Offset into the screen
function area(canvas,title,col,min,max,w,h,xs,ts,bs,ls,rs,depth=0)
{	
    // User values are mapped here to local variables to allow easy transformation of user inputs if needed
	minVal=min;
	maxVal=max;
	width=w;
	height=h;
	tSpace=ts;
	bSpace=bs;
	rSpace=rs;
	lSpace=ls;
	pWidth = width-rSpace-lSpace;
	pHeight = height-tSpace-bSpace;
	
	// Get the 2D context for drawing
	var ctx = canvas.getContext("2d");
	
	// Apply zoom factor before any drawing
	ctx.scale(zoom,zoom);
	
	// Centre title
	var titleWidth = measureTextWidth(title,30);
	// Draw title
	ctx.font = "30px Georgia";
	ctx.fillText(title,lSpace+(pWidth/2)-(titleWidth/2),30);
	// Draw background
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.fillStyle= col;
	ctx.fillRect(lSpace, tSpace, pWidth, pHeight);
	ctx.stroke();
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.strokeStyle = "black";
	ctx.moveTo(lSpace, tSpace+pHeight);
	ctx.lineTo(lSpace+depth, tSpace+pHeight-depth);
	ctx.lineTo(pWidth+lSpace, tSpace+pHeight-depth);
	ctx.lineTo(pWidth+lSpace, tSpace+pHeight);
	ctx.closePath();
	ctx.stroke();
	ctx.fillStyle="#AAAAAA";
	ctx.fill();
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.strokeStyle = "black";
	ctx.moveTo(lSpace, tSpace+pHeight);
	ctx.lineTo(lSpace+depth, tSpace+pHeight-depth);
	ctx.lineTo(lSpace+depth, tSpace);
	ctx.lineTo(lSpace, tSpace);
	ctx.closePath();
	ctx.stroke();
	ctx.fillStyle="#AAAAAA";
	ctx.fill();
	ctx.beginPath();
	ctx.lineWidth = "3";
	ctx.strokeStyle = "black";
	ctx.rect(lSpace, tSpace, pWidth, pHeight);
	ctx.stroke();
	// Draw scale
	ctx.fillStyle = "black";
	ctx.font = "20px Georgia";
	ctx.fillText(maxVal,xs,tSpace);
	ctx.fillText(Math.round((maxVal-minVal)/4+minVal),xs,tSpace+(pHeight*3/4));
	ctx.fillText(Math.round((maxVal-minVal)/2+minVal),xs,tSpace+(pHeight/2));
	ctx.fillText(Math.round((maxVal-minVal)*3/4+minVal),xs,tSpace+(pHeight/4));
	ctx.fillText(Math.round(minVal),xs,tSpace+pHeight);
}
	
//---------------------
// Draw plot area grid 
//---------------------
function grid(canvas)
{
	// Set opacity for the grid so that it is not intrusive
	var opacity = 0.10;

    // Get 2D context for drawing
	var ctx = canvas.getContext("2d");
	
	// Draw grid
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.strokeStyle = 'rgba(0,0,0,'+opacity+')';
	ctx.moveTo(rSpace,tSpace+(pHeight*3/4));
	ctx.lineTo(rSpace+pWidth,tSpace+(pHeight*3/4));
	ctx.stroke();		
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.strokeStyle = 'rgba(0,0,0,'+opacity+')';
	ctx.moveTo(rSpace,tSpace+(pHeight/2));
	ctx.lineTo(rSpace+pWidth,tSpace+(pHeight/2));
	ctx.stroke();		
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.strokeStyle = 'rgba(0,0,0,'+opacity+')';
	ctx.moveTo(rSpace,tSpace+(pHeight/4));
	ctx.lineTo(rSpace+pWidth,tSpace+(pHeight/4));
	ctx.stroke();		
}
	
//-----------------
// Draw a plot bar
//-----------------
// canvas = Canvas object on which to draw the plots
// col = Color for the bar
// label = Label for the bar (appears under bar)
// x = Horizontal position of the left side of the bar in pixels
// y = Vertical position of the front top side of the bar in pixels
// val = Value of the bar
// note = Text displayed above bar. Defaults to dollar value if note is empty.
// depth = Offset into the screen
function bar(canvas,col,label,x,w,val,note="",depth=0)
{
	// Calculate fraction of value compared to scale max 
	var per = (val-minVal)/(maxVal-minVal);

	// Get 2D context for drawing
	var ctx = canvas.getContext("2d");

    // Draw bar
	var top = tSpace + tSpace + (pHeight-tSpace) - ((pHeight-tSpace)*per);
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.fillStyle = col;
	ctx.fillRect(x+depth, top-depth, w, ((pHeight-tSpace)*per));
	ctx.stroke();		
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.strokeStyle = "black";
	ctx.rect(x+depth, top-depth, w, ((pHeight-tSpace)*per));
	ctx.stroke();		
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.strokeStyle = "black";
	ctx.moveTo(x+depth, top-depth);
	ctx.lineTo(x+10+depth, top-10-depth);
	ctx.lineTo(x+10+w+depth, top-10-depth);
	ctx.lineTo(x+w+depth, top-depth);
	ctx.closePath();
	ctx.stroke();		
	ctx.fillStyle=col;
	ctx.fill();
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.strokeStyle = "black";
	ctx.moveTo(x+w+depth, top-depth);
	ctx.lineTo(x+w+10+depth, top-10-depth);
	ctx.lineTo(x+w+10+depth, tSpace+pHeight-10-depth);
	ctx.lineTo(x+w+depth, tSpace+pHeight-depth);
	ctx.closePath();
	ctx.stroke();		
	ctx.fillStyle=col;
	ctx.fill();
	// Draw note
	ctx.font = "20px Georgia";
	ctx.fillStyle = "black";
	if(note=="")
	{
		ctx.fillText("$"+val.toFixed(2),x+depth,top-35);
	}
	else
	{
		ctx.fillText(note,x+depth,top-35);
	}
	// Draw label
	ctx.fillText(label,x+depth,tSpace+pHeight+25);
}

// Function for single line notes
function notes(conclusion="", summary=false)
{
	notes("", conclusion, "", summary);
}

// Function for dual line notes
function notes(conclusion="", conclusion2="", summary=false)
{
	notes(conclusion, conclusion2, "", summary);
}

//---------------------------
// Function for 3 line notes
//---------------------------
// conclusion = text to be displayed on top line
// conclusion2 = text to be displayed on middle line
// conclusion3 = text to be displayed on bottom line
function notes(canvas, conclusion="", conclusion2="", conclusion3="", summary=false)
{
	// Get 2D context for drawing
	var ctx = canvas.getContext("2d");
	
	// If summary is false then only draw the first line at the bottom of the plot
	if(summary==false)
	{
		ctx.font = "20px Georgia";
		ctx.fillStyle = "black";
		ctx.fillText(conclusion,rSpace+(pWidth/2)-(measureTextWidth(conclusion,20)/2),tSpace+pHeight+70);
	}
	// If summary is true then draw all 3 lines of notes (some may be empty due to helper functions)
	else
	{
		ctx.font = "60px Georgia";
		ctx.fillStyle = "blue";
		ctx.fillText(conclusion,rSpace+(pWidth/2)-(measureTextWidth(conclusion,60)/2)-2,tSpace+(pHeight/2)-60-2);
		ctx.fillStyle = "black";
		ctx.fillText(conclusion,rSpace+(pWidth/2)-(measureTextWidth(conclusion,60)/2),tSpace+(pHeight/2)-60);
		if(conclusion2!="")
		{
		  ctx.fillStyle = "green";
		  ctx.fillText(conclusion2,rSpace+(pWidth/2)-(measureTextWidth(conclusion2,60)/2)-2,tSpace+(pHeight/2)-2);
		  ctx.fillStyle = "black";
		  ctx.fillText(conclusion2,rSpace+(pWidth/2)-(measureTextWidth(conclusion2,60)/2),tSpace+(pHeight/2));
		  if(conclusion3!="")
		  {
		    ctx.fillStyle = "red";
		    ctx.fillText(conclusion3,rSpace+(pWidth/2)-(measureTextWidth(conclusion3,60)/2)-2,tSpace+(pHeight/2)+60-2);
		    ctx.fillStyle = "black";
		    ctx.fillText(conclusion3,rSpace+(pWidth/2)-(measureTextWidth(conclusion3,60)/2),tSpace+(pHeight/2)+60);
		  }
		}
	}
}

//--------------------------------------------------------------------
// Function to measure the length of drawn text (used to center text)
//--------------------------------------------------------------------
function measureTextWidth(message, size)
{
	text = document.createElement("span");
	document.body.appendChild(text);
	text.style.fontSize = size + "px"; 
    text.style.height = 'auto'; 
    text.style.width = 'auto'; 
    text.style.position = 'absolute'; 
	text.style.left = '0px'; 
	text.style.top = '0px'; 
    text.style.whiteSpace = 'no-wrap'; 
    text.innerHTML = message; 
	var titleWidth = text.clientWidth;
	document.body.removeChild(text);
	return titleWidth;
}