import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Cohere Proxy Running");
});

app.post("/ask-cohere", async (req, res) => {
  const userQuestion = req.body.question;
  if (!userQuestion) return res.status(400).json({ error: "Question required" });

  try {
    const response = await axios.post(
      "https://api.cohere.com/v2/chat",
      {
        model: "command-a-03-2025",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userQuestion }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiMessage = response.data?.message?.content?.[0]?.text || "No response";
    res.json({ answer: aiMessage });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Cohere API call failed" });
  }
});

app.listen(port, () => console.log(`Proxy running on http://localhost:${port}`));
