var express           = require("express"),
    methodOverride    = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app               = express(),
    bodyParser        = require("body-parser"),
    mongoose          = require("mongoose");

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://admin:Jagdish@1285@cluster0.d6b2r.mongodb.net/<dbname>?retryWrites=true&w=majority");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{type: Date,default:Date.now}
})
var Blog = mongoose.model("Blog", blogSchema);

app.get("/",function(req, res){
    res.redirect("blogs");
})

app.get("/blogs",function(req, res){
    Blog.find({},function(err, blogs){
        if (err)console.log(err);
        else{
            res.render("index",{blogs:blogs});
        }
    })
    
})

app.get("/blogs/new",function(req, res){
    res.render("new");
})

app.post("/blogs",function(req, res){
    
    Blog.create(req.body.blog, function(err, newBlog){
        if(err)console.log(err)
        else {
              res.redirect("blogs");
        }
    })
})

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id,function(err,blog){
        if(err)console.log(err);
        else res.render("show",{info:blog});
    });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id,function(err,blog){
        if(err)console.log(err);
        else res.render("edit",{foundblog:blog});
    })
     
    
});

app.put("/blogs/:id", function(req, res){
    
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, info){
        if(err)
            res.redirect("/blogs")
        else
            res.redirect("/blogs/"+req.params.id)
    });
})

app.delete("/blogs/:id",function(req, res){
    Blog.findByIdAndRemove(req.params.id,function(err, info){
        if(err)
            res.redirect("/blogs")
        else
            res.redirect("/blogs/")
    });
})



app.listen(process.env.PORT,function(err){
    if(err)console.log(err);
    else console.log("server is started at port "+process.env.PORT);
});
