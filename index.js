const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uqseuad.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const mediaCollections = client.db('realBook').collection('media');

        // add post in media
        app.post('/media', async(req, res) =>{
            const media = req.body;
            const result = await mediaCollections.insertOne(media);
            res.send(result);
        });

        // get all post
        app.get('/posts', async(req, res) =>{
            const query = {};
            const result = await mediaCollections.find(query).toArray();
            res.send(result);
        })
    }
    finally{

    }
}

run()
.catch(error => console.error(error));

app.get('/', (req, res) =>{
    res.send('realBook in running');
});

app.listen(port, (req, res) =>console.log(`port is running on ${port}`));