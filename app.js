const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs")

app.set("view engine", "ejs")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


app.get("/", function (req, res) {
  var arr = [];

  fs.readdir(`./files`, function (err, files) {
    files.forEach(function (file) {
      var data = fs.readFileSync(`./files/${file}`, "utf-8");
      arr.push({ name: file, data: data });
    })
    res.render("index", { files: arr })
  })
});


app.get("/read/:filename", function (req, res) {
  const filename = req.params.filename
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, data) {
    if (err) return res.status(404).send(err)
    // res.render("read", { filename: req.params.filename, data: data })
    else res.render("read", { filename, data })
  })
})

app.get("/edit/:filename", function (req, res) {
  const filename = req.params.filename;
  fs.readFile(`./files/${filename}`, 'utf-8', function (err, data) {
    if (err) return res.status(404).send(err);
    else res.render("edit", {filename, data })
  });
})



app.post("/update/:filename", function (req, res) {
  const filename = req.params.filename;
  fs.writeFile(`./files/${filename}`, req.body.new, function (err) {
    res.redirect("/")
  })
})


app.get("/delete/:filename", function (req, res) {
  fs.unlink(`./files/${req.params.filename}`, function (err) {
    res.redirect('/')
  })
})




app.post("/create", function (req, res) {
  var fn = req.body.name.split(' ').join('') + '.txt';
  fs.writeFile(`./files/${fn}`, req.body.details, function (err) {
    if (err) return res.status(500).send(err);
    else res.redirect("/");
  })
})


app.listen(3000)
'read'