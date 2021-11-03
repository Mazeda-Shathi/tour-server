const express = require('express');
const { MongoClient } = require('mongodb')
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()


//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rap36.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("tour");
        const packageCollection = database.collection('package')
        const bookingCollection = database.collection('booking')

        //get ApI for package
        app.get('/package', async (req, res) => {
            const cursor = packageCollection.find({});
            const package = await cursor.toArray();
            res.send(package)
            console.log("connect");
        })
        //post API for package 
        app.post('/package', async (req, res) => {
            console.log("hit post");
            const package = req.body
            const result = await packageCollection.insertOne(package)
            res.json(result)
        })

        //get single package
        app.get('/package/:_id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const pack = await packageCollection.findOne(query);
            res.json(pack)
        })



        //get ApI for booking 
        app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking)
            console.log("connect to  booking");
        })
        //post API for bookingr
        app.post('/booking', async (req, res) => {
            console.log("hit booking");
            const booking = req.body
            const result = await bookingCollection.insertOne(booking)
            res.json(result)
        })

        //delete ApI for booking
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result)
        })



    } finally {
        //  await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost`, port)
})