//var room;
var nick;
var okButton = document.getElementById("okbutton");


function sendUserName()
{
    nick = document.getElementById("userName").value;
    localStorage.setItem("userNick",nick);
    window.location = "index.html";
}

okButton.addEventListener("click", sendUserName);

function selectRoom()
{
    room = document.getElementById("chatRoom").value;
    localStorage.setItem("selectedRoom",room);
}

selectRoom();



var userImage = 5;

var img1 = document.getElementById("img1");
var img2 = document.getElementById("img2");
var img3 = document.getElementById("img3");
var img4 = document.getElementById("img4");
var img5 = document.getElementById("img5");
var img6 = document.getElementById("img6");

function changeImage1()
{
    userImage = 0;
    localStorage.setItem("userImage",userImage);
}
function changeImage2()
{
    userImage = 1;
    localStorage.setItem("userImage",userImage);
}
function changeImage3()
{
    userImage = 2;
    localStorage.setItem("userImage",userImage);
}
function changeImage4()
{
    userImage = 3;
    localStorage.setItem("userImage",userImage);
}
function changeImage5()
{
    userImage = 4;
    localStorage.setItem("userImage",userImage);
}
function changeImage6()
{
    userImage = 5;
    localStorage.setItem("userImage",userImage);
}

img1.addEventListener("click", changeImage1);
img2.addEventListener("click", changeImage2);
img3.addEventListener("click", changeImage3);
img4.addEventListener("click", changeImage4);
img5.addEventListener("click", changeImage5);
img6.addEventListener("click", changeImage6);