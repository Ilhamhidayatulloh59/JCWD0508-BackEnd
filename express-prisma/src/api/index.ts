import app from "../index";
import serverless from "serverless-http";

// Ekspor aplikasi sebagai handler untuk Vercel
module.exports = serverless(app);
