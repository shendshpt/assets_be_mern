import mongoose from 'mongoose'

const connectDB = async () => {
  const myAccount =
    process.env.MONGO_URI ||
    'username, password, conecting, xample databse from mongodb atlas'
  try {
    mongoose.set('strictQuery', false)
    const conn = await mongoose.connect(myAccount, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold)
    process.exit(1)
  }
}

export default connectDB
