const express= require('express');
const cors=require('cors');
const userRouter=require('./routes/userRoutes');
const communityRouter=require('./routes/communityRoutes');
const postRouter=require('./routes/postRoutes');
const logger = require('./middleware/logger');
const { upload, handleUpload } = require('./controllers/image');

require('dotenv').config();

const app=express();

app.use(cors({origin: "*"}));
app.use(express.json())
app.use(logger);

app.use("/user",userRouter);
app.use("/community",communityRouter);
app.use("/posts",postRouter);

app.post('/upload', upload.single('image'), handleUpload);


app.listen(5000,()=>{
    console.log('server running .....')
});