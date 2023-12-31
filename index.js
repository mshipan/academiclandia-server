const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const usersCollection = client.db("academiclandiaDB").collection("users");
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
    const bookingsCollection = client
      .db("academiclandiaDB")
      .collection("bookings");

    // api start
    // users apis
    // find user by email
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });
    // create a user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const alreadyAUser = await usersCollection.findOne(query);
      if (alreadyAUser) {
        return res.send({ message: "User Already Exist" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    //update user
    app.put("/user/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const filter = { email: email };
        const updateUser = req.body;
        const newUser = {
          $set: {
            phone: updateUser.phone,
            gender: updateUser.gender,
            dob: updateUser.dob,
            country: updateUser.country,
            address: updateUser.address,
            university: updateUser.university,
          },
        };
        const result = await usersCollection.updateOne(filter, newUser);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    //college apis
    app.get("/colleges", async (req, res) => {
      const result = await collegeCollection.find().toArray();
      res.send(result);
    });
    //view single college details
    app.get("/college/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collegeCollection.findOne(query);
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
    // add a review
    app.post("/reviews", async (req, res) => {
      const newReviews = req.body;
      const result = await reviewCollection.insertOne(newReviews);
      res.send(result);
    });

    //booking apis
    // view all bookings
    app.get("/bookings", async (req, res) => {
      const result = await bookingsCollection.find().toArray();
      res.send(result);
    });
    //add a booking
    app.post("/bookings", async (req, res) => {
      const newbookings = req.body;
      const result = await bookingsCollection.insertOne(newbookings);
      res.send(result);
    });
    //view single booking college details
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.findOne(query);
      res.send(result);
    });
    // single user bookings
    app.get("/bookings/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const result = await bookingsCollection.find(query).toArray();
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
