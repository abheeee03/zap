import crypto from 'crypto';
import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

export const linkRouter = Router()

const isValidUrl = (value: string): boolean => {
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
};

const getRandomCode = () => {
  var random = Math.floor(Math.random() * 999999) + '';
  var md5crypto = crypto.createHash('md5').update(random).digest("hex");
  //generates 5 letter / digit code
  var short_code = md5crypto.substring(0, 5);
  return short_code;
}

linkRouter.get('/', authMiddleware, async (req, res) => {
	try {
		const userId = req.userId;
		if (!userId) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const links = await prisma.links.findMany({
			where: { userID: userId },
			orderBy: { id: "desc" },
		});

		res.json({ links });
	} catch {
		res.status(500).json({ message: "Failed to fetch links" });
	}
})

linkRouter.post('/create', authMiddleware, async (req, res) => {
	try {
		const userId = req.userId;
		if (!userId) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const { title, url, slug } = req.body as { title?: string; url?: string, slug?: string };

		if (!title || !url) {
			res.status(400).json({ message: "title and url are required" });
			return;
		}

		if (!isValidUrl(url)) {
			res.status(400).json({ message: "Invalid url" });
			return;
		}
		let random_slug;
		if(!slug) {
			random_slug = getRandomCode();
		}

		const link = await prisma.links.create({
			data: {
				title: title.trim(),
				slug: slug ? slug : random_slug,
				url: url.trim(),
				userID: userId,
			},
		});

		res.status(201).json({ message: "Link created", link });
	} catch {
		res.status(500).json({ message: "Failed to create link" });
	}
})

linkRouter.post('/update', authMiddleware, async (req, res) => {
	try {
		const userId = req.userId;
		if (!userId) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const { id, title, url } = req.body as { id?: string; title?: string; url?: string };

		if (!id) {
			res.status(400).json({ message: "id is required" });
			return;
		}

		const data: { title?: string; url?: string } = {};
		if (typeof title === "string" && title.trim()) {
			data.title = title.trim();
		}
		if (typeof url === "string" && url.trim()) {
			if (!isValidUrl(url)) {
				res.status(400).json({ message: "Invalid url" });
				return;
			}
			data.url = url.trim();
		}

		if (!data.title && !data.url) {
			res.status(400).json({ message: "Nothing to update" });
			return;
		}

		const updated = await prisma.links.updateMany({
			where: { id, userID: userId },
			data,
		});

		if (updated.count === 0) {
			res.status(404).json({ message: "Link not found" });
			return;
		}

		const link = await prisma.links.findUnique({ where: { id } });
		res.json({ message: "Link updated", link });
	} catch {
		res.status(500).json({ message: "Failed to update link" });
	}
})

linkRouter.delete('/', authMiddleware, async (req, res) => {
	try {
		const userId = req.userId;
		if (!userId) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const id = (req.body as { id?: string })?.id || (req.query.id as string | undefined);
		if (!id) {
			res.status(400).json({ message: "id is required" });
			return;
		}

		const deleted = await prisma.links.deleteMany({
			where: { id, userID: userId },
		});

		if (deleted.count === 0) {
			res.status(404).json({ message: "Link not found" });
			return;
		}

		res.json({ message: "Link deleted" });
	} catch {
		res.status(500).json({ message: "Failed to delete link" });
	}
})