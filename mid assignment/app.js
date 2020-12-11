import {Application, Router, send} from "https://deno.land/x/oak/mod.ts";
import * as ui from './pagesUI.js';
import {DB} from "https://deno.land/x/sqlite/mod.ts";
import {Session} from "https://deno.land/x/session@1.1.0/mod.ts";

const session = new Session({ framework: "oak" });
await session.init();

const db = new DB("data.db");
db.query("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, pass TEXT)");
db.query("CREATE TABLE IF NOT EXISTS posts (userid INTEGER, id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, content TEXT, date TEXT, comment INTEGER)");
db.query("CREATE TABLE IF NOT EXISTS comment (postid INTEGER, id INTEGER PRIMARY KEY AUTOINCREMENT, nameC TEXT, contentC TEXT, dateC TEXT)");

const router = new Router();

router.get('/', logIn)
      .post('/rdrHome', rdrHome)
      .get('/Home', home)
      .post('/svData', saveData)
      .get('/NewPost', NewPost)
      .get('/Comment:id', comment)
      .post('/svPost', savePost)
      .post('/svPost:id', savePost)
      .get('/MyPost', myPost)
      .get('/RefAbout', refAbout);

const app = new Application();
app.use(session.use()(session));
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
    //console.log('path=', ctx.request.url.pathname)
    if (ctx.request.url.pathname.startsWith("/resource/")) {
      //console.log('pass:', ctx.request.url.pathname)
      await send(ctx, ctx.request.url.pathname, {
        root: Deno.cwd(),
        index: "index.html",
      });  
    }
  });

async function logIn(ctx){
    console.log("進入 Login page");
    ctx.state.session.set('currentUser', null)
    ctx.state.session.set('currentId', null)
    ctx.response.body = await ui.logIn(1, "<script/>");
}

async function rdrHome(ctx){
    console.log("進入 Home");
    const body = ctx.request.body()
    if (body.type === "form") {
      const pairs = await body.value
      const logInfo = {}
      for (const [key, value] of pairs) {
        logInfo[key] = value
      } 
      
      let dbUser=[]
      try{
        var result = db.query(`SELECT id, username, pass FROM user WHERE username = '${logInfo.username}'`)
        
        for(const [id, username, pass] of result){
          dbUser.push({id, username, pass})
        }

        console.log("dbUsers = ", dbUser)
      }
      catch(error){
        console.log(error)
        throw error
      }
      if(dbUser.length > 0){
        console.log('dbUser pass =', dbUser[0].pass)
        console.log('userfill=', logInfo.password)

        if(dbUser[0].pass == logInfo.password){
          ctx.state.session.set('currentUser', dbUser[0].username)
          ctx.state.session.set('currentId', dbUser[0].id)
          console.log("current User =", await ctx.state.session.get('currentUser'))
          ctx.response.redirect('/home')
        }
        else{
          ctx.response.body = await ui.allAlert("wrongPass")
        }
      }
      else{
        console.log('No such username')
        ctx.response.body = await ui.allAlert("nullUser")
      }
    }
}

async function showpost(ctx, sql, curUser, x){
  let postlist = []
  let postDB = db.query(sql)
  for(const [id, name, content, date, comment] of postDB) {
    if(comment == null) var intComment = 0
    else intComment = comment
    postlist.push({id, name, content, date, intComment})
  }
  var postlength = postlist.length
  console.log("postlength = ", postlength)
  console.log("postlist = ", postlist)
  ctx.response.body = await ui.postList(curUser, postlist, postlength, x)
}

async function home(ctx) {
  `var myDate = new Date()
  var mymonth = myDate.toLocaleString('default', {month: 'long'});
  console.log("mymonth = ", mymonth)`

  var curUser = await ctx.state.session.get('currentUser')
  if(curUser != null) {
    showpost(ctx, "SELECT id, name, content, date, comment FROM posts", curUser, 1)
    //ctx.response.body = await ui.home(curUser,"")
  }
  else{
    ctx.response.redirect('/')
  }
}
/*
async function create(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    const pairs = await body.value
    const post = {}
    for (const [key, value] of pairs) {
      post[key] = value
    }
    console.log('create:post=', post)
    db.query("INSERT INTO posts (title, body) VALUES (?, ?)", [post.title, post.body]);
    ctx.response.redirect('/');
  }
}
*/

