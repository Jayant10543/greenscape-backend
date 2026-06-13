const mongoose = require("mongoose");
require("dotenv").config();
const Plant = require("./models/Plant");

const plants = [
  {
    name: "Tulsi", latin: "Ocimum tenuiflorum",
    image: "https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?w=400&h=300&fit=crop",
    tags: ["Full sun", "Low water"], category: "herb", difficulty: "easy", climate: "Hot & dry",
    sunlight: "Full sun", water: "Low", height: "30-60cm", growTime: "30 days",
    soil: "Loamy, Sandy", season: "March - October", states: "UP, MP, Delhi, Rajasthan",
    uses: ["Medicinal", "Religious", "Culinary"],
    care: { watering: "Every 2-3 days", fertilizer: "Monthly, organic", pruning: "Pinch tips weekly", repotting: "Every 1-2 years" },
    diseases: [{ name: "Powdery mildew", risk: "medium" }, { name: "Root rot", risk: "medium" }],
    description: "Sacred herb widely grown across India, excellent for medicinal and religious use."
  },
  {
    name: "Marigold", latin: "Tagetes erecta",
    image: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?w=400&h=300&fit=crop",
    tags: ["Full sun", "Seasonal"], category: "flower", difficulty: "easy", climate: "Tropical",
    sunlight: "Full sun", water: "Medium", height: "30-90cm", growTime: "45 days",
    soil: "Loamy, Well-drained", season: "October - February", states: "All India",
    uses: ["Decorative", "Religious", "Pest repellent"],
    care: { watering: "Every 2 days", fertilizer: "Bi-weekly", pruning: "Deadhead regularly", repotting: "Not needed" },
    diseases: [{ name: "Botrytis", risk: "low" }, { name: "Spider mites", risk: "medium" }],
    description: "Bright seasonal flower used widely in Indian festivals and gardens."
  },
  {
    name: "Neem", latin: "Azadirachta indica",
    image: "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?w=400&h=300&fit=crop",
    tags: ["Drought tolerant"], category: "tree", difficulty: "easy", climate: "Hot & dry",
    sunlight: "Full sun", water: "Low", height: "10-20m", growTime: "1-2 years",
    soil: "Sandy, Loamy", season: "Year round", states: "All India",
    uses: ["Medicinal", "Pesticide", "Shade"],
    care: { watering: "Weekly once established", fertilizer: "Rarely needed", pruning: "Annual shaping", repotting: "N/A" },
    diseases: [{ name: "Leaf spot", risk: "low" }, { name: "Scale insects", risk: "low" }],
    description: "Hardy Indian tree with powerful medicinal and pesticidal properties."
  },
  {
    name: "Money Plant", latin: "Epipremnum aureum",
    image: "https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg?w=400&h=300&fit=crop",
    tags: ["Indoor", "Low water"], category: "indoor", difficulty: "easy", climate: "Any",
    sunlight: "Indirect light", water: "Low", height: "Up to 3m", growTime: "2-3 months",
    soil: "Well-drained potting mix", season: "Year round", states: "All India",
    uses: ["Air purifier", "Decorative", "Feng shui"],
    care: { watering: "Once a week", fertilizer: "Monthly liquid feed", pruning: "Trim long vines", repotting: "Every 2 years" },
    diseases: [{ name: "Root rot", risk: "medium" }, { name: "Yellow leaves", risk: "low" }],
    description: "Popular indoor vine known for air purification and low maintenance."
  },
  {
    name: "Jasmine", latin: "Jasminum sambac",
    image: "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?w=400&h=300&fit=crop",
    tags: ["Fragrant", "Partial sun"], category: "flower", difficulty: "medium", climate: "Subtropical",
    sunlight: "Partial sun", water: "Medium", height: "1-3m", growTime: "60-90 days",
    soil: "Loamy, Moist", season: "March - August", states: "TN, AP, Karnataka, UP",
    uses: ["Fragrance", "Religious", "Garlands"],
    care: { watering: "Every 2 days", fertilizer: "Monthly", pruning: "After flowering", repotting: "Every 2 years" },
    diseases: [{ name: "Bud drop", risk: "medium" }, { name: "Whitefly", risk: "medium" }],
    description: "Fragrant white flower widely used in Indian temples, hair and garlands."
  },
  {
    name: "Aloe Vera", latin: "Aloe barbadensis",
    image: "https://images.pexels.com/photos/965731/pexels-photo-965731.jpeg?w=400&h=300&fit=crop",
    tags: ["Full sun", "Low water"], category: "herb", difficulty: "easy", climate: "Hot & dry",
    sunlight: "Full sun", water: "Very low", height: "30-60cm", growTime: "3-4 years",
    soil: "Sandy, Well-drained", season: "Year round", states: "Rajasthan, Gujarat, AP",
    uses: ["Medicinal", "Skincare", "Hair care"],
    care: { watering: "Every 10-14 days", fertilizer: "Twice a year", pruning: "Remove dead leaves", repotting: "Every 2-3 years" },
    diseases: [{ name: "Root rot", risk: "high" }, { name: "Soft rot", risk: "medium" }],
    description: "Succulent plant known for its healing gel used in skincare and medicine."
  },
  {
    name: "Hibiscus", latin: "Hibiscus rosa-sinensis",
    image: "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?w=400&h=300&fit=crop",
    tags: ["Full sun", "Tropical"], category: "flower", difficulty: "easy", climate: "Tropical",
    sunlight: "Full sun", water: "Medium", height: "1-4m", growTime: "2-3 months",
    soil: "Loamy, Moist", season: "Year round", states: "Kerala, TN, Karnataka",
    uses: ["Decorative", "Medicinal", "Hair care"],
    care: { watering: "Daily in summer", fertilizer: "Bi-weekly", pruning: "Regular shaping", repotting: "Every 2 years" },
    diseases: [{ name: "Leaf curl", risk: "medium" }, { name: "Aphids", risk: "medium" }],
    description: "Vibrant tropical flower commonly used in Indian gardens and hair care."
  },
  {
    name: "Curry Leaf", latin: "Murraya koenigii",
    image: "https://images.pexels.com/photos/906150/pexels-photo-906150.jpeg?w=400&h=300&fit=crop",
    tags: ["Full sun", "Culinary"], category: "herb", difficulty: "easy", climate: "Tropical",
    sunlight: "Full sun", water: "Medium", height: "1-6m", growTime: "1-2 years",
    soil: "Loamy, Well-drained", season: "Year round", states: "TN, AP, Karnataka, Kerala",
    uses: ["Culinary", "Medicinal", "Aromatherapy"],
    care: { watering: "Twice a week", fertilizer: "Monthly", pruning: "Trim for bushiness", repotting: "Every 2 years" },
    diseases: [{ name: "Citrus psyllid", risk: "high" }, { name: "Leaf miner", risk: "medium" }],
    description: "Essential culinary herb in South Indian cooking with medicinal benefits."
  },
  {
    name: "Banana", latin: "Musa acuminata",
    image: "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?w=400&h=300&fit=crop",
    tags: ["Tropical", "High water"], category: "fruit", difficulty: "medium", climate: "Tropical",
    sunlight: "Full sun", water: "High", height: "2-8m", growTime: "9-12 months",
    soil: "Loamy, Rich", season: "Year round", states: "TN, AP, Kerala, Maharashtra",
    uses: ["Food", "Religious", "Leaves for cooking"],
    care: { watering: "Daily", fertilizer: "Monthly organic", pruning: "Remove dead leaves", repotting: "N/A" },
    diseases: [{ name: "Panama wilt", risk: "high" }, { name: "Sigatoka", risk: "medium" }],
    description: "Most widely consumed fruit in India, grows in tropical and subtropical regions."
  },
  {
    name: "Bougainvillea", latin: "Bougainvillea spectabilis",
    image: "https://images.pexels.com/photos/2879107/pexels-photo-2879107.jpeg?w=400&h=300&fit=crop",
    tags: ["Full sun", "Drought tolerant"], category: "flower", difficulty: "easy", climate: "Hot & dry",
    sunlight: "Full sun", water: "Low", height: "1-12m", growTime: "2-3 months",
    soil: "Well-drained", season: "November - May", states: "Rajasthan, Gujarat, Maharashtra",
    uses: ["Decorative", "Fencing", "Shade"],
    care: { watering: "Weekly", fertilizer: "Monthly in growing season", pruning: "After flowering", repotting: "Every 3 years" },
    diseases: [{ name: "Leaf spot", risk: "low" }, { name: "Mealybugs", risk: "medium" }],
    description: "Colorful climbing plant perfect for fences and walls in hot dry climates."
  },
  {
    name: "Snake Plant", latin: "Sansevieria trifasciata",
    image: "https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg?w=400&h=300&fit=crop",
    tags: ["Indoor", "Low water"], category: "indoor", difficulty: "easy", climate: "Any",
    sunlight: "Low to bright indirect", water: "Very low", height: "30-120cm", growTime: "Several months",
    soil: "Sandy, Well-drained", season: "Year round", states: "All India",
    uses: ["Air purifier", "Decorative", "Low maintenance"],
    care: { watering: "Every 2-3 weeks", fertilizer: "Twice a year", pruning: "Remove dead leaves", repotting: "Every 3 years" },
    diseases: [{ name: "Root rot", risk: "high" }, { name: "Mealybugs", risk: "low" }],
    description: "Nearly indestructible indoor plant that purifies air and thrives on neglect."
  },
  {
    name: "Papaya", latin: "Carica papaya",
    image: "https://images.pexels.com/photos/5945754/pexels-photo-5945754.jpeg?w=400&h=300&fit=crop",
    tags: ["Full sun", "Tropical"], category: "fruit", difficulty: "medium", climate: "Tropical",
    sunlight: "Full sun", water: "Medium", height: "2-10m", growTime: "9-11 months",
    soil: "Loamy, Well-drained", season: "Year round", states: "AP, TN, Maharashtra, Gujarat",
    uses: ["Food", "Medicinal", "Leaves used in cooking"],
    care: { watering: "Twice a week", fertilizer: "Monthly", pruning: "Remove lower leaves", repotting: "N/A" },
    diseases: [{ name: "Papaya ringspot", risk: "high" }, { name: "Powdery mildew", risk: "medium" }],
    description: "Fast growing tropical fruit tree with high nutritional value."
  },
  {
    name: "Champa", latin: "Plumeria alba",
    image: "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?w=400&h=300&fit=crop",
    tags: ["Full sun", "Fragrant"], category: "flower", difficulty: "medium", climate: "Tropical",
    sunlight: "Full sun", water: "Low to medium", height: "2-8m", growTime: "2-3 years",
    soil: "Sandy, Well-drained", season: "March - October", states: "TN, Kerala, AP, Maharashtra",
    uses: ["Religious", "Fragrance", "Garlands"],
    care: { watering: "Weekly", fertilizer: "Monthly in season", pruning: "Minimal", repotting: "Every 3 years" },
    diseases: [{ name: "Rust", risk: "medium" }, { name: "Scale insects", risk: "low" }],
    description: "Beautiful fragrant tree widely used in temple offerings and garlands."
  },
  {
    name: "Areca Palm", latin: "Dypsis lutescens",
    image: "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?w=400&h=300&fit=crop",
    tags: ["Indoor", "Air purifier"], category: "indoor", difficulty: "easy", climate: "Any",
    sunlight: "Bright indirect", water: "Medium", height: "1.5-3m", growTime: "Several years",
    soil: "Well-drained potting mix", season: "Year round", states: "All India",
    uses: ["Air purifier", "Decorative", "Humidifier"],
    care: { watering: "Twice a week", fertilizer: "Monthly liquid feed", pruning: "Remove yellowing fronds", repotting: "Every 2-3 years" },
    diseases: [{ name: "Root rot", risk: "medium" }, { name: "Spider mites", risk: "medium" }],
    description: "Popular indoor palm that adds tropical feel while purifying indoor air."
  },
  {
    name: "Ashoka", latin: "Saraca asoca",
    image: "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?w=400&h=300&fit=crop",
    tags: ["Partial sun", "Medicinal"], category: "tree", difficulty: "medium", climate: "Subtropical",
    sunlight: "Partial sun", water: "Medium", height: "7-10m", growTime: "Several years",
    soil: "Loamy, Moist", season: "February - April", states: "UP, MP, TN, Kerala",
    uses: ["Medicinal", "Religious", "Ornamental"],
    care: { watering: "Twice a week", fertilizer: "Monthly organic", pruning: "Minimal shaping", repotting: "N/A" },
    diseases: [{ name: "Leaf blight", risk: "low" }, { name: "Scale insects", risk: "low" }],
    description: "Sacred tree in Hindu and Buddhist traditions with important medicinal properties."
  },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    await Plant.deleteMany();
    await Plant.insertMany(plants);
    console.log("15 plants seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.log("Error:", err);
  }
}

seedDB();