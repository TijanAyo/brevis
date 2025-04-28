import mongoose, { Int32, Schema, Types } from "mongoose";

interface IUrl extends Document {
  _id: Types.ObjectId;
  shortCode: string;
  originalUrl: string;
  clicks?: Int32;
}

const urlSchema = new Schema<IUrl>(
  {
    shortCode: { type: String, trim: true, unique: true },
    originalUrl: { type: String, trim: true },
    clicks: { type: mongoose.Schema.Types.Int32, default: 0 },
  },
  { timestamps: true }
);

const Url = mongoose.model<IUrl>("Url", urlSchema);
export default Url;
