import "dotenv/config";
import app from "./app.js";

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`API listening on port ${port}`);
});
