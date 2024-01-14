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

require("./routes/task.routes")(app);
// require("./routes/user.routes")(app);
const userRoutes = require("./routes/user.routes")
userRoutes(app)


app.listen(port, ()=> console.log(`Express is listening on port ${port}`));