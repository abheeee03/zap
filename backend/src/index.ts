import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import { userRouter } from './routes/userRouter'
import { linkRouter } from './routes/linkRouter';
import { connectToDatabase } from './lib/db';

const app = express()

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/link', linkRouter)

const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(8080, ()=>{
            console.log("starting server at 8080");
        })
    } catch (error) {
        console.error("failed to start server", error);
        process.exit(1);
    }
};

void startServer();