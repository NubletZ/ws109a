
//UI for each page in website
export function main(title, content){
    return `
    <html>
        <head>
            <Title>NuBook | ${title}</Title>
            <link rel="icon" href="resource/logo.png" type="image/png">
            <meta charset="UTF-8">
            <meta name="viewport" content="width = device-width, initial-scale = 0.7">
            <link rel="stylesheet" type="text/css" href="/resource/style.css">
            <script type="text/javascript" src="/resource/myUI.js"></script>
            <style>
                /* FONT */
                @font-face {
                    font-family: "arialN";
                    src: url('resource/ARIALN.TTF');
                }
            </style>
        </head>
        ${content}
    </html>
    ` 
}

export function logIn(type, script){
    if(type == 1){
        return main("Login", `
        <body class="bgLogin" onload="logShow()" style="background-image: url('resource/bg.png');">
            <img src="./resource/socialMan.png" class="imgLogin">
            <a href='https://www.freepik.com/vectors/business' class="imgCredit">Business vector created by freepik - www.freepik.com</a>
            <div class="cntn1">
                <img src="./resource/logoHD.png" class="logoLogin">
                <p style="font-size: 30px; font-family: arialN; font-weight: bold;">
                    "Let’s join us and share your 
                    precious stories with us"
                </p><br>
                <div id="loginForm">

                </div>
            </div>
            ${script}
        </body>
    `);
    }
    else{
        return main("Signin", `
        <body class="bgLogin" onload="signShow()" style="background-image: url('resource/bg.png');">
            <img src="./resource/socialMan.png" class="imgLogin">
            <div class="cntn1">
                <img src="./resource/logoHD.png" class="logoLogin">
                <p style="font-size: 30px; font-family: arialN; font-weight: bold;">
                    "Let’s join us and share your 
                    precious stories with us"
                </p><br>
                <div id="loginForm">

                </div>
            </div>
            ${script}
        </body>
        `);
    }
}

export function home(curUser, content){
    return main("Home", `
        <body class="bgHome">
            <div class="divSide" style="left: 0">
                <div style="text-align: center;">
                    <img src=${loadImg(curUser)} style="border-radius: 100%; width: 140px;position: relative; padding:10px;">
                    <p class="menuButton menuUser" id="currentUser">${curUser}</p>
                    <a href="/" class="menuButton menuLogout" onclick=""><u><b>Log out</b></u></a>
                </div><br>
                <a href="/NewPost" class="menuButton sideOpt">
                    Create a post
                </a>
                <a href="/Home" class="menuButton sideOpt">
                    See all post
                </a>
                <a href="/MyPost" class="menuButton sideOpt">
                    See my post
                </a>
            </div>
            <div class="divSide" style="right: 0">
                
            </div>
            <div class="bgPost">
                ${content}
            </div>
            <div class="fixNav">
                <a href="/Home">
                    <img src="resource/logoHD.png" class="logoNavBar">
                </a>
                <div class="divoptNavBar">
                    <a href="https://github.com/NubletZ/ws109a/tree/master/mid%20assignment" class="optNavBar" style="margin: 20px;">
                        Reference
                    </a>
                    <span class="optNavBar">></span>
                    <a href="/refAbout" class="optNavBar" style="margin: 20px;">
                        About
                    </a>
                    <span class="optNavBar">></span>
                    <a href="/refAbout" class="optNavBar" style="margin: 20px;">
                        Contact Us
                    </a>
                </div>
            </div>
        </body>
    `);
}

