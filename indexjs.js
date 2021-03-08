
function starts(){
    document.getElementById("start-card").style.display="";
	EvalSound('audio1');
	timer.innerHTML=5;
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


/*畫板*/
const canvas = document.querySelector('#draw');
canvas.width = window.innerWidth-50;
canvas.height = window.innerHeight-150;
const ctx = canvas.getContext('2d');
ctx.strokeStyle='#BADA55';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 10;


let isDrawing=false;
let lastX=0;
let lastY=0;
let hue=0;
let direction=true;
		
function draw(e) {
	if(!isDrawing) return;
	console.log(e)
	ctx.strokeStyle=`hsl(${hue},88%,50%)`;
		
	ctx.beginPath();
	ctx.moveTo(lastX, lastY);
	ctx.lineTo(e.offsetX, e.offsetY);
	ctx.stroke();
	[lastX, lastY] = [e.offsetX, e.offsetY];
	}
canvas.addEventListener('mousedown', (e) => {
	isDrawing = true;
	[lastX,lastY]=[e.offsetX,e.offsetY];
	});
canvas.addEventListener('mousemove', draw);	
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);


function Clear(){
	ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0,0,canvas.width,canvas.height);
};

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
function ShowCanvas(){
	var ShowCanvas=document.getElementById("draw");
	var ClearID=document.getElementById("ClearID");
	ShowCanvas.style.display="block";
	ClearID.style.display="block";
	ClearID.style.margin="0px auto";
    document.getElementById("topicc").style.display="";
}
function DisCancas(){
	var DisCancas=document.getElementById("draw");
	var ClearID=document.getElementById("ClearID");
	DisCancas.style.display="none";
	ClearID.style.display="none";
    document.getElementById("topicc").style.display="none";
    
}

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