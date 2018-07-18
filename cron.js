'use strict';

require('dotenv').config();
const Mongoose = require('mongoose');

Mongoose.Promise = global.Promise;

// :::::::::::::::::::::::::::::::::::::::::::::

var cronSchema = new Mongoose.Schema({
    runtime: Date
});

var cronModel = Mongoose.model("Jobs", cronSchema);

// :::::::::::::::::::::::::::::::::::::::::::::
async function runJob() {
    let options = {
        useNewUrlParser: true
    };

    let dburl = process.env.MONGODB_URL;

    if(!dburl) {
        console.log("MONGODB_URL environment variable not set.. exiting ..")
        process.exit(1);
    }

    if(process.env.MONGODB_USERNAME) {
        options.user = process.env.MONGODB_USERNAME;
    }

    if(process.env.MONGODB_PASSWORD) {
        options.pass = process.env.MONGODB_PASSWORD;
    }

    try {
        await Mongoose.connect(dburl,options);
        console.log("Connected to MongoDB..");
    } catch(err) {
        console.log("Unable to connect to database .. exiting ..");
        console.log(err);
        process.exit(1);
    }

    // Insert new entry
    let cronEntry = new cronModel({
        runtime: new Date()
    });
    
    await cronEntry.save();
}

// :::::::::::::::::::::::::::::::::::::::::::::
runJob().then( () => {
    process.exit(0);
});
