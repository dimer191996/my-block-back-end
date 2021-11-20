import mongoose from "mongoose";
mongoose
  .connect(
    `mongodb+srv://db191996:mitsubishi@cluster0.nwcuh.mongodb.net/blog?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connected to mongo db");
  })
  .catch((err) => {
    console.log("fail to connect to mongo db", err);
  });
