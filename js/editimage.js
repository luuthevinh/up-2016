var img1 = document.getElementById("source");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var scaleBar = document.getElementById("scaleBar");

var canvasWidth = canvas.width = 1000;
var canvasHeight = canvas.height = 1000;

var minEdge = 0;
var curScale = 1;
var minScale = 1;

var preX, preY;
var imagePosX = 0;
var imagePosY = 0;
var sWidth = canvasWidth;
var sHeight = canvasHeight;

var frame = new Image;
frame.src = "images/avatar_frame.png";
//frame.crossOrigin = 'anonymous';

img1.onload = function() {
    minEdge = Math.min(img1.width, img1.height)
	
	minScale = canvasWidth / minEdge;
	curScale = minScale;
	
	scaleBar.value = "1";
	
	sWidth = canvasWidth / curScale;
	sHeight = canvasHeight / curScale;
	
	drawCurrentImage();
}


frame.onload = function() {
 	context.drawImage(frame, 0, 0, frame.width, frame.height, 0, 0, canvasWidth, canvasHeight);
}

scaleBar.oninput = function() {
	
	// set current scale
	curScale = minScale * scaleBar.value;
	
	// update source rect with scale ratio
	sWidth = canvasWidth / curScale;
	sHeight = canvasHeight / curScale;
	
	// draw image
	drawCurrentImage();
	
	// set display value
	var scaleValue = document.getElementById("scaleValue");
	scaleValue.innerHTML = scaleBar.value;
}

var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var isDragging = false;


function handleMouseDown(e){
  canMouseX = parseInt(e.clientX - offsetX);
  canMouseY = parseInt(e.clientY - offsetY);
  
  // set the drag flag
  isDragging = true;

  preX =  canMouseX;
  preY = canMouseY;
}

function handleMouseUp(e){
  canMouseX = parseInt(e.clientX - offsetX);
  canMouseY = parseInt(e.clientY - offsetY);
  
  // clear the drag flag
  isDragging = false;

  preX = canMouseX;
  preY = canMouseY;
}

function handleMouseOut(e){
  canMouseX = parseInt(e.clientX - offsetX);
  canMouseY = parseInt(e.clientY - offsetY);
  
  // user has left the canvas, so clear the drag flag
  isDragging = false;

  preX =  canMouseX;
  preY = canMouseY;
}

function handleMouseMove(e) {
  canMouseX = parseInt(e.clientX - offsetX);
  canMouseY = parseInt(e.clientY - offsetY);

  // if the drag flag is set, clear the canvas and draw the image
  if(isDragging) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      // delta
      imagePosX -= (canMouseX - preX) * 3 / curScale;
      imagePosY -= (canMouseY - preY) * 3 / curScale;
	  
      drawCurrentImage();
  }

  preX = canMouseX;
  preY = canMouseY;
}

$("#canvas").mousedown(function(e){ handleMouseDown(e); });
$("#canvas").mousemove(function(e){ handleMouseMove(e); });
$("#canvas").mouseup(function(e){ handleMouseUp(e); });
$("#canvas").mouseout(function(e){ handleMouseOut(e); });

function selectFile() {
  $("#imageFile").click();
};

function updateImage() {

  var input = $("#imageFile")[0];

  if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          img1.src = e.target.result;
      }

      reader.readAsDataURL(input.files[0]);
  }
};

function downloadFile(button, canvasId, filename) {
    var dt = document.getElementById(canvasId).toDataURL();
    button.href = dt;
    button.download = filename;
};

document.getElementById('downloadBtn').addEventListener('click', function() {
    downloadFile(this, "canvas", "vnu_tour_avatar.png");
}, false);


function drawCurrentImage()
{
	if(imagePosX < 0)
	{
		imagePosX = 0;
	}
	else if(imagePosX > img1.width - sWidth)
	{
		imagePosX = img1.width - sWidth;
	}

	if(imagePosY < 0)
	{
		imagePosY = 0;
	}
	else if(imagePosY > img1.height - sHeight)
	{
		imagePosY = img1.height - sHeight;
	}
  
	// draw image
	context.drawImage(img1, imagePosX, imagePosY, sWidth, sHeight, 0, 0, canvasWidth, canvasHeight);
	context.drawImage(frame, 0, 0, frame.width, frame.height, 0, 0, canvasWidth, canvasHeight);
};