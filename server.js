require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./config/db.config");
const colors = require('colors');


const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json()); 

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 
app.use(bodyParser.json({ type: 'application/*+json' }))


const db = require("./models");


db.mongoose
  .connect(process.env.mongoURL || `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(`Successfully connect mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`.red);
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

  // simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome." });
  });
  
   require('./routes/auth.routes')(app);
   require('./routes/post.routes')(app);
  
  
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`.yellow);
  });