export function newPost(curUser){
    return home(curUser, `
    <div class="forPost">
        <div style="width: 100%; height: 120px; position: absolute; top: -70px;">
            <img src=${loadImg(curUser)} style="border-radius: 100%; width: 90px;position: relative; padding:10px; left: 20px; float: left;">
            <div style="float: left; position: relative; padding-top: 20px;"> 
                <p class="pUserName">${curUser}</p>
                <p class="pDate" id="curDate" name="_curDate">20 November 2020 10:50</p>
            </div>
        </div>
        <form method="POST" action="/svPost">
            <div class="pContent">
                <textarea class="userTextArea" name="uPost"></textarea>
            </div>
            <button type="submit" class="logButton postButton">Post!</button>
        </form>
    </div>
    <script>
        showCurDate();
        setInterval(showCurDate, 1000);
    </script>
    `);
}

export function allAlert(status){
    if(status == "pass!match"){
        return logIn(2, `
        <script>
            alert("Password doesn't match")
        </script>
        `)
    }
    if(status == "passMatch"){
        return logIn(1, `
        <script>
            alert("Your data has been recorded")
        </script>
        `)
    }
    if(status == "wrongPass"){
        return logIn(1, `
        <script>
            alert("Wrong password!")
        </script>
        `)
    }
    if(status == "!username"){
        return logIn(2, `
        <script>
            alert("The username has been used")
        </script>
        `)
    }
    if(status == "nullUser"){
        return logIn(1, `
        <script>
            alert("There's no such username")
        </script>
        `)
    }
}

export function getMonth() {
    var date = new Date()
    var month = date.toLocaleString('default', {month: 'long'});
    return month;
}

function loadImg(user){
    if(user == "Nubletz") return "resource/pengu_square.png"
    else return "resource/profilePhoto.png"
}

export function postList(curUser, allposts, length, x) {
    console.log("進入 postList function")
    let postlist = []
    var i = length;
    for (var j = 0; j < length; j++) {
        i-=1;
        postlist.push(`
        <div class="forPost">
            <div style="width: 100%; height: 120px; position: absolute; top: -70px;">
                <img src=${loadImg(allposts[i].name)} style="border-radius: 100%; width: 90px;position: relative; padding:10px; left: 20px; float: left;">
                <div style="float: left; position: relative; padding-top: 20px;"> 
                    <p class="pUserName">${allposts[i].name}</p>
                    <p class="pDate">${allposts[i].date}</p>
                </div>
            </div>
            <pre class="pContent"><code style="font-family: arialN; font-weight: 500">${allposts[i].content}</code></pre>
            <a href="/Comment${allposts[i].id}">
                <img src="resource/commentLogo.png" class="comLogo">
            </a>
            <p class="jgCom">${allposts[i].intComment} comments</p>
        </div>
        `)
    }

    let content = [];

    if(x == 1){
        content = `
        <div class="forPost">
            <div style="width: 100%; height: 120px; position: absolute; top: -70px;">
                <img src=${loadImg("Nubletz")} style="border-radius: 100%; width: 90px;position: relative; padding:10px; left: 20px; float: left;">
                <div style="float: left; position: relative; padding-top: 20px;"> 
                    <p class="pUserName">Nubletz</p>
                    <p class="pDate">8 December 2020 - 16:00</p>
                </div>
            </div>
            <pre class="pContent"><code style="font-family: arialN; font-weight: 500">Hello, welcome to my website ₍๑• ɞ •๑ ₎⸝
This website was made for my study purposes only.
Other features would be added soon (for my final project haha..)

您好，歡迎來到我的網站!
這個網站是為我的學習目標而製作的。
其他功能很快就會添加（為我的期末作業 哈哈）</code></pre>
            <a>
                <img src="resource/commentLogo.png" class="comLogo">
            </a>
            <p class="jgCom">This post doesn't receive comment</p>
        </div>
        ${postlist.join('\n')}
        `
    }
    
    else {
        content = postlist.join('\n')
    }
    //postlist.join('\n')
    
    return home(curUser, content)
}

