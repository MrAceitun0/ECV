var name;
var okButton = document.getElementById("okbutton");

function sendUserName()
{
    name = document.getElementById("userName").value;
    console.log(userName);
    window.location = "index.html";
}

okButton.addEventListener("click", sendUserName);