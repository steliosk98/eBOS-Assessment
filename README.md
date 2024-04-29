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

# Front End Application with React

This section of the project demonstrates a React application that interacts with the Node.js API server to display and manage data for users, albums, and photos. The application uses React Router for navigation and React Intl for internationalization.

## Project Structure

* src/: The source directory for the React application.
  - App.js: The main React component that sets up routing and global context.
  - index.js: The entry point for the React application that renders the App component.
  - Users.js: Component for displaying and managing users.
  - Albums.js: Component for displaying and managing albums associated with a user.
  - Photos.js: Component for displaying and managing photos within an album.
  - Pagination.js: Reusable component for pagination.
  - LanguageSwitcher.js: Component to switch between different locales.
  - messages.js: Contains messages for internationalization.
  - App.css, index.css: CSS files for styling the application.
  - public/: Contains the index.html and other assets.

## Prerequisites
Ensure that the Node.js API server is running as described in the previous sections since the React application will need to interact with it.

## Installation
Follow these steps to set up the React application locally:

1. Navigate to the Front End Application Directory Assuming you are in the root directory of the project, change to the front end application directory:
```bash
cd react-users-api
```
2. Install Dependencies
```bash
 npm install
```
This will install all required dependencies including React, React Router, and React Intl.
3. Running the Application

To start the React application, run:
```bash
 npm start
```
This command will start the development server and open the application in your default web browser. The application is typically served at:
- http://localhost:3000

## Navigating the Application
Once the application is running, you can navigate through the following routes:

- /users: Displays a list of users. Clicking on a user will navigate to the user's albums.
- /albums/:userId: Displays albums for a specific user. Clicking on an album will show the photos in that album. Allows to Add/Edit/Delete Albums.
- /photos/:userId/:albumId: Displays photos within a specific album. Provides options to delete photos.

# Conclusion

This README provides a comprehensive guide to setting up and navigating both the backend Node.js API server and the front end React application. By following the steps outlined, you should be able to run and interact with the full stack application effectively.