import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
const PORT = process.env.PORT || 5001;
connectToDatabase()
    .then(() => {
    app.listen(PORT, () => console.log("Server open & connected to Database successfully"));
})
    .catch((err) => console.log(err));
//# sourceMappingURL=index.js.map