# eBOS Assessment - Stelios Kiliaris
Find below the details, explanations and instructions on running the development implemented for the purposes of eBOS Assessment. 

# Node.js API Server with REST and GraphQL

This project demonstrates a Node.js API server that serves data from CSV files through both REST and GraphQL endpoints. It uses Express for handling REST API requests and Apollo Server for GraphQL queries.

## Project Structure

- `server.js`: The main server file that sets up both the REST and GraphQL APIs.
- `mock_data/`: Directory containing CSV files with mock data for users, albums, and photos.
    - `users.csv`
    - `albums.csv`
    - `photos.csv`

## Prerequisites

Before you can run the server, you need to have the following installed:
- Node.js (v12.x or higher)
- npm (usually comes with Node.js)

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/steliosk98/eBOS-Assessment.git
   ```
2. **Install Dependencies**

    ```bash
    npm install
    ```
   This will install all required dependencies including Express, Apollo Server, and csv-parser.


3. **Running the Server**

    To start the server, run the following "api" folder of the project:
    ```bash
   node server.js
    ```
   Once the server is running, it will load data from the CSV files and listen on port 4000. You can access the server at:
* REST API Endpoints:
  - http://localhost:4000/users - Fetches all users.
  - http://localhost:4000/albums - Fetches all albums.
  - http://localhost:4000/photos - Fetches all photos.
* GraphQL API Endpoint:
  - http://localhost:4000/graphql - Access the GraphQL playground where you can execute queries.

## Example GraphQL Query

You can perform a query to fetch users with their details by accessing the GraphQL playground at http://localhost:4000/graphql and running the following query:

```graphql
query {
  users {
    id
    name
    username
    email
    address {
      street
      city
      zipcode
      geo {
        lat
        lng
      }
    }
    phone
    website
    company {
      name
      catchPhrase
      bs
    }
  }
}
```


    
