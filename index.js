const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000

// middleware 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('green focus server is running')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pwszy9e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try {
        // connect with database and collection 
        const serviceCollection = client.db('greenFocus').collection('services')
        const commentCollection = client.db('greenFocus').collection('reviews')

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

        app.post('/services', async(req, res) => {
            const service = req.body
            const result = await serviceCollection.insertOne(service)
            res.send(result) 
        })


        app.get('/details/:id', async(req, res) => {
            const id = req.params.id 
            const query = {_id: ObjectID(id)}
            const details = await serviceCollection.findOne(query)
            res.send(details)
        })


        // review insert
        app.post('/reviews', async(req, res) => {
            const review = req.body 
            const reviews = await commentCollection.insertOne(review)
            res.send(reviews)
        })

        // review get 
        app.get('/reviews', async(req, res) => {
            const query = {}
            const cursor = commentCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: ObjectID(id)}
            const result = await commentCollection.deleteOne(query)
            res.send(result)
        })

        // edit data 
        app.get('/edit/:id', async(req, res) => {
            const id = req.params.id 
            const query = {_id: ObjectID(id)}
            const result = await commentCollection.findOne(query)
            res.send(result)
        })

        // update data 
        app.patch('/update/:id', async(req, res) => {
            const id = req.params.id 
            const query = {_id: ObjectID(id)}
            const updateReview = req.body.data 
            const updateDoc = {
                $set: {
                    review: updateReview
                }
            }
            const result = await commentCollection.updateOne(query, updateDoc)
            res.send(result)
        })

    }
    finally {

    }
}

run().catch(error => console.error(error))



app.listen(port)