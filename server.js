const mongoose = require("mongoose");
const dotenv = require("dotenv");
// eslint-disable-next-line import/no-extraneous-dependencies

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB, {}).then(() => console.log("DB Connection successful!"));

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
