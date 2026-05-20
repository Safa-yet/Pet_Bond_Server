const express = require('express')
const app = express()
const port = process.env.SERVER_PORT || 8000;

const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());


// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');

const uri = process.env.MONGODB_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const JWKS = createRemoteJWKSet(
  new URL('http://localhost:3000/api/auth/jwks')
);
const verifyToken =async (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  console.log("Backend Token",authHeader);
  // const token = authHeader.split(' ')[1];
  // console.log("Backend Token",token);

  if (!authHeader) {
    return res.status(401).send('Access Denied');
  }

  try {
    const {payload} =await jwtVerify(authHeader,JWKS)
    console.log("Payload",payload);
    next();
} catch (error) {
  console.error("Token verification failed:", error);
  return res.status(401).send('Invalid Token'); 
};


}


// console.log(client);
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
      const db= client.db("petbond");
    const dbCollection =db.collection("animal");
    const adoptCollection = db.collection("adopt");
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    
app.get('/',async (req, res) => {
  res.send('Hello World!')
  console.log(uri);
})
    app.get('/animal',  async(req,res)=>{
      const cursor =await dbCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    })

  


    app.post('/animal', async(req,res)=>{
      const newPet = req.body;
      const result = await dbCollection.insertOne(newPet);
      res.send(result);
    })  
 
    app.get("/animal/:id",verifyToken, async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await dbCollection.findOne(query);
      res.send(result);
    })



    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});