const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT} ...`)
});


app.get('/', ( req, res ) => {
    res.send("Hello World!");
})