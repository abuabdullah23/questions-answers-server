require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


// ================== MongoDB ======================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@cluster0.ufrxsge.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();


        // create collection
        const questionsAnswersCollection = client.db('assunnahQA').collection('questionsAnswers');
        const categoriesCollection = client.db('assunnahQA').collection('categories');
        const questionsCollection = client.db('assunnahQA').collection('questions');



        // ================ questions and answer related api
        // get all questions and answer 
        app.get('/questions-answers', async (req, res) => {
            const query = {}
            const options = {
                sort: { _id: -1 }
            }
            const result = await questionsAnswersCollection.find(query, options).toArray();
            res.send(result);
        })

        app.get('/qa-details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await questionsAnswersCollection.findOne(query);
            res.send(result);
        })




        // ============= Category api
        app.get('/categories', async (req, res) => {
            const result = await categoriesCollection.find().toArray();
            res.send(result);
        })


        // ============ questions api
        app.post('/questions', async (req, res) => {
            const question = req.body;
            const result = await questionsCollection.insertOne(question);
            res.send(result);
        })

        // get All questions 
        // TODO: verifyJWT, verifyAdmin
        app.get('/questions', async (req, res) => {
            const result = await questionsCollection.find().toArray();
            res.send(result);
        })

        // get single question
        app.get('/question/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await questionsCollection.findOne(query);
            res.send(result);
        })

















        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// ================== MongoDB ======================




app.get('/', (req, res) => {
    res.send('Question and Answer Server is running');
})

app.listen(port, () => {
    console.log('Server Running on Port:', port)
})
