var bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/form_app");

var formSchema = new mongoose.Schema({
    customerName: String,
    email: String,
    phoneNumber: Number,
    withSpouse: Boolean,
    spouseName: String,
    numChildren: Number,
    locationFrom: String,
    locationTo: String,
    dateTravel: Date,
    created: {type: Date, default: Date.now}
});

var Form = mongoose.model("Form", formSchema);


app.get("/form1", function(req, res){
    res.render("form1");
});

app.post("/form1", function(req, res){
    Form.create(req.body.form, function(err, newForm){
        if (err){
            console.log(err);
            res.render("new");
        } else {
            res.redirect("/form2/" + newForm._id);
        }
    })
})

app.get("/form2/:id", function(req, res){
    Form.findById(req.params.id, function(err, foundForm){
        if (err){
            console.log(err);
            res.send("Site not found");
        } else (
            res.render("form2", {form: foundForm}));
    })
})

app.put("/form2/:id", function(req, res){
    Form.findByIdAndUpdate(req.params.id, req.body.form, function(err, updatedForm){
        if (err){
            console.log(err);
            res.redirect("/form2/" + req.params.id);
        } else {
            res.redirect("/form3/" + req.params.id);
        }
    });
});

app.get("/form3/:id", function(req, res){
    Form.findById(req.params.id, function(err, foundForm){
        if (err){
            console.log(err);
            res.send("Site not found");
        } else (
            res.render("form3", {form: foundForm}));
    })
})

app.put("/form3/:id", function(req, res){
    Form.findByIdAndUpdate(req.params.id, req.body.form, function(err, updatedForm){
        if (err){
            console.log(err);
            res.redirect("/form3/" + req.params.id);
        } else {
            res.redirect("/show/" + req.params.id);
        }
    });
});

app.get("/show/:id", function(req, res){
    Form.findById(req.params.id, function(err, foundForm){
        if (err){
            console.log(err);
            res.send("Site not found");
        } else (
            res.render("show", {form: foundForm}));
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Serving Form App..");
});