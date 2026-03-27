import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

export const userRouter = Router()

userRouter.post('/signup', async (req, res) => {
	try {
		const { email, password } = req.body as { email?: string; password?: string };

		if (!email || !password) {
			res.status(400).json({ message: "email and password are required" });
			return;
		}

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			res.status(409).json({ message: "User already exists" });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		const token = jwt.sign(
			{ userId: user.id },
			process.env.JWT_SECRET || "dev_secret_change_me",
			{ expiresIn: "7d" }
		);

		res.status(201).json({
			message: "User created",
			token,
			user: { id: user.id, email: user.email },
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

		const user = await prisma.user.findUnique({ where: { email } });
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
			{ userId: user.id },
			process.env.JWT_SECRET || "dev_secret_change_me",
			{ expiresIn: "7d" }
		);

		res.json({
			message: "Login successful",
			token,
			user: { id: user.id, email: user.email },
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

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				links: {
					select: {
						id: true,
						originalUrl: true,
						shortCode: true,
						createdAt: true,
						updatedAt: true,
					},
					orderBy: { createdAt: "desc" },
				},
			},
		});

		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		res.json(user);
	} catch {
		res.status(500).json({ message: "Failed to fetch user" });
	}
})