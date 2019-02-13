var okButton = document.getElementById("okbutton");

function sendUserName()
{
    var userName = document.getElementById("userName").value;
    localStorage.setItem("userName", userName);

    window.location = "chat.html";
}

function selectRoom()
{
    var room = document.getElementById("chatRoom").value;
    localStorage.setItem("Room", room);
}

selectRoom();

okButton.addEventListener("click", sendUserName);