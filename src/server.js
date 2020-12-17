const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const { Comment } = require('./model/comment');

const app = express();

// Serve up the build folder as static files on the root domain
app.use(express.static('build'));

// Connect to the MongoDB database called test (will create one if it doesn't exist)
mongoose.connect('mongodb://localhost/assignment-3', { useNewUrlParser: true });

// Print out database connection status
const { connection } = mongoose;
connection.on('error', () => console.log('DB Error'));
connection.once('open', () => console.log('DB is up!'));

// Parse POST request bodies as objects (middleware)
app.use(express.json());

// When a request is performed to fetch comments, return all comments in the database
app.get('/contact', async (request, response) => {

    console.log('GET /contact');

    response.sendFile(path.join(__dirname + '/../build/index.html'));

});

app.get('/queries', async (request, response) => {

    console.log('GET /queries');

    // Find all comments without any filtering (gets all comments)
    // Note: In practice you would want to paginate this response
    const comments = await Comment.find({});

    // Sent all the comments back, express will handle JSON serialization fo us
    return response.send(comments);
});

// When a request is performed to add a new comment, validate the text field and try to create the comment
app.post('/contact', async (request, response) => {

    console.log('PUT /contact ', request.body);

    const { email, query } = request.body;

    // If there is no text in the request body, there is nothing we can do
    if (!email || !query) {

        return response.sendStatus(400);

    } else {

        // Surround comment creation in a try catch in case of DB or model validation issue
        try {

            await Comment.create({ email, query });
            return response.sendStatus(200);

        } catch (error) {

            // Something unexpected went wrong
            return response.sendStatus(500);

        }

    }

});

// When an unknown request comes through, send it the React app (used with React router)
app.get('/*', (request, response) =>{

    return response.sendFile(path.join(__dirname + '/../build/index.html'));

});

app.listen(process.env.PORT || 5000, () => console.log('Server is up!'));