# Game Search API

Random game finder built with Node.js, Express, EJS and the RAWG.io API.  
Pick a genre and/or a year, and the app will fetch a random game that matches your filters, then show its cover and basic info.

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