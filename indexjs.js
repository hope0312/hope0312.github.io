
function starts(){
    document.getElementById("start-card").style.display="";
	EvalSound('audio1');
}

function exitgame(){
    document.getElementById("start-card").style.display="none";
	timer.innerHTML=0;
}

function question(){
    document.getElementById("question-card").style.display="";
}

function exitquestion(){
    document.getElementById("question-card").style.display="none";
}

function save(){
	let url = canvas.toDataURL('image/png');
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = '畫圖';
    a.target = '_blank';
    a.click()
}


/*
variables
*/
var canvas;
var classNames = [];
var canvas;
var coords = [];
var mousePressed = false;
var mode;
console.log('yamede')
/*
prepare the drawing canvas 
*/
$(function() {
    canvas = window._canvas = new fabric.Canvas('canvas');
    canvas.backgroundColor = '#ffffff';
    canvas.isDrawingMode = 0;
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 10;
    canvas.renderAll();
    //setup listeners 
    canvas.on('mouse:up', function(e) {
        getFrame();
        mousePressed = false
    });
    canvas.on('mouse:down', function(e) {
        mousePressed = true
    });
    canvas.on('mouse:move', function(e) {
        recordCoor(e)
    });
})



/*
record the current drawing coordinates
*/
function recordCoor(event) {
    var pointer = canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;

    if (posX >= 0 && posY >= 0 && mousePressed) {
        coords.push(pointer)
    }
}



/*
clear the canvs 
*/
function erase() {
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    coords = [];
}


var timer;
var over =0;
function pameStart(){
	var pameStart1=document.getElementById("game_start");
	pameStart1.style.display="none";
	ShowCanvas();
	Clear();
	target();
	timer=document.getElementById("timer");
	window.setTimeout(countdown, 1000);
}; 
function countdown(){
	timer.innerHTML=timer.innerHTML-1;
	var pameStart2=document.getElementById("game_start");
	if(timer.innerHTML>0){
	window.setTimeout(countdown,1000);}
    // else if(!exitgame()){
    //     pameStart2.style.display="flex";
    //     pameStart2.style.margin="0px auto";
    //     timer.innerHTML=5;
    //     DisCancas();
    //     return false;
    // }
	else{EvalSound('audio2');
		alert('時間到!!');
		timer.innerHTML=5;
		pameStart2.style.display="flex";
		pameStart2.style.margin="0px auto";
		DisCancas();
		
		// over++;
		// pameStart();
		// if (over>=3){
		// 	DisCancas();
		// 	alert('終わり');
		// 	exitgame();
		// 	over = 0;
		// 	return false;
		// }
	 }
}
// function back(){
// 	var behind=document.getElementById("behind");
// 	var front=document.getElementById("front");
// 	front.style.display="block";
// 	behind.style.display="none";
// }


function target(){
	var target=["骷髏頭","骷髏頭","燈泡","圓","足球","蘑菇","降落傘","漢堡","帽子","臉","眼睛",
	"貓","熊","鑰匙","劍","月亮","太陽","嘴巴","鴨","嘴巴","山","鼻子","蝙蝠","豬","披薩","兔子",
	"鯊魚","飛機","筆記型電腦","電視","草莓","蚊子","斧頭","鳥","車子","時鐘","狗","海豚","花",
	"熱狗","青蛙","冰淇淋","葉子","鑽石","大象","橡皮擦","羽毛","打火機","獅子","棒棒糖","蠟燭"];
	var too = Math.floor((Math.random()*target.length));
	var topicc=document.getElementById("topicc");
	topicc.innerHTML=target[too];
}
/*音樂 */
function EvalSound(soundobj) {
	var thissound = document.getElementById(soundobj);
	thissound.play();
}


