import { Schema, model, Types, type InferSchemaType } from "mongoose";

const linkSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
		url: { type: String, required: true, trim: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		clicks: { type: Number, required: true, default: 0, min: 0 },
	},
	{ timestamps: true }
);

linkSchema.index({ slug: 1 }, { unique: true });
linkSchema.index({ userId: 1, createdAt: -1 });

export type LinkDocument = InferSchemaType<typeof linkSchema> & {
	_id: Types.ObjectId;
};

export const Link = model("Link", linkSchema);
