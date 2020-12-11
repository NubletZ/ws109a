// set inner html from div with id "loginForm" for index.html
// 1. login
// 2. signin

const login = {}

login.html = `
<div class="logFormWrap1">
    <div class="logFormLeft">
        <label for="username" id="username">Username</label><br><br>
        <label for="password">Password</label><br><br>
    </div>
    <div class="logFormRight">
        <form class="logFormRight" id="loginForm" method="post" action="/rdrHome">
            : <input type="text" id="username" name="username" class="logInput" required><br>
            : <input type="password" id="password" name="password" class="logInput" required>
            <button type="submit" class="logButton" id="logInButton">Log In</button>
        </form>
    </div>
</div><br>

<p class="logInfoBottom">
    Don't have an account yet?
    <a class="logBottomLink" href="javascript:void(0)" onclick="signShow()">
        <b>Create Account</b>
    </span>
</p>
`

function logShow() {
    document.getElementById("loginForm").innerHTML = login.html;
}


const signIn = {}

signIn.html = `
<div class="logFormWrap2">
    <div class="logFormLeft">
        <label for="username">Username</label><br><br>
        <label for="password">Password</label><br><br>
        <label for="confPassword">Confirm password</label><br><br>
    </div>
    <form class="logFormRight" id="logData" action="/svData" method="post">
        : <input type="text" id="username" name="username" class="logInput" required><br>
        : <input type="password" id="password" name="password" class="logInput" required><br><br>
        : <input type="password" id="confPassword" name="confPassword" class="logInput">
        <button type="submit" class="logButton" id="signInButton">Sign In</button>
    </form>
</div>

<p class="logInfoBottom">
    Already have an account?
    <a class="logBottomLink" href="javascript:void(0)" onclick="logShow()">
        <b>Log In</b>
    </a>
</p>
`
function signShow(){
    document.getElementById("loginForm").innerHTML = signIn.html;
}

function checkgoHome(){
    window.location.href="/home";
}

function showCurDate(){
    var curDate = new Date();
    var month = curDate.toLocaleString('default', {month: 'long'});
    var hours = ("0" + curDate.getHours()).slice(-2);
    var minutes = ("0" + curDate.getMinutes()).slice(-2);
    var time = curDate.getDate() + " " + month + " " + curDate.getFullYear() + " - " + hours + ":" + minutes;
    document.getElementById('curDate').innerHTML = time;
}

function loadImg(curUser){
    if(curUser == "Nubletz"){
        document.getElementById('pp').src = "resource/pengu_square.png"
    }
}