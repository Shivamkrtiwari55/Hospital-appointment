import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './Config/mongodb.js'
import connectCloudinary from './Config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import appointmentRouter from './routes/appointmentRoutes.js';


// app config

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares 
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.use('/api/appointment', appointmentRouter);


app.get('/', (req,res)=>{
 res.send('API WORKING')
})

app.listen(port, ()=> console.log("Server Started",port))