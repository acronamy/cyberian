import * as path from "path";
import * as cheerio from "cheerio";
import * as express from "express";
import * as hbs from 'express-hbs';
import * as bodyParser from "body-parser";
import * as jdenticon from "jdenticon";
import "reflect-metadata";
import * as bcrypt from "bcrypt";

//Database
import {database} from "./database";
import {User} from "./entities/user.entity";

const webpackGlobal = require("../webpack.config");
const main = express();
const admin = express();

console.log("Server started")

main.use("/admin", admin);
main.use(bodyParser.urlencoded({ extended: false }))

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

    if(err){
        this.render("error")
    }
    else{
        this.send($.html())
    }
}
const avatarMediaUrl = "/media/avatar/"


//routes

//redundant
const size = 200,
        hash = "ff8adece0631821959f443c9d956fc39",
        svg = jdenticon.toSvg(hash, size);

async function createUser(user:User){
    const saltRounds = 10;
    const userInstance = new User();
    
    const usernameHash = await bcrypt.hash(user.username, saltRounds).then(hash=>hash);
    const passwordHash = await bcrypt.hash(user.password, saltRounds).then(hash=>hash);
    
    userInstance.id = 1;
    userInstance.avatar = jdenticon.toSvg(hash, 200);
    userInstance.bio = user.bio;
    userInstance.email = user.email;
    userInstance.forHire = user.forHire;
    userInstance.first_name = user.first_name;
    userInstance.last_name = user.last_name;
    userInstance.username = usernameHash;
    userInstance.password = passwordHash;

    console.log(userInstance)
    await this.manager.persist(userInstance);
}

database.then(async connection=>{

    main.get('/', (req, res)=>{
        res.render("index", locals, injector.bind(res))
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

        res.send(true);
    })

    main.post('/user/login',(req,res)=>{

        //fake login always passes for the moment
        res.send({
            username:"adam",
            name:{
                first:"Adam",
                last:"Crockett"
            },
            avatar:{
                type:"image",
                data:avatarMediaUrl+"adam.jpg"
            }
        })
    })

    

    /**
     * Check if user exists
    */
    main.post('/user/login/check-user',(req,res)=>{
        console.log("req body:",req.body)
        const username = req.body.username.toLowerCase();
        
        //spoof this for the moment this will be db driven
        if(username === "adam"){
            res.send({
                type:"image",
                data:avatarMediaUrl+"adam.jpg"
            })
        }
        else if(username === "david"){
            console.log(svg)
            res.send({
                type:"identicon",
                data:svg
            })
        }
        else{
            res.send(false)
        }
    })

    admin.get('/', (req, res)=>{
        res.render("index", locals, injector.bind(res))
    })


}).catch(err=>{if(err){console.log(err)}})





main.listen(9000);