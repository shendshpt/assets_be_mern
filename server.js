import express from 'express'
import connectDB from './config/db.js'
import colors from 'colors'
import productRoutes from './routes/productRoutes.js'
import auth from './routes/auth.js'
import privateRoute from './routes/private.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import dotenv from 'dotenv'
import expressAsyncHandler from 'express-async-handler'
import bodyParser from 'body-parser'
import cors from 'cors'

dotenv.config()

// connect DB
connectDB()

const app = express()

// OPEN BLOCKED BROWSER POLICE
app.use(cors())

//  Defind req.body from  api
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/auth', auth)
app.use('/api/private', privateRoute)

app.use(notFound)

//error handler (should be last piece of middleware)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
)

process.on('unhandledRejection', (err, promise) => {
  console.log(`logged error: ${err}`)
})
