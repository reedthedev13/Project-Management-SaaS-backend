"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = process.env.PORT || 5001;
app_1.server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
