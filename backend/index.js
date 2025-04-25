import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import productRoute from './routes/productRoute.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));
app.use(productRoute);

app.listen(5000, () => 
    console.log('Server is running on port 5000'));