const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  { lat: Number, lng: Number, address: String },
  { _id: false }
);

const requestSchema = new mongoose.Schema(
  {
    type:            { type: String, enum: ['ride', 'errand'], required: true },
    status:          { type: String, enum: ['pending', 'assigned', 'completed', 'unmatched'], default: 'pending' },
    passengerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // ride fields
    pickupLocation:  { type: locationSchema, default: null },
    destination:     { type: locationSchema, default: null },
    // errand fields
    shopName:        { type: String, default: null },
    itemList:        { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