/*
get the best bounding box by trimming around the drawing
*/
function getMinBox() {
    //get coordinates 
    var coorX = coords.map(function(p) {
        return p.x
    });
    var coorY = coords.map(function(p) {
        return p.y
    });

    //find top left and bottom right corners 
    var min_coords = {
        x: Math.min.apply(null, coorX),
        y: Math.min.apply(null, coorY)
    }
    var max_coords = {
        x: Math.max.apply(null, coorX),
        y: Math.max.apply(null, coorY)
    }

    //return as strucut 
    return {
        min: min_coords,
        max: max_coords
    }
}

/*
get the current image data 
*/
function getImageData() {
        //get the minimum bounding box around the drawing 
        const mbb = getMinBox()

        //get image data according to dpi 
        const dpi = window.devicePixelRatio
        const imgData = canvas.contextContainer.getImageData(mbb.min.x * dpi, mbb.min.y * dpi,
                                                      (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);
        return imgData
    }

/*
get the prediction 
*/
function getFrame() {
    //make sure we have at least two recorded coordinates 
    if (coords.length >= 2) {

        //get the image data from the canvas 
        const imgData = getImageData()

        //get the prediction 
        const pred = model.predict(preprocess(imgData)).dataSync()

        //find the top 5 predictions 
        const indices = findIndicesOfMax(pred, 5)
        const probs = findTopValues(pred, 5)
        const names = getClassNames(indices)

        //set the table 
        setTable(names, probs)
    }

}

function setTable(top5, probs)
   { 
   for (var i = 0; i < top5.length; i++) {    
    let sym = document.getElementById('sym'+(i+1))
    let prob = document.getElementById('prob'+(i+1))
    sym.innerHTML = top5[i]
    prob.innerHTML = Math.round(probs[i] * 100)
    } 
    createPie(".pieID.legend", ".pieID.pie");

}







//get the latex symbols by indices 
function getSymbols(indices)
{
    var outp = []
    for (var i= 0 ; i < indices.length ; i++)
        outp[i] = symbols[indices[i]]
    return outp
}
	  
//load the class names 	  
async function loadDict()
{
  await $.ajax({
  url: 'class_names.txt',
  dataType: 'text',}).done(success);
}
	  
//load the class names 
function success(data)
{
    lst = data.split(/\n/)
    symbols = []
    for(var i = 0 ; i < lst.length -1  ; i++)
    {
        let symbol = lst[i]
        symbols[i] = symbol
    }
}
	  
//get indices of the top probs
function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
        outp.push(i); // add index to output array
        if (outp.length > count) {
            outp.sort(function(a, b) { return inp[b] - inp[a]; }); // descending sort the output array
            outp.pop(); // remove the last index (index of smallest element in output array)
        }
    }
    return outp;
}
	  
//find the top 5 predictions 
function findTopValues(inp, count){
    var outp = [];
    let indices = findIndicesOfMax(inp, count)
    // show 5 greatest scores
    for (var i = 0; i < indices.length; i++)
        outp[i] = inp[indices[i]]
    return outp
}
	 
//preprocess the data 
function preprocess(imgData)
{
return tf.tidy(()=>{
	  
    const tensor = tf.fromPixels(imgData).toFloat()
    const offset = tf.scalar(255.0);
    // Normalize the image 
    const normalized = tf.scalar(1.0).sub(tensor.div(offset));
    const resized = tf.image.resizeBilinear(normalized, [28, 28])
    const sliced   = resized.slice([0, 0, 1], [28, 28, 1])
    const batched = sliced.expandDims(0)
    return batched
})
} 

/*
allow drawing on canvas
*/
function allowDrawing() {
    if (mode == 'en')
        document.getElementById('status').innerHTML = 'Model Loaded';
    else
        document.getElementById('status').innerHTML = 'Model Loaded';
    $('button').prop('disabled', false);
    var slider = document.getElementById('myRange');
    slider.oninput = function() {
        canvas.freeDrawingBrush.width = this.value;
    };
}

//load the model 
async function loadModel()
{
    model = await tf.loadLayersModel('model.json')
    //warm up 
    model.predict(tf.zeros([1,28,28,1]))
    allowDrawing()
    await loadDict()
}

loadModel()
