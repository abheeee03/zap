import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

type AuthPayload = {
	userId?: string;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	const token = authHeader.slice(7);

	try {
		const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
		if (!payload.userId) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		req.userId = payload.userId;
		next();
	} catch {
		res.status(401).json({ message: "Invalid or expired token" });
	}
};
