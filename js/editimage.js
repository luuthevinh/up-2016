/**
 * editimage.js
 *
 * author: Vinh LuuThe
 * github: https://github.com/luuthevinh/up-2016
 * https://luuthevinh.me
 * 
 */

var userImage = document.getElementById("source");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var scaleBar = document.getElementById("scaleBar");

var canvasWidth = canvas.width = 1000;
var canvasHeight = canvas.height = 1000;

var minEdge = 0;
var imageScale = 1;
var minScale = 1;

var preX, preY;
var imagePosX = canvasWidth / 2;
var imagePosY = canvasHeight / 2;
var imageWidth = 0;
var imageHeight = 0;

var angleInDegrees = 0;

var frame = new Image;
frame.src = "images/avatar_frame.png";
//frame.crossOrigin = 'anonymous';

userImage.onload = function() {
    minEdge = Math.min(userImage.width, userImage.height)
	
	minScale = canvasWidth / minEdge;
	imageScale = minScale;
	
	scaleBar.value = 1;
	
	// scaled size
	imageWidth = userImage.width * imageScale;
	imageHeight = userImage.height * imageScale;
	
	angleInDegrees = 0;
	
	drawCurrentImage();
	
	updateScaleBarHTML();
}


frame.onload = function() {
 	drawCurrentImage();
}

scaleBar.oninput = function() {
	
	// set current scale
	imageScale = minScale * scaleBar.value;
	
	var dir = angleInDegrees / 90;
	if(dir % 2 == 0) {
		// scaled size
		imageWidth = userImage.width * imageScale;
		imageHeight = userImage.height * imageScale;
	}
	else {
		// scaled size
		imageWidth = userImage.height * imageScale;
		imageHeight = userImage.width * imageScale;
	}
	
	
	// draw image
	drawCurrentImage();
	
	// set display value
	updateScaleBarHTML();
}

function updateScaleBarHTML()
{
	var scaleValue = document.getElementById("scaleValue");
	scaleValue.innerHTML = scaleBar.value;
}

var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var isDragging = false;

$("#canvas").mousedown(function(e) {
	// vị trí hiện tại chuột theo canvas = vị trí chuột hiện tại - offset của canvas
	canMouseX = parseInt(e.clientX - offsetX);
	canMouseY = parseInt(e.clientY - offsetY);
  
	// bắt đầu kéo hình
	isDragging = true;
  
	// lưu lại vị trí cũ
	preX =  canMouseX;
	preY = canMouseY;
});

$("#canvas").mouseup(function(e) {
	canMouseX = parseInt(e.clientX - offsetX);
	canMouseY = parseInt(e.clientY - offsetY);
  
	// hết kéo hình
	isDragging = false;

	preX = canMouseX;
	preY = canMouseY;
});

$("#canvas").mouseout(function(e) {
	canMouseX = parseInt(e.clientX - offsetX);
	canMouseY = parseInt(e.clientY - offsetY);
  
	// chuột ra khỏi canvas rồi nên hết kéo được
	isDragging = false;

	preX =  canMouseX;
	preY = canMouseY;
});

$("#canvas").mousemove(function(e) {
	canMouseX = parseInt(e.clientX - offsetX);
	canMouseY = parseInt(e.clientY - offsetY);

	// nếu đang kéo hình thì cập nhật vị trí và vẽ lại
	if(isDragging) {
		// delta
		imagePosX += (canMouseX - preX);
		imagePosY += (canMouseY - preY);
	  
		drawCurrentImage();
	}

	preX = canMouseX;
	preY = canMouseY;
});

document.getElementById('imageFile').addEventListener('change', function() {
	updateImage();
}, false);

document.getElementById('selectImageBtn').addEventListener('click', function() {
	$("#imageFile").click();
}, false);

function updateImage() {

  var input = $("#imageFile")[0];

  if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          userImage.src = e.target.result;
      }

      reader.readAsDataURL(input.files[0]);
  }
};

document.getElementById('downloadBtn').addEventListener('click', function() {
    downloadFile(this, "canvas", "vnu_tour_avatar.png");
}, false);

function downloadFile(button, canvasId, filename) {
    var dt = document.getElementById(canvasId).toDataURL();
    button.href = dt;
    button.download = filename;
};

document.getElementById('clockwise').addEventListener('click', function() {
	angleInDegrees += 90;
	
	swapWidthHeightImage();
	drawCurrentImage();
}, false);

document.getElementById('counterclockwise').addEventListener('click', function() {
	angleInDegrees -= 90;
	
	swapWidthHeightImage();
	drawCurrentImage();
}, false);

function swapWidthHeightImage()
{
	var temp = imageWidth;
	imageWidth = imageHeight;
	imageHeight = temp;
}

function drawCurrentImage()
{
	var deltaChangeX = (imageWidth - canvasWidth) / 2;
	var deltaChangeY = (imageHeight - canvasHeight) / 2;
  
	if(imagePosX > canvasWidth / 2 + deltaChangeX)
	{
		imagePosX = canvasWidth / 2 + deltaChangeX;
	}
	else if (imagePosX  < canvasWidth / 2 - deltaChangeX)
	{
		imagePosX = canvasWidth / 2 - deltaChangeX;
	}
	
	if(imagePosY > canvasHeight / 2 + deltaChangeY)
	{
		imagePosY = canvasHeight / 2 + deltaChangeY;
	}
	else if (imagePosY < canvasHeight / 2 - deltaChangeY)
	{
		imagePosY = canvasHeight / 2 - deltaChangeY;
	}
	
	context.clearRect(0, 0, canvasWidth, canvasHeight);
  
	// draw image
	context.save();
	
	// translate and scale context
	context.translate(imagePosX, imagePosY);
    context.rotate(angleInDegrees * Math.PI / 180);
	context.scale(imageScale, imageScale);
	context.drawImage(userImage, -userImage.width / 2, -userImage.height / 2);
    
	context.restore();
	
	context.drawImage(frame, 0, 0, frame.width, frame.height, 0, 0, canvasWidth, canvasHeight);
};