export function showComments(curUser, allposts, allcom, id) {
    console.log("進入 showComments function")
    let sumCom = 0;
    let comlist = []
    for (let comment of allcom) {
        comlist.push(`
        <div class="forComment" id="${comment.id}">
            <div style="width: 100%; height: 100px; position: relative; padding-top: 10px;">
                <img src=${loadImg(comment.nameC)} style="border-radius: 100%; width: 60px;position: relative; padding:10px; left: 20px; float: left;">
                <div style="float: left; position: relative; padding-top: 20px;"> 
                    <p class="pUserName" style="font-size: 18px;">${comment.nameC}</p>
                    <p class="pDate" style="color: rgb(166, 166, 166)">${comment.dateC}</p>
                </div>
            </div>
            <pre class="pContent" style="padding-top: 0; margin-top: 0;"><code style="font-family: arialN; font-weight: 500">${comment.contentC}</code></pre>
        </div>
        `)
        sumCom = comment.id;
    }

    let content = `
    <div class="forPost" style="margin-bottom: 25px;">
        <div style="width: 100%; height: 120px; position: absolute; top: -70px;">
            <img src=${loadImg(allposts.name)} style="border-radius: 100%; width: 90px;position: relative; padding:10px; left: 20px; float: left;">
            <div style="float: left; position: relative; padding-top: 20px;"> 
                <p class="pUserName">${allposts.name}</p>
                <p class="pDate">${allposts.date}</p>
            </div>
        </div>
        <pre class="pContent"><code style="font-family: arialN; font-weight: 500">${allposts.content}</code></pre>
    </div>
    <div class="forComment">
        <div style="width: 100%; height: 100px; position: relative; padding-top: 10px;">
            <img src=${loadImg(curUser)} style="border-radius: 100%; width: 60px;position: relative; padding:10px; left: 20px; float: left;">
            <div style="float: left; position: relative; padding-top: 20px;"> 
                <p class="pUserName" style="font-size: 18px;">${curUser}</p>
                <p class="pDate" id="curDate" style="color: rgb(166, 166, 166);">20 November 2020 10:50</p>
            </div>
        </div>
        <form method="POST"  action="/svPost${id}#${sumCom+1}">
            <div class="pContent" style="padding-top: 0;">
                <textarea class="userTextArea" style="margin: 0;" name="uPost"></textarea>
            </div>
            <button type="submit" class="logButton" style="font-size: 18px; float: right; margin-right: 60px; margin-bottom: 20px;">Comment</button>
        </form>
    </div>
    ${comlist.join('\n')}
    <script>
        showCurDate();
        setInterval(showCurDate, 1000);
    </script>
    `
    return home(curUser, content)
}

export function refAbout(curUser){
    return main("About and Contact", `
    <body class="bgLogin" style="background-image: url('resource/bg.png'); margin: 0; padding: 0;">
        <div class="fixNav">
            <a href="/Home">
                <img src="resource/logoHD.png" class="logoNavBar">
            </a>
            <div class="divoptNavBar">
                <a href="/myPost" class="optNavBar" style="margin: 20px;">
                    Reference
                </a>
                <span class="optNavBar">></span>
                <a href="/myPost" class="optNavBar" style="margin: 20px;">
                    About
                </a>
                <span class="optNavBar">></span>
                <a href="/myPost" class="optNavBar" style="margin: 20px;">
                    Contact Us
                </a>
            </div>
        </div>
        <div class="contRB">
            <h1 class="rbTitle">About</h1>
            <p class="rbContent">
                NuBook was made to fulfill my midterm assignment. 
                Please don’t put any of your important or personal data here since it is very easy to be accessed by other people.
            </p>
            <p class="rbContent">
                Note:This website still under development, other features will comming soon
            </p>
            <h1 class="rbTitle">Contact Us</h1>
            <p class="rbContent">
                Such you have any questions regarding this website or you found some bugs in our website, please kindly contact us on : <span style="font-size: 8px; color: rgb(166,166,166);">No, don't contact me :(</span> 
            </p>
        </div>
        <img src="resource/penguchifan.png" class="imgrefAbout">
    </body>
    `)
}