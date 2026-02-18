import express from "express"

import HttpError from "./middleware/HttpError.js";
import connectDB from "./db/mongoose.js";
import studentRoutes from "./routes/studentRoute.js";



const app = express()


app.use(express.json())

app.use("/student", studentRoutes)

app.get("/", (re, res) => {
    res.status(200).json("hello from Server")
})


// undefined routes

app.use((req, res, next) => {
    next(new HttpError("requested route not found", 404))
})

app.use((error, req, res, next) => {
    if(res.headerSent){
        next(error)
    }

    res
        .status(error.statusCode || 500)
        .json({massage: error.massage || "internal server ERROR"})

})


const port = process.env.port || 5000


async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server Listening ON Port ${port}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}


startServer()