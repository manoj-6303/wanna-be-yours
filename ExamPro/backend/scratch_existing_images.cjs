const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const FRONTEND_IMAGES_DIR = path.join(__dirname, '../frontend/public/images');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
    const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
    const allQs = await Question.find({ questionImage: { $exists: true, $ne: null, $ne: '' } });
    let existing = [];
    for (let q of allQs) {
        if (!q.questionImage) continue;
        const imgPath = path.join(FRONTEND_IMAGES_DIR, q.questionImage);
        if (fs.existsSync(imgPath)) {
            existing.push({ id: q._id, image: q.questionImage, chapter: q.chapter });
        }
    }
    console.log(`Found ${existing.length} existing images.`);
    if (existing.length > 0) {
        // Outputting some examples
        console.log(existing.slice(0, 10));
    }
    process.exit(0);
});
