import mongoose, { Int32, Schema, Types } from "mongoose";

interface Ibrevis extends Document {
  _id: Types.ObjectId;
  shortCode: string;
  originalUrl: string;
  clicks?: Int32;
}

const brevisSchema = new Schema<Ibrevis>(
  {
    shortCode: { type: String, trim: true },
    originalUrl: { type: String, trim: true },
    clicks: { type: mongoose.Schema.Types.Int32, default: 0 },
  },
  { timestamps: true }
);

const urlshortner = mongoose.model<Ibrevis>("Urlshortner", brevisSchema);
export default urlshortner;
