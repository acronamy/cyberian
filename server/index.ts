import * as path from "path";
import * as cheerio from "cheerio";
import * as express from "express";
import * as hbs from 'express-hbs';
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as jdenticon from "jdenticon";
import "reflect-metadata";
import * as bcrypt from "bcrypt";
import * as jsHash from "jshashes";

//Database
import {database} from "./database";
import {User} from "./entities/user.entity";

const webpackGlobal = require("../webpack.config");
const main = express();
const admin = express();

console.log("Server started")

main.use("/admin", admin);


main.use(bodyParser.urlencoded({ extended: false }))
main.use(cookieParser())

//DI
const webpackOutputDir = webpackGlobal.output.path;
const webpackOutputFilename = webpackGlobal.output.filename;
const webpackOutputUrl = "/bundle";


main.use(webpackOutputUrl, express.static( webpackOutputDir ))
main.use("/media", express.static( path.join(__dirname, "public", "media") ));

main.engine('hbs', hbs.express4());
main.set('view engine', 'hbs');
main.set('views', path.join(__dirname, '/templates'));
admin.set('views', path.join(__dirname, '/templates'))


const locals = {
}
function injector(err, html){
  
    const $ = cheerio.load(html);
    //head
    $("head").append('<script src="http://localhost:35729/livereload.js"></script>')
    $("head").append(`<title>${this.req.url}</title>`)
    $("head").append( `<script src="${webpackOutputUrl}/${webpackOutputFilename}"></script>`);
    
    if(this.template){
        const templateParent = $("#"+this.template).parent()
        templateParent.append($("#"+this.template).html())
    }

    if(this.session){
        $("body").addClass("logged-in");
        $("body").prepend(
`
<nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="active"><a href="#">Photos <span class="sr-only">(current)</span></a></li>
        <li><a href="#">Collections</a></li>
      </ul>

      <!--USER-->
      <ul class="nav navbar-nav navbar-right">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">PIC</a>
          <ul class="dropdown-menu">
            <li><a href="#">Settings</a></li>
            <li><a href="#">Your Profile</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#logout">Log out</a></li>
          </ul>
        </li>
      </ul>

    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
`
)
    }

    if(err){
        this.render("error")
    }
    else{
        this.send($.html())
    }
}
const avatarMediaUrl = "/media/avatar/"


//routes

async function createUser(user:User){
    const saltRounds = 10;
    const userInstance = new User();
    //for jdenticon
    const MD5 = new jsHash.MD5;
    
    const passwordHash = await bcrypt.hash(user.password, saltRounds).then(hash=>hash);
    
    userInstance.avatar = jdenticon.toSvg(MD5.hex(user.username), 200);
    userInstance.bio = user.bio;
    userInstance.email = user.email;
    userInstance.forHire = user.forHire;
    userInstance.first_name = user.first_name;
    userInstance.last_name = user.last_name;
    userInstance.username = user.username;
    userInstance.password = passwordHash;

    await this.manager
        .persist(userInstance)
        .then(user => {
            console.log(user)
            console.log("User has been saved");
        })
        .catch(err=>{if(err){console.log(err)}});
}

database.then(async connection=>{

    console.log("Database connection established: "+connection.isConnected)
    console.log(connection)

    main.get('/', (req, res)=>{
        const renderOptions = {
            session:req.cookies.session||false,
        }

        res.render("index", locals, injector.bind( Object.assign(res, renderOptions) ))
    })

    main.get('/user', (req, res)=>{
        const renderOptions = {
            template:"login"
        }

        res.render("user", injector.bind(Object.assign(res, renderOptions)))
    })

    main.get('/user/register', (req, res)=>{
        const renderOptions = {
            template:"register"
        }

        res.render("user", injector.bind(Object.assign(res, renderOptions)))
    })
    main.post('/user/register/new', (req, res)=>{
        const formData = req.body;

        const name = {
            first:formData.first_name,
            last:formData.last_name
        }
        const bio = formData.bio;
        const email = formData.email;
        const forHire = formData.for_hire;
        const username = formData.username;
        const password = formData.password;

        createUser.bind(connection)({
            username:username,
            first_name:name.first,
            last_name:name.last,
            avatar:"",
            password:password,
            bio:bio,
            email:email,
            forHire:forHire
        })
        .catch(function(err){
            console.log(err)
        })

        res.redirect("/user");
    })

    main.post('/user/login',async (req,res)=>{

        //fake login always passes for the moment
        const usernameInput = req.body.username.toLowerCase();
        const passwordInput = req.body.password;

        console.log("login attempt", "\nUsername", usernameInput, "\nPassword", passwordInput)


        const userInstance = await connection
            .getRepository(User)
            .findOne({username:usernameInput})

        //1 find user or fail
        //2 if user check password or message user WRONG PASSWORD.
        //Note it would be easy to warn if username (specific) is wrong but for security reasons we wont.
        if(userInstance){
            //check for password
            const passwordCheck = await bcrypt.compare(passwordInput, userInstance.password);
            if(passwordCheck){
                //password correct
                //1 day 8.64e+7
                res.cookie("session",{
                    loggedIn:new Date()
                },{ maxAge: 8.64e+7, httpOnly: true })
                res.send(userInstance);
            }
            else{
                //password wrong
                res.send(false);
            }
        }
        else{
            //no such user!
            console.log("no such user")
            res.send(false)
        }


        // res.send({
        //     username:"adam",
        //     name:{
        //         first:"Adam",
        //         last:"Crockett"
        //     },
        //     avatar:{
        //         type:"image",
        //         data:avatarMediaUrl+"adam.jpg"
        //     }
        // })
    })

    

    /**
     * Check if user exists
    */
    main.post('/user/login/check-user',async (req,res)=>{
        const username = req.body.username.toLowerCase();
        const userInstance = await connection
            .getRepository(User)
            .findOne({username:username})

        if(userInstance){
            res.send(userInstance);
        }
        else{
            res.send(false)
        }
    })

    admin.get('/', (req, res)=>{
        res.render("index", locals, injector.bind(res))
    })


})
.catch(err=>{
    if(err){
        console.log(err)
    }
})





main.listen(9000);