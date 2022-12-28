const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uqseuad.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const mediaCollections = client.db('realBook').collection('media');
        const usersCollections = client.db('realBook').collection('users');

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
        });

        // specifig post by id
        app.get('/posts/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await mediaCollections.findOne(filter);
            res.send(result);
        });

        // users saved in database
        app.post('/users', async(req, res) =>{
            const user = req.body;
            const result = await usersCollections.insertOne(user);
            console.log(result)
            res.send(result);
        });

        // query email
        app.get('/users', async(req, res) =>{
            const email = req.query.email;
            const query = {email};
            const users = await usersCollections.findOne(query);
            res.send(users);
        });

        app.patch('/users/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const users = req.body;
            const option = {upsert: true};
            const updatedDoc = {
                $set:{
                    name: users.name,
                    email: users.email,
                    collage: users.collage, 
                    address: users.address
                }
            };
            const result = await usersCollections.updateOne(filter, updatedDoc, option);
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

