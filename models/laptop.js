const mongoose = require('mongoose')

const laptopSchema = new mongoose.Schema({
    'Name': {
        type: String,
        required: true
    },
    'Operating System': {
        type: String
    },
    'Screen Size':{},
    'Processor': {
        type: String,
    },
    'Processor Model': {
        type: String
    },
    'Processor Clock Speed': {
        type: String,
    },
    'Cache': {
        type: String,
    },
    'Graphics Processor':{},
    'RAM':{},
    'RAM Upgradable to':{},
    'RAM Type':{},
    'RAM Speed':{},
    'Memory Slots':{},
    'RAM Type':{},
    'Hard Drive Capacity':{},
    'Weight':{},
    'Dimensions (mm)':{},
    'Colour':{},
    'Warranty':{},
    'Sales Package':{},
    'USB 2.0':{},
    'Wi-Fi':{},
    'Bluetooth':{},
    'USB Type C':{},
    'Input':{},
    'Audio Technology':{},
    'Webcam':{},
    'Adapter':{},
    'Battery Cell':{},
    'Battery Type':{},
    'Keyboard':{},
    'Fingerprint Scanner':{}
})

module.exports = mongoose.model('Laptop', laptopSchema)