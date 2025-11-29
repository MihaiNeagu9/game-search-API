# Game Search API

Random game finder built with Node.js, Express, EJS and the RAWG.io API.  
Pick a genre and/or a year, and the app will fetch a random game that matches your filters, then show its cover and basic info.

GitHub repository: https://github.com/MihaiNeagu9/game-search-API

## Features

- Filter games by genre and release year
- Returns one random game from the filtered list
- Displays:
  - Game title
  - Genres (one or more)
  - Release year
  - Cover image with a simple loading state
- Keeps your selected filters after each search
- Friendly error messages when:
  - No games are found for the selected filters
  - The API is unavailable or something goes wrong
- Uses environment variables for the RAWG API key (no secret in code)

## Tech Stack

- Node.js + Express 5 (backend)
- EJS (server-side templating)
- Axios (HTTP client for RAWG API)
- CSS (custom, no framework)
- dotenv (environment variable management)
- RAWG.io API (game data)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/MihaiNeagu9/game-search-API.git
cd game-search-API
npm install
```

### 2. Configure environment variables

Create a .env file in the project root:

```bash
RAWG_API_KEY=your_rawg_api_key_here
```

You can get an API key from: https://rawg.io/apidocs


### 3. Run the app
In development:
```bash
nodemon index.js
```
By default the app listens on: http://localhost:3000
