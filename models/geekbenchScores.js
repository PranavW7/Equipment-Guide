const mongoose = require('mongoose')

const geekBenchScoreSchema = new mongoose.Schema({
    name:{
        type: String
    },
    score:{
        type: Number
    }
});



module.exports = mongoose.model('GeekBenchScore', geekBenchScoreSchema);