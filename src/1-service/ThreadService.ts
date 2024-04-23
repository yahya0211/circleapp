import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { addThread } from "../utils/ThreadUtil";
import cloudinary from "../config";
import * as fs from "fs";

const prisma = new PrismaClient();

function isValidUUID(uuid: string): boolean {
  const UUIDregex = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
  return UUIDregex.test(uuid);
}

export default new (class ThreadService {
  private readonly ThreadRepository = prisma.thread;
  private readonly UserRepository = prisma.users;
  private readonly LikeRepository = prisma.like;

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      // mengambil halaman thread yang dibuka, ketika pertama kali dibuka
      const page = parseInt(req.params.page) || 1;
      // mengambil beberapa thread pada halaman
      // setiap page akan berisi 10 thread
      const pageSize = 10;

      // pengecekan pageSize

      const skip = (page - 1) * pageSize;

      const threads = await this.ThreadRepository.findMany({
        // 0
        skip,
        // 10
        take: pageSize,
        include: {
          user: true,
          like: true,
          replies: true,
        },
        // menampilkan thread dari created at yang baru dibuat
        orderBy: {
          created_at: "desc",
          //desc menampilkan data terbaru, yaitu data dari waktu terbaru
          // asc menampilkan waktu yang lama
        },
      });

      // mengambil jumlah dari keseluruhan thread, ketika thread ada 20, maka dihitung 20
      const totalThread = await this.ThreadRepository.count();

      // membagi keseluruhan thread dengan total thread
      const totalPages = Math.ceil(totalThread / pageSize);
      // melakukan pengecekan apakah dari paramater, user input page yang berlebih di database
      // karena hanya ada 2 page yang tersedia, maka user input page-nya 5, maka error
      // karena melebihi page yang tersedia
      if (page > totalPages) return res.status(404).json({ error: "Page not found" });

      const threadss = {
        data: threads,
        pagination: {
          totalThread,
          totalPages,
          currentPage: page,
          pageSize,
        },
      };

      return res.status(200).json({ threadss });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const threadId = req.params.threadId;

      if (!isValidUUID(threadId)) {
        return res.status(400).json({ error: "invalid UUID" });
      }

      const thread = await this.ThreadRepository.findUnique({
        where: { id: threadId },
        include: {
          like: true,
          user: true,
          replies: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!thread) return res.status(404).json({ error: "Thread not found" });

      return res.status(200).json(thread);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async addThread(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body;
      const { error } = addThread.validate(body);
      if (error) return res.status(400).json(error.message);

      const userId = res.locals.loginSession.User.id;

      const userSelect = await this.UserRepository.findUnique({
        where: { id: userId },
      });

      if (!userSelect) return res.status(404).json({ error: "User not found" });

      let image = req.file;
      let image_url = "";

      if (!image) {
        image_url = "";
      } else {
        const cloudinaryUpload = await cloudinary.uploader.upload(image.path, {
          folder: "Circle53",
        });
        image_url = cloudinaryUpload.secure_url;
        fs.unlinkSync(image.path);
      }

      const thread = await this.ThreadRepository.create({
        data: {
          content: body.content,
          image: image_url,
          created_at: new Date(),
          user: {
            connect: { id: userId },
          },
        },
      });

      return res.status(200).json({ thread });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async updateThread(req: Request, res: Response): Promise<Response> {
    try {
      const threadId = req.params.threadId;

      if (!isValidUUID(threadId)) {
        return res.status(400).json({ error: "invalid UUID" });
      }

      const userId = res.locals.loginSession.User.id;

      const userSelect = await this.UserRepository.findUnique({
        where: { id: userId },
      });

      if (!userSelect) return res.status(404).json({ error: "User not found" });

      const body = req.body;
      const { error } = addThread.validate(body);
      if (error) return res.status(400).json(error.message);

      let image = req.file;
      let image_url = "";

      const oldThreadData = await this.ThreadRepository.findUnique({
        where: { id: userId },
        select: {
          image: true,
        },
      });

      if (image) {
        const cloudinaryUpload = await cloudinary.uploader.upload(image.path, {
          folder: "Circle53",
        });
        image_url = cloudinaryUpload.secure_url;
        fs.unlinkSync(image.path);

        if (oldThreadData && oldThreadData) {
          const publicId = oldThreadData.image?.split("/").pop()?.split("_")[0];
          await cloudinary.uploader.destroy(publicId as string);
        }
      } else {
        image_url = oldThreadData?.image || "";
      }

      const threadUpdate = await this.ThreadRepository.update({
        where: { id: threadId },
        data: {
          content: body.content,
          image: image_url,
          created_at: new Date(),
          user: { connect: { id: userId } },
        },
      });

      return res.status(200).json({ threadUpdate });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async deleteThread(req: Request, res: Response): Promise<Response> {
    try {
      const threadId = req.params.threadId;

      if (!isValidUUID(threadId)) {
        return res.status(400).json({ error: "invalid UUID" });
      }

      const userId = res.locals.loginSession.User.id;

      const userSelect = await this.UserRepository.findUnique({
        where: { id: userId },
      });

      if (!userSelect) return res.status(404).json({ error: "User not found" });

      const oldThreadData = await this.ThreadRepository.findUnique({
        where: { id: userId },
        select: {
          image: true,
        },
      });

      if (oldThreadData && oldThreadData) {
        const publicId = oldThreadData.image?.split("/").pop()?.split("_")[0];
        await cloudinary.uploader.destroy(publicId as string);
      }

      const deleteThread = await this.ThreadRepository.delete({
        where: { id: threadId },
      });

      return res.status(200).json({ deleteThread: deleteThread, message: "Thread deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
})();
