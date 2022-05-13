import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import dotenv from 'dotenv';
import model from './model.js';
//Import Routes
import router from './routes/auth.js';
import postRoutes from './routes/post.js';
import userRoutes from './routes/user.js';


//app config
const app= express();
const port= process.env.PORT || 4000;

dotenv.config();


const pusher = new Pusher({
  appId: "1328147",
  key: "41608496ee5c11971d60",
  secret: "bf08b8d5e7f05282ae45",
  cluster: "mt1",
  useTLS: true
});

//middleware
app.use(express.json());
app.use(cors({
    origin: '*'
}));

//DB config
const connection_url="mongodb+srv://Cliff:user-123@cluster0.t65ok.mongodb.net/instaDB?retryWrites=true&w=majority";
mongoose.connect(process.env.DB_CONNECT,{
    
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

mongoose.connection.once("open",()=>{
    console.log("database connected");

    const changeStream = mongoose.connection.collection('users').watch();
    changeStream.on('change',(change) => {

        console.log('change detected on pusher');
        console.log(change);
        console.log("end of change");

        if(change.operationType==='insert'){
            console.log('Triggering Pusher --img uploud--');

            const postDetails = change.fullDocument;
            pusher.trigger('posts',{
                user: postDetails.user,
                caption: postDetails.caption,
                image: postDetails.image,

            })
        }else{

            console.log("unkown trigger from trigger");
        }

    })
});
//api route Middlewares

app. use('/api/user', router);
app.use('/api/posts', postRoutes);
app.use('/api/query', userRoutes);

app.get('/',(req, res) => res.status(200).send("hello world"));

app.post('/upload',(req, res) => {

    const body = req.body;
    model.create(body, (err, data) =>{
        if(err){
            res.status(500).send();
        }else{
            res.status(201).send(data);
        }

    })
})

app.get('/sync', (req, res) =>{
    model.find((err,data) => {

        if(err){
            res.status(500).send();
        }else{
            res.status(200).send(data);
        }

    });
})

//listen
app.listen(port, () => console.log(`server running on port ${port}`));