const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const PORT = 4000;

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

// REST Endpoint to get all users
app.get('/users', (req, res) => {
    res.json(users);
});

// REST Endpoint to get all albums
app.get('/albums', (req, res) => {
    res.json(albums);
});

// REST Endpoint to get all photos
app.get('/photos', (req, res) => {
    res.json(photos);
});