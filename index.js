const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y6hb5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('triply');
        const tourCollection = database.collection('popular_tours');
        const bookingCollection = database.collection('tour_booking');

        // get all popular tour
        app.get('/popular-tours', async (req, res) => {
            const result = tourCollection.find({});
            const PopularTours = await result.toArray();
            res.send(PopularTours);
        });

        // get a single popular tour
        app.get('/popular-tours/:id', async (req, res) => {
            const id = req.params.id;
            const result = await tourCollection.findOne({ _id: ObjectId(id) });
            res.send(result)
        });

        // booking your tour
        app.post('/tour-booking', async (req, res) => {
            const bookingData = req.body;
            const result = await bookingCollection.insertOne(bookingData);
            res.send(result);
        });

        // display all user tour
        app.get('/tour-booking', async (req, res) => {
            const result = bookingCollection.find({});
            const allBooking = await result.toArray();
            res.json(allBooking);
        });

        // display your tour
        app.get('/tour-booking/:email', async (req, res) => {
            const email = req.params.email;
            const result = bookingCollection.find({ email: email });
            const findEmail = await result.toArray();
            res.json(findEmail);
        });

        // delete your single tour
        app.delete('/tour-booking/:email/:id', async (req, res) => {
            const { email, id } = req.params;
            console.log(email, id);
            const query = {
                email: email,
                _id: ObjectId(id)
            };
            const remainingBooking = await bookingCollection.deleteOne(query);
            res.json(remainingBooking);
        });

        // delete a tour booking from admin
        app.delete('/tour-booking/:id', async (req, res) => {
            const { id } = req.params;
            const query = {
                _id: ObjectId(id)
            };
            const remainingBooking = await bookingCollection.deleteOne(query);
            res.json(remainingBooking);
        });

        // update approved status
        app.put('/tour-booking/:email/:id', async (req, res) => {
            const data = req.body;
            const { email, id } = req.params;
            const query = {
                email: email,
                _id: ObjectId(id)
            };
            const updateDocument = {
                $set: data
            };
            const result = await bookingCollection.updateOne(query, updateDocument, { upsert: true });
            res.json(result);
        })

        // post a new tour
        app.post('/add-new-tour', async (req, res) => {
            const newTour = req.body;
            const result = await tourCollection.insertOne(newTour);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Welcome to our triply');
})

app.listen(port, () => {
    console.log('Server is running on port', port);
})