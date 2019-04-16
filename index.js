const express = require('express');
const store = require('./store');
const app = express();
const port = 82;

/* STATIC requests */
app.use(express.static('static'));

/* GET requests */
app.get('/users', (req, res) => res.send(JSON.stringify(store.objectStore.list, null, 2).toString()));

app.get('/users/:userId', (req, res) => {
    let id = req.params.userId;

    if (id === 'random') {
        const random = Math.floor(Math.random() * (store.objectStore.list.length)) + 1;
        id = random.toString();
    }
    res.send(getObject(id));
});

function getObject(id) {
    const list = store.objectStore.list;
    for (let i = 0; i < list.length; i++)
        if (list[i].id === id)
            return list[i];

    return '{}';
}

/* PUT requests */
app.put('/user', (req, res) => res.send('Got a PUT request @ /user'));

/* DELETE requests */
app.delete('/user', (req, res) => res.send('Got a DELETE request @ /user'));

/* INVALID requests */
app.use((req, res) => {
    console.log('User attempted to connect to ', req.originalUrl, ' and was sent 404 Not Found');
    res.status(404).send('This page is as non-existent as my life.')
});
app.use((err, req, res) => {
    console.log(err.stack);
    res.status(500).send('This is as broken as my will to live.')
});

// Start the app
app.listen(port, () => console.log(`App started on port ${port}!`));