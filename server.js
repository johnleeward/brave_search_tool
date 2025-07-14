const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

app.post("/web_search", async (req, res) => {
  const query = req.body.query;
  try {
    const response = await axios.get("https://api.search.brave.com/res/v1/web/search", {
      headers: {
        "Accept": "application/json",
        "X-Subscription-Token": BRAVE_API_KEY
      },
      params: {
        q: query,
        count: 3
      }
    });

    const results = response.data.web?.results || [];
    const simplified = results.map(item => ({
      title: item.title,
      url: item.url
    }));

    res.json(simplified);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Search failed");
  }
});

app.get("/", (req, res) => {
  res.send("Brave Search Tool is running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
