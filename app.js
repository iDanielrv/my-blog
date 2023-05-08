const express = require("express");
const mongoose = require("mongoose")

//O body-parser é um middleware para processar dados do formulário em requisições HTTP.
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Esta linha configura o ejs como engine de visualização padrão para renderizar as páginas HTML
app.set("view engine", "ejs");


// CONECTANDO COM O MONGOOSE E CRIANDO SCHEMA


const dbURI = 'mongodb+srv://drvSolo:BnsPCOtqMcH2XQSN@clusteralone.urm8lkz.mongodb.net/nodeblog?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err)})


const myblogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true })

const Blog = mongoose.model('Blog', myblogSchema)







// Rota HOME
app.get("/", async (req, res) => {

  try {
    const blogs = await Blog.find()
    res.render("index", {blogs: blogs})
  } catch (error) {
    console.log(error);
  }

});
app.get("/home", (req, res) => {
  res.redirect("/");
});

// Rota ABOUT
app.get("/about", (req, res) => {
  res.render("about");
});

// Rota Create
app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", async (req, res) => {
  console.log(req.body.title);
  console.log(req.body.blogText);

  const blog = {
    title: req.body.title,
    text: req.body.blogText
  }

  try {
    await Blog.create(blog)
    console.log("Deu certo caramba!!!");
    res.redirect("/home");

  } catch (error) {
    console.log(error);
  }
});

// Find One

app.get('/blog/:id', async (req, res) => {

  const id = req.params.id

  try {
    
    const blog = await Blog.findOne( { _id: id })
    res.render('findblog', {blog : blog})
/*     console.log('esse é o blog:');
    console.log(blog); */
  } catch (error) {
    console.log(error);
  }
})

// DELETE blog

app.post('/delete', async(req, res) => {
  console.log(req.body);
  console.log(req.body.delete); // isso aq veio do form em um botão, genial!
  const id = req.body.delete

  try {
    await Blog.findByIdAndRemove( { _id : id})
    console.log('Blog excluido com sucesso!'); 
    res.redirect('/home')
  } catch (error) {
    console.log(error);
  }
})


// Update

app.post('/update/:id', async(req, res) => {
  console.log(req.body);
  console.log(req.params.id)

  const id = req.params.id

   const blog = {
    title: req.body.title,
    text: req.body.text,
  }


  try {
    await Blog.updateOne({_id: id}, blog)
    console.log('Update realizado com sucesso');
    res.redirect('/home')
  } catch (error) {
    console.log(error);
  }

}) 



app.get('/update/:id', async(req, res) => {

  const id = req.params.id

  const blog = await Blog.findOne({ _id: id})

  res.render('update', { blog: blog })


})







app.listen(3000, () => "server is running on port 3000!");


//drvSolo

//BnsPCOtqMcH2XQSN
