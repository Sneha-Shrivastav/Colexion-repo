import express from 'express';
import cors from 'cors';

import bodyParser from 'body-parser';


import router from './routes/routes';


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://Sneha:2YSM7VL20ShhAbH3@cluster0.piczgou.mongodb.net/?retryWrites=true&w=majority", {
    // useNewUrlParser: true
})
    .then(() => console.log('MongoDb is connected'))
    .catch(err => console.log(err))

app.use('/', router);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});