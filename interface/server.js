import express from "express";
import path from "path";

const port = 3000;

const app = express();

app.use(express.static(path.join(__dirname, "dist")));

app.listen(port, () => {
  console.log(`Interface app listening on port ${port}`);
});
