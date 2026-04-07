import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import logo from "./logo.png";

const moods = {
  happy: ["smile", "joy", "happiness", "cheer"],
  sad: ["sad", "pain", "tears", "hard"],
  motivation: ["success", "dream", "goal", "work"],
  love: ["love", "heart", "relationship"],
  life: ["life", "living", "future"],
};

function App() {
  const [allQuotes, setAllQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [quote, setQuote] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [darkMode, setDarkMode] = useState(false);
  const quoteRef = useRef();

  // Fetch all quotes once
  useEffect(() => {
    fetch("https://dummyjson.com/quotes?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setAllQuotes(data.quotes);
        setQuote(data.quotes[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const filterByMood = (mood) => {
    const keywords = moods[mood];

    const filtered = allQuotes.filter((q) =>
      keywords.some((word) =>
        q.quote.toLowerCase().includes(word)
      )
    );

    setFilteredQuotes(filtered);

    if (filtered.length > 0) {
      setQuote(filtered[Math.floor(Math.random() * filtered.length)]);
    }
  };

  const getRandomQuote = () => {
    const source =
      filteredQuotes.length > 0 ? filteredQuotes : allQuotes;

    if (source.length === 0) return;

    setQuote(source[Math.floor(Math.random() * source.length)]);
  };

  const saveFavorite = () => {
    if (!favorites.find((f) => f.id === quote.id)) {
      setFavorites([...favorites, quote]);
    }
  };

  const downloadImage = () => {
    html2canvas(quoteRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "quote.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        textAlign: "center",
        background: darkMode ? "#121212" : "#f4f4f4",
        color: darkMode ? "white" : "black",
      }}
    >
      <img
  src={logo}
  alt="App Logo"
  style={{ width: "120px", marginBottom: "10px" }}
/>
      <h1>🌈 Situation Quote App</h1>

      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <h3>Select Your Mood</h3>
      <div style={{ marginBottom: "20px" }}>
        {Object.keys(moods).map((mood) => (
          <button
            key={mood}
            onClick={() => filterByMood(mood)}
            style={{ margin: "5px" }}
          >
            {mood.toUpperCase()}
          </button>
        ))}
      </div>

      {quote && (
        <div
          ref={quoteRef}
          style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white",
            padding: "40px",
            borderRadius: "15px",
            margin: "20px auto",
            width: "80%",
            maxWidth: "600px",
          }}
        >
          <h2>"{quote.quote}"</h2>
          <p>- {quote.author}</p>
        </div>
      )}

      <button onClick={getRandomQuote}>New Quote</button>
      <button onClick={downloadImage} style={{ marginLeft: "10px" }}>
        Download
      </button>
      <button onClick={saveFavorite} style={{ marginLeft: "10px" }}>
        ❤️ Save
      </button>

      <h2 style={{ marginTop: "40px" }}>⭐ Favorites</h2>
      {favorites.length === 0 && <p>No favorites yet</p>}

      {favorites.map((fav) => (
        <div
          key={fav.id}
          style={{
            margin: "10px auto",
            padding: "10px",
            background: darkMode ? "#1e1e1e" : "white",
            borderRadius: "10px",
            width: "80%",
            maxWidth: "600px",
          }}
        >
          <p>"{fav.quote}"</p>
          <small>- {fav.author}</small>
        </div>
      ))}
    </div>
  );
}

export default App;