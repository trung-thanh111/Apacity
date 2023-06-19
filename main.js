var index = 1;
var imgs = ["image/slider_1.webp","image/slider_2.webp","image/slider_3.webp"];

function changeImage() {
    document.getElementById('banner').src = imgs[index];
    index++;
    if(index >= imgs.length){
        index = 0;
    }
}
setInterval(changeImage, 3000);
function hinhanh1(){
    document.getElementById('banner').src = imgs[0];
}
function hinhanh2(){
    document.getElementById('banner').src = imgs[1];
}
function hinhanh3(){
    document.getElementById('banner').src = imgs[2];
}