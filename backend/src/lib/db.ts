import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
	throw new Error("MONGODB_URI is not set");
}

let isConnected = false;

export const connectToDatabase = async (): Promise<void> => {
	if (isConnected) {
		return;
	}

	await mongoose.connect(mongoUri);
	isConnected = true;
};
