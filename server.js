const app = require("./src/app");
const { app: {port} } = require('./src/configs/config.database')
const PORT = port

const server = app.listen(PORT, () => {
    console.log(`Post server start with ${PORT}`)
})

process.on("SIGINT", ()=> {
    server.close(() =>  console.log(`Exit Server Express`))
})