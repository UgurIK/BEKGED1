const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Schema'lar
const AnaSayfa = mongoose.model("AnaSayfa", new mongoose.Schema({ text: String }));
const Galeri = mongoose.model("Galeri", new mongoose.Schema({ url: String, aciklama: String }));
const Proje = mongoose.model("Proje", new mongoose.Schema({ baslik: String, gorsel: String, tur: String, detay: String, basvuruLink: String }));
const Duyuru = mongoose.model("Duyuru", new mongoose.Schema({ baslik: String, tarih: String, detay: String }));

// Express Router kullanımı
app.get("/api/data", async (req, res) => {
    const anasayfa = await AnaSayfa.findOne().sort({ _id: -1 });
    const galeri = await Galeri.find();
    const projeler = await Proje.find();
    const duyurular = await Duyuru.find();
    res.json({
        anasayfa: anasayfa?.text || "",
        galeri,
        projeler,
        duyurular,
    });
});

app.post("/api/anasayfa", async (req, res) => {
    const { text } = req.body;
    await AnaSayfa.create({ text });
    res.send("Ana sayfa içeriği kaydedildi.");
});

app.post("/api/galeri", async (req, res) => {
    const { url, aciklama } = req.body;
    const item = await Galeri.create({ url, aciklama });
    res.json(item);
});

app.delete("/api/galeri/:id", async (req, res) => {
    await Galeri.findByIdAndDelete(req.params.id);
    res.send("Galeri öğesi silindi.");
});

app.post("/api/projeler", async (req, res) => {
    const proje = await Proje.create(req.body);
    res.json(proje);
});

app.delete("/api/projeler/:id", async (req, res) => {
    await Proje.findByIdAndDelete(req.params.id);
    res.send("Proje silindi.");
});

app.post("/api/duyurular", async (req, res) => {
    const duyuru = await Duyuru.create(req.body);
    res.json(duyuru);
});

app.delete("/api/duyurular/:id", async (req, res) => {
    await Duyuru.findByIdAndDelete(req.params.id);
    res.send("Duyuru silindi.");
});

module.exports = app;
