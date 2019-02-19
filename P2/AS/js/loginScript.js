var okButton = document.getElementById("okbutton");

function sendUserName()
{
    var userName = document.getElementById("userName").value;
    localStorage.setItem("userName", userName);

    window.location = "room.html";
}

function selectRoom()
{
    var room = document.getElementById("chatRoom").value;
    localStorage.setItem("Room", room);
}

selectRoom();

okButton.addEventListener("click", sendUserName);

var skin = 0;

var skinList = ["img/avatar.png","img/avatar2.png","img/avatar3.png","img/avatar4.png"];

var arrowLeft = document.getElementById("arrowLeft");
var arrowRight = document.getElementById("arrowRight");
var skinPhoto = document.getElementById("skinPhoto");

arrowLeft.addEventListener("click", changeLeft);
arrowRight.addEventListener("click", changeRight);

function changeLeft()
{
    skin = (skin-1)%4;
    skinPhoto.src = skinList[skin];
    localStorage.setItem("Skin",skin);
}

function changeRight()
{
    skin = (skin+1)%4;
    skinPhoto.src = skinList[skin];
    localStorage.setItem("Skin",skin);
}