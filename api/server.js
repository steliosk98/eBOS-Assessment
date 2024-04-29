const express = require('express');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const PORT = 4000;

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

// Define resolvers for GraphQL
const resolvers = {
    Query: {
        users: () => users,
        albums: () => albums,
        photos: () => photos,
    },
};

// Initialize Apollo Server
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

// REST Endpoint to get all albums or albums by a specific user
app.get('/albums', (req, res) => {
    const { userId } = req.query;
    let filteredAlbums = albums;

    if (userId) {
        filteredAlbums = albums.filter(album => album.userId.toString() === userId);
    }

    // Map through each album and add a photo count
    const albumsWithPhotoCount = filteredAlbums.map(album => {
        const photoCount = photos.filter(photo => photo.albumId === album.id).length;
        return { ...album, photoCount };
    });

    res.json(albumsWithPhotoCount);
});

// REST Endpoint to get all photos
app.get('/photos', (req, res) => {
    res.json(photos);
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