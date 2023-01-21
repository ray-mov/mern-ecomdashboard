const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

mongoose.connect("mongodb://127.0.0.1:27017/e-com", (err) => {
  if (err) console.log(err);
  else console.log("server is connected");
});
