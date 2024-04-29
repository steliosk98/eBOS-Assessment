const express = require('express');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const PORT = 4000;

// Use JSON parser middleware for parsing JSON data from incoming requests
app.use(express.json());

// Arrays to store data from CSV files
let users = [];
let albums = [];
let photos = [];

/**
 * Reads data from a CSV file and stores it in an array.
 * @param {string} filePath - The path to the CSV file.
 * @param {Array} dataArray - The array to store the data.
 * @param {Function} callback - Callback function to execute after reading the file.
 */
function readCSVData(filePath, dataArray, callback) {
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => dataArray.push(row))
        .on('end', () => {
            console.log(`CSV file ${filePath} successfully processed`);
            callback();
        });
}

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/**
 * Writes data to a CSV file.
 * @param {string} filePath - The path to the CSV file.
 * @param {Array} data - Array of objects to be written to the CSV file.
 */
function writeDataToCSV(filePath, data) {
    const csvWriter = createCsvWriter({
        path: filePath,
        header: [
            {id: 'userId', title: 'userId'},
            {id: 'id', title: 'id'},
            {id: 'title', title: 'title'}
        ]
    });

    csvWriter.writeRecords(data)
        .then(() => {
            console.log('Data written successfully to CSV');
        })
        .catch(err => {
            console.error('Error writing to CSV:', err);
        });
}

// Define GraphQL schema
const typeDefs = gql`
  type Query {
    users: [User]
    albums: [Album]
    photos: [Photo]
  }

  type User {
    id: Int
    name: String
    username: String
    email: String
    address: Address
    phone: String
    website: String
    company: Company
  }

  type Address {
    street: String
    suite: String
    city: String
    zipcode: String
    geo: Geo
  }

  type Geo {
    lat: String
    lng: String
  }

  type Company {
    name: String
    catchPhrase: String
    bs: String
  }

  type Album {
    userId: Int
    id: Int
    title: String
  }

  type Photo {
    albumId: Int
    id: Int
    title: String
    url: String
    thumbnailUrl: String
  }
`;

// Define resolvers for GraphQL queries
const resolvers = {
    Query: {
        users: () => users,
        albums: () => albums,
        photos: () => photos,
    },
};

// Initialize Apollo Server with type definitions and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Read data from CSV files and start the server
readCSVData('./mock_data/users.csv', users, () => {
    readCSVData('./mock_data/albums.csv', albums, () => {
        readCSVData('./mock_data/photos.csv', photos, async () => {
            // Start Apollo Server
            await server.start();
            server.applyMiddleware({ app });

            // Start the Express server after all data is loaded
            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`);
                console.log(`GraphQL path is http://localhost:${PORT}${server.graphqlPath}`);
            });
        });
    });
});

// Enable CORS for all routes
app.use(cors());

// REST Endpoint to get all users
app.get('/users', (req, res) => {
    res.json(users);
});

// REST Endpoint to get all albums or albums by a specific user with photo counts
app.get('/albums', (req, res) => {
    const { userId } = req.query;
    let filteredAlbums = albums;

    if (userId) {
        filteredAlbums = albums.filter(album => album.userId.toString() === userId);
    }

    // Map through each album and add a photo count
    const albumsWithPhotoCount = filteredAlbums.map(album => {
        const photoCount = photos.filter(photo => photo.albumId === album.id && photo.userId === album.userId).length;
        return { ...album, photoCount };
    });

    res.json(albumsWithPhotoCount);
});

// REST Endpoint to get all photos or photos by a specific album
app.get('/photos', (req, res) => {
    const { albumId, userId } = req.query;
    let filteredPhotos = photos.filter(photo =>
        photo.albumId.toString() === albumId && photo.userId.toString() === userId);

    res.json(filteredPhotos);
});

// REST Endpoint to delete a specific photo by ID
app.delete('/photos/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = photos.length;
    photos = photos.filter(photo => photo.id.toString() !== id);

    if (photos.length < initialLength) {
        res.status(200).send({ message: 'Photo deleted successfully' });
    } else {
        res.status(404).send({ error: 'Photo not found' });
    }
});

// Add an album
app.post('/albums', (req, res) => {
    const { userId, id, title } = req.body;
    albums.push({ userId: parseInt(userId), id: parseInt(id), title });
    writeDataToCSV('./mock_data/albums.csv', albums);
    res.status(201).send('Album added');
});

// Edit an album
app.put('/albums/:id', (req, res) => {
    const { title } = req.body;
    const { id } = req.params;
    const albumIndex = albums.findIndex(album => album.id.toString() === id);

    if (albumIndex !== -1) {
        albums[albumIndex].title = title;
        writeDataToCSV('./mock_data/albums.csv', albums);
        res.send('Album updated');
    } else {
        res.status(404).send('Album not found');
    }
});

// Delete an album
app.delete('/albums/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = albums.length;
    albums = albums.filter(album => album.id.toString() !== id);

    if (albums.length < initialLength) {
        writeDataToCSV('./mock_data/albums.csv', albums);
        res.send('Album deleted');
    } else {
        res.status(404).send('Album not found');
    }
});

// REST Endpoint to get a specific album by ID and UserID
app.get('/albums/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;  // Get userId from query parameters

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    const album = albums.find(album => album.id.toString() === id && album.userId.toString() === userId);

    if (album) {
        res.json({ title: album.title });  // Send back only the title of the album
    } else {
        res.status(404).send('Album not found');
    }
});