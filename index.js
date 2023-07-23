const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

//mongodb start

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1oh7p7d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //collections
    const collegeCollection = client
      .db("academiclandiaDB")
      .collection("colleges");
    const galleryCollection = client
      .db("academiclandiaDB")
      .collection("galleryImages");
    const researchCollection = client
      .db("academiclandiaDB")
      .collection("researchPaper");
    const reviewCollection = client
      .db("academiclandiaDB")
      .collection("reviews");

    // api start
    //college apis
    app.get("/colleges", async (req, res) => {
      const result = await collegeCollection.find().toArray();
      res.send(result);
    });
    // gallery apis
    app.get("/galleries", async (req, res) => {
      const result = await galleryCollection.find().toArray();
      res.send(result);
    });
    // research paper apis
    app.get("/research-papers", async (req, res) => {
      const result = await researchCollection.find().toArray();
      res.send(result);
    });
    // reviews apis
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });
    // api end
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//mongodb end

// basic setup
app.get("/", (req, res) => {
  res.send("Academiclandia Server is Running.");
});

app.listen(port, () => {
  console.log(`Academiclandia Server is Running on port: ${port}`);
});
