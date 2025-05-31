const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// MongoDB bağlantısı
mongoose.connect("mongodb+srv://ugurkihsan:384165uk@bekged1.zlwjf2m.mongodb.net/bekged?retryWrites=true&w=majority")
    .then(() => console.log("MongoDB bağlantısı başarılı!"))
    .catch(err => console.error("MongoDB bağlantı hatası:", err));

// Schema ve Model tanımları
const AnaSayfaSchema = new mongoose.Schema({ text: String });
const GaleriSchema = new mongoose.Schema({ url: String, aciklama: String });
const ProjeSchema = new mongoose.Schema({ baslik: String, gorsel: String, tur: String, detay: String, basvuruLink: String });
const DuyuruSchema = new mongoose.Schema({ baslik: String, tarih: String, detay: String });

const AnaSayfa = mongoose.model("AnaSayfa", AnaSayfaSchema);
const Galeri = mongoose.model("Galeri", GaleriSchema);
const Proje = mongoose.model("Proje", ProjeSchema);
const Duyuru = mongoose.model("Duyuru", DuyuruSchema);

// Middleware'ler
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Verileri getir
app.get("/api/data", async (req, res) => {
    const anasayfa = await AnaSayfa.findOne().sort({ _id: -1 });
    const galeri = await Galeri.find();
    const projeler = await Proje.find();
    const duyurular = await Duyuru.find();
    res.json({
        anasayfa: anasayfa?.text || "",
        galeri,
        projeler,
        duyurular
    });
});

// Ana sayfa metni ekle
app.post("/api/anasayfa", async (req, res) => {
    const { text } = req.body;
    await AnaSayfa.create({ text });
    res.send("Ana sayfa içeriği kaydedildi.");
});

// Galeri işlemleri
app.post("/api/galeri", async (req, res) => {
    const { url, aciklama } = req.body;
    const item = await Galeri.create({ url, aciklama });
    res.json(item);
});

app.delete("/api/galeri/:id", async (req, res) => {
    await Galeri.findByIdAndDelete(req.params.id);
    res.send("Galeri öğesi silindi.");
});

// Proje işlemleri
app.post("/api/projeler", async (req, res) => {
    const proje = await Proje.create(req.body);
    res.json(proje);
});

app.delete("/api/projeler/:id", async (req, res) => {
    await Proje.findByIdAndDelete(req.params.id);
    res.send("Proje silindi.");
});

// Duyuru işlemleri
app.post("/api/duyurular", async (req, res) => {
    const duyuru = await Duyuru.create(req.body);
    res.json(duyuru);
});

app.delete("/api/duyurular/:id", async (req, res) => {
    await Duyuru.findByIdAndDelete(req.params.id);
    res.send("Duyuru silindi.");
});

// Sunucu başlat
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
