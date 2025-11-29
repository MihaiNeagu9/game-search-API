
// Import core dependencies
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize Express app and configure port
const app = express();
const port = 3000;

// RAWG API key (read from environment)
const API_KEY = process.env.RAWG_API_KEY;

// Serve static assets from /public (CSS, images, client-side JS) 
app.use(express.static("public"));

// Parse URL-encoded bodies from HTML forms
app.use(express.urlencoded({ extended: true }));

// Precompute the list of years shown in the filter dropdown
const years = [];
const startYear = 2000;
const endYear = 2025;
for (let i = startYear; i <= endYear; i++) {
    years.push(i);
}

// Helper: build RAWG games URL based on current filters
function buildGamesURL({ genre, year }) {
  let url = `https://api.rawg.io/api/games?key=${API_KEY}`;

  if (genre) {
    // RAWG expects genre slugs (e.g. "action", "rpg")
    url = url + `&genres=${genre}`;
  }

  if (year) {
    // RAWG dates filter: full year range (YYYY-01-01 to YYYY-12-31)
    url = url + `&dates=${year}-01-01,${year}-12-31`;
  }

  return url;
}

// GET / - render home page with filters (no game selected yet)
app.get("/", async (request, response) => {
    try {
        // Fetch available genres for the dropdown
        const resultGenre = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);

        response.render("index.ejs", {
            listGenres: resultGenre.data.results, 
            year: years,
            selectedGenre: "",
            selectedYear: "",
            errorMessage: "",
        });
    } catch (err) {
        console.error("Eroare on / (GET):", err.message);

        // If something fails (API down, bad key, etc.), show a friendly message in the UI
        response.status(500).render("index.ejs", {
            listGenres: [],
            year: years,
            selectedGenre: "",
            selectedYear: "",
            errorMessage: "Cannot load data right now. Please try again later."
        });
    }
});

// POST / - handle form submission and show a random game based on filters
app.post("/", async (request, response) => {
    const genre = request.body.genre;
    const year = request.body.year;

    try {
        // Build RAWG URL with the selected filters (genre/year)
        const gamesURL = buildGamesURL({ genre, year });
            
        // Fetch games and genres from RAWG
        const result = await axios.get(gamesURL);
        const resultGenre = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);

        const games = result.data.results;

        // No games for the given filters → show a friendly message

        if (!games || games.length === 0) {
            return response.render("index.ejs", {
                listGenres: resultGenre.data.results,
                year: years,
                selectedGenre: genre,
                selectedYear: year,
                errorMessage: "No games found for the selected filters."
            });
        }

        // Pick a random game from the filtered list
        const randomNumber = Math.floor(Math.random() * games.length);
        const game = games[randomNumber];

        // Render page with the selected random game
        response.render("index.ejs", {
            name: game.name, 
            genreGame: game.genres?.map((g) => g.name).join(", ") || "Unknown", 
            release: game.released ? game.released.split("-")[0] : "N/A",
            listGenres: resultGenre.data.results,
            year: years,
            image: game.background_image,
            selectedGenre: genre,
            selectedYear: year,
            errorMessage: "",
        });
    } catch (err) {
         console.error("Error on / (POST):", err.message);

        // Try to recover the genre list so the UI is still usable
        let listGenres = [];
        try {
            const resultGenre = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);
            listGenres = resultGenre.data.results;
        } catch (_) {
            // Ignore secondary failure; we'll just show an empty genres list
        }

        response.status(500).render("index.ejs", {
            listGenres,
            year: years,
            selectedGenre: genre,
            selectedYear: year,
            errorMessage: "An error occurred while searching. Please try again."
        });
    }
});

// Start the HTTP server
app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});