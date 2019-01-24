var room;
var nick;

var okButton = document.getElementById("okbutton");

function sendUserName()
{
    nick = document.getElementById("userName").value;
    if(nick != "")
    {
        localStorage.setItem("userNick",nick);
    }
    else
    {
        localStorage.setItem("userNick","Anonymous");
    }

    window.location = "chat.html";
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
    img1.firstChild.src="img/logo2.png";
    img2.firstChild.src="img/pac_gris.png";
    img3.firstChild.src="img/cena_gris.png";
    img4.firstChild.src="img/nyanCat_gris.png";
    img5.firstChild.src="img/AlphaPiThetaBratva_gris.png";
    img6.firstChild.src="img/default_gris.png";
    localStorage.setItem("userImage",userImage);
}
function changeImage2()
{
    userImage = 1;
    img1.firstChild.src="img/logo2_gris.png";
    img2.firstChild.src="img/pac.png";
    img3.firstChild.src="img/cena_gris.png";
    img4.firstChild.src="img/nyanCat_gris.png";
    img5.firstChild.src="img/AlphaPiThetaBratva_gris.png";
    img6.firstChild.src="img/default_gris.png";
    localStorage.setItem("userImage",userImage);
}
function changeImage3()
{
    userImage = 2;
    img1.firstChild.src="img/logo2_gris.png";
    img2.firstChild.src="img/pac_gris.png";
    img3.firstChild.src="img/cena.png";
    img4.firstChild.src="img/nyanCat_gris.png";
    img5.firstChild.src="img/AlphaPiThetaBratva_gris.png";
    img6.firstChild.src="img/default_gris.png";
    localStorage.setItem("userImage",userImage);
}
function changeImage4()
{
    userImage = 3;
    img1.firstChild.src="img/logo2_gris.png";
    img2.firstChild.src="img/pac_gris.png";
    img3.firstChild.src="img/cena_gris.png";
    img4.firstChild.src="img/nyanCat.png";
    img5.firstChild.src="img/AlphaPiThetaBratva_gris.png";
    img6.firstChild.src="img/default_gris.png";
    localStorage.setItem("userImage",userImage);
}
function changeImage5()
{
    userImage = 4;
    img1.firstChild.src="img/logo2_gris.png";
    img2.firstChild.src="img/pac_gris.png";
    img3.firstChild.src="img/cena_gris.png";
    img4.firstChild.src="img/nyanCat_gris.png";
    img5.firstChild.src="img/AlphaPiThetaBratva.png";
    img6.firstChild.src="img/default_gris.png";
    localStorage.setItem("userImage",userImage);
}
function changeImage6()
{
    userImage = 5;
    img1.firstChild.src="img/logo2_gris.png";
    img2.firstChild.src="img/pac_gris.png";
    img3.firstChild.src="img/cena_gris.png";
    img4.firstChild.src="img/nyanCat_gris.png";
    img5.firstChild.src="img/AlphaPiThetaBratva_gris.png";
    img6.firstChild.src="img/default.png";
    localStorage.setItem("userImage",userImage);
}

img1.addEventListener("click", changeImage1);
img2.addEventListener("click", changeImage2);
img3.addEventListener("click", changeImage3);
img4.addEventListener("click", changeImage4);
img5.addEventListener("click", changeImage5);
img6.addEventListener("click", changeImage6);