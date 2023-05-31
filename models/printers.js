var mongoose = require('mongoose');

var printerSchema = new mongoose.Schema({
    name: { type: String, required: true},
    status: String,
    downCount: { type: Number, default: 0 },

});

var printer = mongoose.model('printer', printerSchema)

module.exports = printer;