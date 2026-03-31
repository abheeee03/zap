import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { authMiddleware } from "../middleware/auth";
import { User } from "../models/User";
import { Link } from "../models/Link";

export const userRouter = Router()

const JWT_SECRET = process.env.JWT_SECRET || "";

userRouter.post('/signup', async (req, res) => {
	try {
		const { email, password } = req.body as { email?: string; password?: string };

		if (!email || !password) {
			res.status(400).json({ message: "email and password are required" });
			return;
		}

		const normalizedEmail = email.trim().toLowerCase();

		const existingUser = await User.findOne({ email: normalizedEmail });
		if (existingUser) {
			res.status(409).json({ message: "User already exists" });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			email: normalizedEmail,
			password: hashedPassword,
		});

		const token = jwt.sign(
			{ userId: user._id.toString() },
			JWT_SECRET,
			{ expiresIn: "7d" }
		);

		res.status(201).json({
			message: "User created",
			token,
			user: { id: user._id.toString(), email: user.email },
		});
	} catch {
		res.status(500).json({ message: "Failed to signup" });
	}
})

userRouter.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body as { email?: string; password?: string };

		if (!email || !password) {
			res.status(400).json({ message: "email and password are required" });
			return;
		}

		const normalizedEmail = email.trim().toLowerCase();

		const user = await User.findOne({ email: normalizedEmail });
		if (!user) {
			res.status(401).json({ message: "Invalid credentials" });
			return;
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			res.status(401).json({ message: "Invalid credentials" });
			return;
		}

		const token = jwt.sign(
			{ userId: user._id.toString() },
			JWT_SECRET,
			{ expiresIn: "7d" }
		);

		res.json({
			message: "Login successful",
			token,
			user: { id: user._id.toString(), email: user.email },
		});
	} catch {
		res.status(500).json({ message: "Failed to login" });
	}
})

userRouter.get('/', authMiddleware, async (req, res) => {
	try {
		const userId = req.userId;
		if (!userId) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		if (!Types.ObjectId.isValid(userId)) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const user = await User.findById(userId);

		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		const links = await Link.find({ userId }).sort({ createdAt: -1 });

		res.json({
			id: user._id.toString(),
			email: user.email,
			link: links.map((link) => ({
				id: link._id.toString(),
				title: link.title,
				slug: link.slug,
				url: link.url,
				clicks: link.clicks,
			})),
		});
	} catch {
		res.status(500).json({ message: "Failed to fetch user" });
	}
})