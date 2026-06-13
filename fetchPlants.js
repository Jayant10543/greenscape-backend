const mongoose = require("mongoose");
const fetch = require("node-fetch");
require("dotenv").config();
const Plant = require("./models/Plant");

const API_KEY = process.env.PERENUAL_API_KEY;

async function fetchAndSavePlants() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  let savedCount = 0;

  for (let page = 1; page <= 30; page++) {
    try {
      const res = await fetch(
        `https://perenual.com/api/species-list?page=${page}&key=${API_KEY}&indoor=0`
      );
      const data = await res.json();

      if (!data.data || data.data.length === 0) break;

      for (const plant of data.data) {
        const existing = await Plant.findOne({ name: plant.common_name });
        if (existing || !plant.common_name) continue;

        const newPlant = new Plant({
          name: plant.common_name,
          latin: plant.scientific_name?.[0] || "",
          image: plant.default_image?.medium_url || plant.default_image?.original_url || "",
          tags: [
            plant.sunlight?.[0] || "Full sun",
            plant.watering ? plant.watering + " water" : "Medium water"
          ],
          category: plant.type || "plant",
          difficulty: plant.care_level === "Minimum" ? "easy" : plant.care_level === "Medium" ? "medium" : "hard",
          climate: "Tropical",
          sunlight: plant.sunlight?.[0] || "Full sun",
          water: plant.watering || "Medium",
          height: plant.dimension || "Varies",
          growTime: plant.growth_rate || "Moderate",
          soil: plant.soil?.[0] || "Loamy",
          season: plant.flowering_season || "Year round",
          states: "All India",
          uses: plant.cuisine ? ["Culinary"] : plant.medicinal ? ["Medicinal"] : ["Decorative"],
          care: {
            watering: plant.watering || "Regular",
            fertilizer: "Monthly",
            pruning: "As needed",
            repotting: "Every 2 years"
          },
          diseases: [],
          description: plant.description || `${plant.common_name} is a beautiful plant suitable for Indian gardens.`
        });

        await newPlant.save();
        savedCount++;
        console.log(`Saved: ${plant.common_name} (${savedCount})`);
      }

      console.log(`Page ${page} done`);
      await new Promise(r => setTimeout(r, 500));

    } catch (err) {
      console.log(`Error on page ${page}:`, err.message);
    }
  }

  console.log(`Done! Total plants saved: ${savedCount}`);
  mongoose.connection.close();
}

fetchAndSavePlants();