async function saveData(ctx) {
  const body = ctx.request.body()
    if (body.type === "form") {
      const pairs = await body.value
      //console.log("pairs =" + pairs)
      const userData = {}
      for (const [key, value] of pairs) {
        userData[key] = value
      } 
      var userExist = db.query(`SELECT 1 FROM user WHERE username = '${userData.username}'`);
      //console.log(userExist._done)
      if (userData.password == userData.confPassword && userExist._done == true){
        db.query("INSERT INTO user (username, pass) VALUES (?, ?)", [userData.username, userData.password]);
        console.log('userData=', userData)
        ctx.response.body = await ui.allAlert("passMatch")
      }
      else if(userExist._done == false){
        console.log("username has been used")
        ctx.response.body = await ui.allAlert("!username")
      }
      else{
        console.log("password doesn't match")
        ctx.response.body = await ui.allAlert("pass!match")
      }
    }
}

async function NewPost(ctx) {
  var curUser = await ctx.state.session.get('currentUser')
  if(curUser != null){
    ctx.response.body = await ui.newPost(curUser);
  }
  else{
    ctx.response.redirect('/')
  }
}

async function savePost(ctx) {
  const paramid = ctx.params.id;
  console.log(paramid)
  const body = ctx.request.body()
  var userId = await ctx.state.session.get('currentId')
  const postData = {}
  if(body.type === "form"){
    const post = await body.value
    for (const [key, value] of post) {
      postData[key] = value
    }
  }
  console.log(postData)
  var fstr = postData.uPost
  var scstr = fstr.replace(/&/g, "&amp;")
  var tdstr = scstr.replace(/</g, "&lt;")
  var finstr = tdstr.replace(/>/g, "&gt;")
  console.log("finstr = ", finstr)

  //get current user ID and name to be written in DB
  var userId = await ctx.state.session.get('currentId')
  var cName = await ctx.state.session.get('currentUser')
  console.log("userId = " + userId)

  //get current date and change it to string to be written in DB
  var curDate = new Date();
  var allMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var curMonth = curDate.getMonth()
  var hours = ("0" + curDate.getHours()).slice(-2);
  var minutes = ("0" + curDate.getMinutes()).slice(-2);
  var time = curDate.getDate() + " " + allMonth[curMonth] + " " + curDate.getFullYear() + " - " + hours + ":" + minutes;
  console.log("current time = " + time);

  if(paramid == undefined) {
    console.log('save post to DB')
    db.query("INSERT INTO posts (userid, name, content, date) VALUES (?, ?, ?, ?)", [userId, cName, finstr, time]);
    ctx.response.redirect('/Home')
  }
  else {
    console.log('save comment to DB')
    let comlist = []
    db.query("INSERT INTO comment (postid, nameC, contentC, dateC) VALUES (?, ?, ?, ?)", [paramid, cName, finstr, time])
    let postDB = db.query(`SELECT comment FROM posts WHERE id=${paramid}`)
    for(const [comment] of postDB) {
      if(comment == null) var intComment = 0
      else intComment = comment
      comlist.push({intComment})
    }
    console.log("comlist = ", comlist)
    var newCom = comlist[0].intComment + 1;
    console.log("newCom = ", newCom)
    db.query(`UPDATE posts SET comment=${newCom} WHERE id=${paramid}`)
    ctx.response.redirect(`/Comment${paramid}`)
  }
}

async function comment(ctx) {
  var curUser = await ctx.state.session.get('currentUser')
  if(curUser != null){
    const postId = ctx.params.id;
    let posts = db.query(`SELECT id, name, content, date FROM posts WHERE id=${postId}`)
    let selPost = []
    for(const [id, name, content, date] of posts) {
      selPost.push({id, name, content, date})
    }
    let comments = db.query(`SELECT id, nameC, contentC, dateC FROM comment WHERE postid=${postId}`)
    let selCom = []
    for(const [id, nameC, contentC, dateC] of comments) {
      selCom.push({id, nameC, contentC, dateC})
    }
    ctx.response.body = await ui.showComments(curUser, selPost[0], selCom, postId)
  }
  else{
    ctx.response.redirect('/')
  }
}

async function myPost(ctx) {
  var curUser = await ctx.state.session.get('currentUser')
  var curId = await ctx.state.session.get('currentId')
  if(curUser != null) {
    showpost(ctx, `SELECT id, name, content, date, comment FROM posts WHERE userid=${curId}`, curUser, 0)
  }
  else{
    ctx.response.redirect('/')
  }
}

async function refAbout(ctx) {
  var curUser = await ctx.state.session.get('currentUser')
  ctx.response.body = await ui.refAbout(curUser)
}

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ hostname: "127.0.0.1", port: 8000});