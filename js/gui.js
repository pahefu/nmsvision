/* FUNCTIONS */
var fullscreen = function(){
	var el = $('#fullScreenContainer')[0];
	if(el.webkitRequestFullScreen) {
		el.webkitRequestFullScreen();
	}
	else {
		el.mozRequestFullScreen();
	} 
}

var capture = function (){

	$("#popupNotice").show();
	var element = $('#container')[0];
	
	html2canvas(element,{canvas:canvas}).then(function(cnv) {
		save();
	});	
};

var save = function(){
	// Dump the canvas contents to a file.
	canvas.toBlob(function(blob) {
		imageCount++; // New image here
		var fileName = "NMSVIS_";
		var options = {  year: 'numeric', month: 'numeric', day: 'numeric' };
		var dt = new Date();
		var now = (dt).toLocaleDateString("en-US",options).replace(/\//g, "_");
		var nowT = (dt).toTimeString().slice(0,8).replace(/\:/g,"")
		fileName+=now+nowT+"_"+imageCount+".png";
		saveAs(blob, fileName);	
		$("#popupNotice").hide();
	}, "image/png");
}

var changeHealthIcons = function(count){
	
	$("#healthIcons").html("");
	for(var i = 0;i<count;i++){
		$("#healthIcons").append('<li class="healthIconContainer"><img src="./img/health.png" class="strech"/></li>');
	}
}

var toggleSettings = function(){
	$("#toolbarScrollable").toggle();
}

/* GUI CODE */

var canvas = null;
var scaleW = 1.0;
var scaleH = 1.0;
var designW = 540.0;
var designH = 960.0;
var useCelsius = true;
var imageCount = 0;
var cropLandscape = false;

var GUI_ELEMENTS = {
	screenWidth : {  id : "--screen-width", value : designW, needsScaleW : true, needsScaleH: false, suffix:"px", scaled: false},
	screenHeight : {  id : "--screen-height", value : designH, needsScaleW : false, needsScaleH: true, suffix:"px", scaled: false},
	
	settingsHeight : {  id : "--toolbarScrollable-height", value : designH *0.55, needsScaleW : false, needsScaleH: true, suffix:"px", scaled: false},
	
	topPanelWidth: {id : "--topPanel-width",value : 250, needsScaleW : true, needsScaleH: false, suffix:"px", scaled: false},
	shieldBarWidth: {id : "--shieldBar-width",value : 249, needsScaleW : true, needsScaleH: false, suffix:"px", scaled: false},
	
	bottomPanelWidth: {id : "--bottomPanel-width",value : 250, needsScaleW : true, needsScaleH: false, suffix:"px", scaled: false},
	bottomPanelBottom: {id : "--bottomPanel-bottom",value : 60, needsScaleW : false, needsScaleH: true, suffix:"px", scaled: false},
	lifeSupportBarWidth: {id : "--lifeSupportBar-width",value : 249, needsScaleW : true, needsScaleH: false, suffix:"px", scaled: false},
	
	shieldCurrent: {  id : "--shieldCurrent-width", value : 50, needsScaleW : false, needsScaleH: false, suffix:"%", scaled: true},
	lifeSupportCurrent: {  id : "--lifeSupportCurrent-width", value : 50, needsScaleW : false, needsScaleH: false, suffix:"%", scaled: true},
	
	
	
	
}

var renderElements = function(){
	for(var k in GUI_ELEMENTS){
		var obj = GUI_ELEMENTS[k];
		var localScaled = obj.scaled;
		if(obj.needsScaleW && !obj.scaled){
			obj.value = obj.value * scaleW;
			localScaled = true;
		}
		
		if(obj.needsScaleH && !obj.scaled){
			obj.value = obj.value * scaleH;
			localScaled = true;
		}
		obj.scaled = localScaled; // If it changed, it is already set then
		document.documentElement.style.setProperty(obj.id, obj.value+obj.suffix);			
	}
}


var initialize = function(){
	
	
	
	try{
		//var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		//var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		
		var w = window.screen.availWidth;
		var h = window.screen.availHeight;
		
		canvas = document.createElement("canvas");;
		canvas.width = w;
		canvas.height = h;
		
		scaleW = w/designW;
		scaleH = h/designH;
		
		renderElements();
		
		var localCanvas = $("#backgroundCanvas")[0];
		localCanvas.width = w;
		localCanvas.height = h;
		
		//changeCanvasBackground("./img/H5KDbva.jpg");
		
		// Adjust callbacks here

		$("#shieldPercent").change(function(){
			GUI_ELEMENTS.shieldCurrent.value = Number($(this).val());
			renderElements();
		});
		
		$("#lifeSupportPercent").change(function(){
			GUI_ELEMENTS.lifeSupportCurrent.value = Number($(this).val());
			renderElements();
		});		

		$("#healthCount").change(function(){
			changeHealthIcons(Number($(this).val()));
		});
		
		$("#radValue").change(function(){
			$("#planetRadValue").html(Number($(this).val()));
		});
		
		$("#toxValue").change(function(){
			$("#planetToxValue").html(Number($(this).val()));
		});

		$("#planetNameValue").change(function(){
			$("#planetName").html($(this).val());
		});
		
		$("#planetTempValue").change(function(){
			$("#planetTemp").html($(this).val() +"&deg;" +(useCelsius ? "C" : "F"));
		});
		
		$("#useCelsiusCheck").change(function(){
			useCelsius = $(this).is(':checked');
			$("#planetTemp").html($("#planetTempValue").val() +"&deg;" +(useCelsius ? "C" : "F"));
		});
		
		$("#showStormCheck").change(function(){
			var showStorm = $(this).is(':checked');
			$("#stormIndication").html((showStorm ? "STORM" : ""));
		});
		
		$("#cropLandscapeCheck").change(function(){
			cropLandscape = $(this).is(':checked');
		});
		
		

	}catch(error){
		alert(error);
	}
}