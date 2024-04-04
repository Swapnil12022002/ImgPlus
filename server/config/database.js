import mongoose from "mongoose";

const db_connect = (url) => {
  mongoose
    .connect(url)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err.message));
};

export default db_connect;
