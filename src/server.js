const fetch = require("node-fetch")
const express = require("express")
const server = express()
const nunjucks = require("nunjucks")


// configurando template engine
nunjucks.configure("src/views", {
    express: server,
    noCache: true,
})

// configurando rotas da aplicação
server.use(express.static("public"))
    .get("/", (req, res) => {
        return res.render("index.html")
    })

    .get("/posts", (req, res) => {
        fetch("https://jsonplaceholder.typicode.com/posts/")
        .then(response => {
            return response.json()
        }).then(dados => {
            return res.render("posts.html", { dados })
        })
    })

    .get("/albums", (req, res) => {
        fetch("https://jsonplaceholder.typicode.com/albums/")
        .then(response => {
            return response.json()
        }).then(dados => {
            return res.render("albums.html", { dados })
        })
    })

    .get("/todos", (req, res) => {
        fetch("https://jsonplaceholder.typicode.com/todos/")
        .then(response => {
            return response.json()
        }).then(dados => {
            return res.render("todos.html", { dados })
        })
    })
    // iniciando o servidor
    .listen(3333, () => { console.log("\nServidor iniciado na porta 3333. http://localhost:3333") })
