const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(cookieParser());

require("./config/mongoose.config");
require('dotenv').config();

const userRoutes = require("./routes/user.routes")  // userRoutes function
userRoutes(app)                                     // call userRoutes function with app (aka 'express()') as argument
require("./routes/task.routes")(app);               // This does both of the above in one line

app.listen(port, ()=> console.log(`Express is listening on port ${port}`));