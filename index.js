const express = require("express");
const app = express();
const port = process.env.SERVER_PORT || 8000;

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`));
const verifyToken = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  console.log("Backend Token", authHeader);
  // const token = authHeader.split(' ')[1];
  // console.log("Backend Token",token);

  if (!authHeader) {
    return res.status(401).send("Access Denied");
  }

  try {
    const { payload } = await jwtVerify(authHeader, JWKS);
    console.log("Payload", payload);
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).send("Invalid Token");
  }
};

// console.log(client);
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const db = client.db("petbond");
    const petsCollection = db.collection("animal");
    const adoptCollection = db.collection("adoptation");
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    app.get("/", async (req, res) => {
      res.send("Hello World!");
      console.log(uri);
    });





    app.delete("/animal/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petsCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/adopt", async (req, res) => {
      const cursor = await adoptCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });



    app.patch(
      "/animal/:id",
      verifyToken,

      async (req, res) => {
        try {
          const id = req.params.id;

          const updatedData = req.body;

          const filter = {
            _id: new ObjectId(id),
          };

          const updateDoc = {
            $set: {
              petName: updatedData.petName,

              species: updatedData.species,

              breed: updatedData.breed,

              age: updatedData.age,

              gender: updatedData.gender,

              image: updatedData.image,

              healthStatus: updatedData.healthStatus,

              vaccinationStatus: updatedData.vaccinationStatus,

              location: updatedData.location,

              adoptionFee: updatedData.adoptionFee,

              description: updatedData.description,
            },
          };

          const result = await petsCollection.updateOne(filter, updateDoc);

          res.send(result);
        } catch (error) {
          console.log(error);

          res.status(500).send({
            success: false,

            message: "Failed To Update Pet",
          });
        }
      },
    );

    app.post("/adoption-request", verifyToken, async (req, res) => {
      try {
        const requestInfo = req.body;

        const pet = await petsCollection.findOne({
          _id: new ObjectId(requestInfo.petId),
        });

      
        if (pet.ownerEmail === requestInfo.requesterEmail) {
          return res.status(400).send({
            message: "You Cannot Adopt Your Own Pet",
          });
        }

       
        if (pet.adopted) {
          return res.status(400).send({
            message: "Pet Already Adopted",
          });
        }

      
        const existing = await adoptCollection.findOne({
          petId: requestInfo.petId,

          requesterEmail: requestInfo.requesterEmail,
        });

        if (existing) {
          return res.status(400).send({
            message: "Already Requested",
          });
        }

        requestInfo.status = "pending";

        requestInfo.createdAt = new Date();

        const result = await adoptCollection.insertOne(requestInfo);

        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/adoption-request/:petId", verifyToken, async (req, res) => {
      try {
        const petId = req.params.petId;

        const result = await adoptCollection.find({ petId }).toArray();

        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });



app.patch(
  "/adoption-request/:id",
  verifyToken,

  async (req, res) => {

    try {

      const id = req.params.id;

      const { status, petId } = req.body;

      // request update
      const requestQuery = {
        _id: new ObjectId(id),
      };

      const updateRequest = {
        $set: {
          status: status,
        },
      };

      const result = await adoptCollection.updateOne(
        requestQuery,
        updateRequest
      );

    
      if (status === "approved") {

      
        await petsCollection.updateOne(
          {
            _id: new ObjectId(petId),
          },
          {
            $set: {
              adopted: true,
            },
          }
        );

  
        await adoptCollection.updateMany(
          {
            petId: petId,
            _id: {
              $ne: new ObjectId(id),
            },
          },
          {
            $set: {
              status: "rejected",
            },
          }
        );
      }

      res.send(result);

    } catch (error) {

      console.log(error);

      res.status(500).send({
        success: false,
        message: "Failed To Update Request",
      });
    }
  }
);




app.get("/animal",verifyToken, async (req, res) => {

  try {

    const search = req.query.search || "";

    const species = req.query.species;

    const sort = req.query.sort;

    // query object
    let query = {};


    if (search) {
      query.petName = {
        $regex: search,
        $options: "i",
      };
    }

    
    if (species) {

      const speciesArray = species.split(",");

      query.species = {
        $in: speciesArray,
      };
    }

    // SORTING
    let sortOption = {};

    if (sort === "low") {
      sortOption = {
        adoptionFee: 1,
      };
    }

    if (sort === "high") {
      sortOption = {
        adoptionFee: -1,
      };
    }

    const result = await petsCollection
      .find(query)
      .sort(sortOption)
      .toArray();

    res.send(result);

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed To Fetch Pets",
    });
  }
});






    app.post("/animal", async (req, res) => {
      const newPet = req.body;
      const result = await petsCollection.insertOne(newPet);
      res.send(result);
    });

    app.get("/animal/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petsCollection.findOne(query);
      res.send(result);
    });

    app.get(
      "/my-pets/:email",

      async (req, res) => {
        try {
          // email
          const email = req.params.email;

          // query
          const query = {
            ownerEmail: email,
          };


          const result = await petsCollection.find(query).toArray();

          res.send(result);
        } catch (error) {
          console.log(error);

          res.status(500).send({
            success: false,

            message: "Failed To Fetch My Pets",
          });
        }
      },
    );


app.get(
  "/my-adoption-requests/:email",
  verifyToken,

  async (req, res) => {
    try {

      const email = req.params.email;

      const query = {
        requesterEmail: email,
      };

      const result = await adoptCollection
        .find(query)
        .toArray();

      res.send(result);

    } catch (error) {

      console.log(error);

      res.status(500).send({
        success: false,
        message: "Failed To Fetch Requests",
      });
    }
  }
);


app.delete(
  "/adoption-request/:id",
  verifyToken,

  async (req, res) => {

    try {

      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result =
        await adoptCollection.deleteOne(query);

      res.send(result);

    } catch (error) {

      console.log(error);

      res.status(500).send({
        success: false,
        message: "Failed To Cancel Request",
      });
    }
  }
);



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
