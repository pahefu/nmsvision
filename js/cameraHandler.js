var picURL = null;
var windowURL = null;


function changeCanvasBackground(src){
	var photo = new Image();
	photo.onload = function(){		
		var localCanvas = $("#backgroundCanvas")[0];
		var ctx = localCanvas.getContext("2d");
		
		console.log(photo.width, photo.height);
		$("#test").html("photo: "+photo.width+"x"+photo.height+" "+photo.naturalWidth+"x"+photo.naturalHeight);
		
		ctx.drawImage(photo, 0, 0, localCanvas.width, localCanvas.height);

		if(windowURL!=null){ // Release memory content if it exists
			windowURL.revokeObjectURL(picURL);
			windowURL = null;
			picURL = null;
		}
	}
	photo.src = src;
}

function picChange(evt){ 
	var localCanvas = $("#backgroundCanvas")[0];
	var ctx = localCanvas.getContext("2d");
	ctx.fillStyle = "#000000";
	
	var realImageOrientation = 1;
	
	loadImage.parseMetaData(
		evt.target.files[0],
		function (data) {

			if(data.exif){
				realImageOrientation = data.exif.get('Orientation');
				console.log("Real image orientation pre drawing:", realImageOrientation);
			}
			
			var imageScaling = 1.0;
			var MID_DIVISION = 2.0;
			
			loadImage(
				evt.target.files[0],
				function (img) {
				   // document.body.appendChild(img);
				   
				   console.log(img.width,"x", img.height);
				   console.log(localCanvas.width,"x", localCanvas.height);
				   
				   ctx.fillRect(0,0,localCanvas.width, localCanvas.height); // Black the background
				   
				   if(img.height==localCanvas.height*imageScaling){ // Fit aspect ration
						ctx.drawImage(img, 0, 0, localCanvas.width, localCanvas.height);   
				   }else{
					   var diff = (localCanvas.height - img.height/imageScaling)/MID_DIVISION;
					   console.log("CINEMA BARS:", diff,"px",localCanvas.height-diff);
					   ctx.drawImage(img, 0, diff, localCanvas.width, localCanvas.height-diff*MID_DIVISION);   
				   }
				},
				{
					maxWidth: localCanvas.width*imageScaling,
					maxHeight: localCanvas.height*imageScaling,
					downsamplingRatio : 0.5,
					canvas: true,
					crop:cropLandscape, // FROM settings
					orientation: realImageOrientation
				} // Options
			);
			
		},
		{
			maxMetaDataSize: 262144,
			disableImageHead: false
		}
	);

}