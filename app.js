const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect(
    "mongodb+srv://Jagadeesh:jagadeesh@cluster0.ddgzpxz.mongodb.net/wikiDB"
);
mongoose.set('strictQuery',true);
articleSchema = {
    title: "String",
    content: "String",
};

const Article = mongoose.model("article", articleSchema);

app.route('/articles')
    .get(function (req, res) {
        Article.find({}, function (err, result) {
            if (result.length === 0) {
                res.send('No documents in the collection..');
            }
            else if (!err) {
                result.forEach(function (item) {
                    console.log('TITLE IS   :  ' + item.title);
                    console.log('CONTENT IS :  ' + item.content);
                })
                res.send('Data is fetched successfully..')
            }
        });
    })
    .post(function (req, res) {
        var bodytitle = req.body.title;
        var bodycontent = req.body.content;
        const data = new Article({
            title: bodytitle,
            content: bodycontent
        });
        data.save(function (err) {
            if (!err) {
                res.send('Data is successfully saved in Database');
            }
            else {
                res.send(err);
            }
        });
    }
    ).delete(function (req, res) {
        Article.deleteMany({title:undefined},function (err) {
            if (!err) {
                res.send('Deleted all documents successfully');
            }
        });
    });

app.route('/articles/:route')
    .get(function (req, res) {
        var route = req.params.route;
        Article.findOne({ title: route }, function (err, result) {
            if (!err) {
                res.send(result);
            }
        })
    })
    // in which it updates the entire document even if there is no fields, keeping them undiscovered..to overcome this, PATCH is introduced.
    .put(function (req, res) {
        var route = req.params.route;
            Article.findOneAndUpdate({ title:route }, {title:req.body.title, content: req.body.content }, { overwrite: true }, function (err) {
                if (!err) {
                    console.log('Updated succesfully');
                    res.send('Updated');
                }
            });
    })
    .delete(function (req, res) {
        Article.deleteOne({title:req.params.route},function (err) {
            if (!err) {
                res.send('Deleted all documents successfully');
            }
        });
    })
    .patch(function (req, res) {
        var route = req.params.route;
            Article.findOneAndUpdate({ title:route },{$set:req.body}, function (err) {
                if (!err) {
                    console.log('Updated succesfully');
                    res.send('Updated');
                }
            });
    });

app.listen(3000, function (req, res) {
    console.log("Server started at 3000..");
});
