const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000

// middleware 
app.use(cors())

app.get('/', (req, res) => {
    res.send('green focus server is running')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pwszy9e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try {
        // connect with database and collection 
        const serviceCollection = client.db('greenFocus').collection('services')
        const reviewsCollection = client.db('greenFocus').collection('reviews')

        // get services from database 
        app.get('/home', async(req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })

        app.get('/services', async(req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        app.get('/details/:id', async(req, res) => {
            const id = req.params.id 
            const query = {_id: ObjectID(id)}
            const details = await serviceCollection.findOne(query)
            res.send(details)
        })


        // reviews 
        // app.get('/reviews', async(req, res) => {
        //     const query = {}
        //     const cursor = 
        // })


    }
    finally {

    }
}

run().catch(error => console.error(error))



app.listen(port)