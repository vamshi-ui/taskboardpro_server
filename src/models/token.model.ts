import mongoose, { Schema, Model, Document } from "mongoose";

interface IToken extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const TokenSchema: Schema = new Schema<IToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  token: {
    type: String,
    required: true 
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


export const Token: Model<IToken> = mongoose.model<IToken>(
  "Token",
  TokenSchema
);
