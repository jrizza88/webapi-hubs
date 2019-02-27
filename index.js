
const express = require("express");

const server = express();

const PORT = '9090';

const db = require("./data/db.js");

// method that returns a bit of middleware
// this also has to be placed before the POST requests. 
server.use(express.json());

server.get("/", (req, res) => {
    res.send('Hello, Jamar');
});

server.get("/now", (req, res) => {
    // send back the current date and time
    const today = new Date().toString();
    // console.log("today", today) - response will never been sent!
    res.send(today);
});

server.get("/api/hubs", (req, res) => {
    db.hubs.find()
    .then(hubs => {
        res.json(hubs);
    }).catch(({code, message}) => {
        res.status(code).json({err: message})
    });
});

server.get("/api/hubs/:id", (req, res) => {
// get specific hub
const id = req.params.id
// send an error message if the id is invalid
db.hubs.findById(id)
.then(hub => {
    if (hub) {
    res.json(hub)
} else {
    res.status(400).json({err: 'invalid id'})
}
}).catch(({code, message}) => {
        res.status(code).json({err: message})
    });
});

server.post("/api/hubs", (req, res) => {
    const newHub = req.body;
    db.hubs.add(newHub)
    .then(dbHub => {
        res.status(201).json(dbHub)
    }).catch(({code, message}) => {
        res.status(code).json({err: message})
    });
});

server.put('/api/hubs/:id', (req, res) => {
    const { id } = req.params
    const updatedHub = req.body
    db.hubs
      .update(id, updatedHub)
      .then(dbHub => {
        res.json(dbHub)
      })
      .catch(({ code, message }) => {
        res.status(code).json({ err: message })
      })
  })

server.delete("/api/hubs/:id", (req, res) => {
    const { id } = req.params;

    db.hubs.remove(id)
    .then( hub => {
        if (hub) {
            res.json(hub);
        } else {
            res.status(400).json({err: 'invalid id'});
        }
    }).catch(({code, message}) => {
        res.status(code).json({err: message})
    })
});

server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
    console.log("Hello, Jamar!")
})