import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { update } from "../utils/AuthUtils";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../config";
import * as bcrypt from "bcrypt";
import * as fs from "fs";
import { skip } from "node:test";

const prisma = new PrismaClient();

function isValidUUID(uuid: string): boolean {
  const UUIDregex = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
  return UUIDregex.test(uuid);
}

export default new (class UserService {
  private readonly UserRepository = prisma.users;
  private readonly ThreadRepository = prisma.thread;
  private readonly LikeRepository = prisma.like;
  private readonly ReplyRepository = prisma.reply;
  private readonly UserFollowingRepository = prisma.userfollowing;

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.params.page) || 1;
      // Memberikan batasan item halaman
      const pageSize = 10;

      //menghitung page
      const skip = (page - 1) * pageSize;

      const users = await this.UserRepository.findMany({
        skip,
        take: pageSize,
      });

      //Menghitung total user yang ada di database
      const totalUsers = await this.UserRepository.count();

      const totalPages = Math.ceil(totalUsers / pageSize);

      if (page > totalPages) return res.status(404).json({ error: "Page not found!" });
      // Ketika user melakukan input page melebihi kapasitas yang tersedia
      // sistem akan mengeluarkan error bahwa halaman tidak ada

      const userss = {
        users,
        pagination: {
          totalUsers,
          totalPages,
          currentPage: page,
          pageSize,
        },
      };

      return res.status(200).json(userss);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.userId;

      if (!isValidUUID(userId)) {
        return res.status(400).json({ error: "invalid UUID" });
      }

      const users = await this.UserRepository.findUnique({
        where: {
          id: userId,
        },
        include: {
          threads: true,
          likes: true,
          replies: true,
          follower: true,
          followwing: true,
        },
      });

      if (!users) return res.status(404).json({ error: "User Not found" });

      return res.status(200).json({ users });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async findByName(req: Request, res: Response): Promise<Response> {
    try {
      const name = req.params.name;

      const user = await this.UserRepository.findMany({
        where: {
          fullname: name,
        },
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      return res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async updateWithoutImage(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.userId;

      if (!isValidUUID(userId)) {
        return res.status(400).json({ error: "invalid UUID" });
      }

      const session = res.locals.loginSession.User.id;

      if (userId !== session) return res.status(403).json({ error: "Unauthorization: you're not user login" });

      const user = await this.UserRepository.findUnique({
        where: { id: userId },
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      const body = req.body;
      const { error } = update.validate(body);
      if (error) return res.status(400).json(error.message);

      let hashPassword = user.password;
      let fullname = user.fullname;
      let bio = user.bio;
      let username = user.username;

      const id = uuidv4();
      const usernameUUIDpart = id.substring(0, 8).replace(/-/g, "");
      //   const uconvert = `user_${usernameUUIDpart}_${body.fullname.replace(/\s/g, "_")}`;

      if (body.password !== undefined && body.password !== "") {
        hashPassword = await bcrypt.hash(body.password, 10);
      }

      if (body.fullname !== undefined && body.fullname !== "") {
        fullname = body.fullname;
        username = `user_${usernameUUIDpart}_${body.fullname.replace(/\s/g, "_")}`;
      }

      if (body.bio !== undefined && body.bio !== "") {
        bio = body.bio;
      }

      const updateUser = await this.UserRepository.update({
        where: { id: userId },
        data: {
          fullname: fullname,
          username: username,
          password: hashPassword,
          bio: bio,
        },
      });

      return res.status(200).json(updateUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async uploadProfilePicture(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.userId;

      if (!isValidUUID(userId)) {
        return res.status(400).json({ error: "invalid UUID" });
      }

      const session = res.locals.loginSession.User.id;

      if (userId !== session) return res.status(403).json({ error: "Unauthorization: you're not user login" });

      const image = req.file;
      if (!image) return res.status(400).json({ error: "No image provided" });

      const oldUserData = await this.UserRepository.findUnique({
        where: { id: userId },
        select: {
          photo_profile: true,
        },
      });

      const cloudinaryUpload = await cloudinary.uploader.upload(image.path, {
        folder: "Circle53",
      });

      const profile_pictureURL = cloudinaryUpload.secure_url;

      fs.unlinkSync(image.path);

      if (oldUserData && oldUserData.photo_profile) {
        const publicId = oldUserData.photo_profile.split("/").pop()?.split(".")[0];
        await cloudinary.uploader.destroy(publicId as string);
      }

      const updateUser = await this.UserRepository.update({
        where: { id: userId },
        data: {
          photo_profile: profile_pictureURL,
        },
      });

      return res.status(200).json(updateUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async getSugestedUser(req: Request, res: Response): Promise<Response> {
    try {
      const limit = parseInt(req.query.limit as string) || 5;

      const users = await this.UserRepository.findMany({
        take: limit,
        skip: Math.floor(Math.random() * 5),
        select: {
          id: true,
          username: true,
          fullname: true,
          photo_profile: true,
          followwing: true,
        },
      });

      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.userId;

      if (!isValidUUID(userId)) {
        return res.status(400).json({ error: "Invalid UUID" });
      }

      const session = res.locals.loginSession.User.id;

      if (userId !== session) return res.status(403).json({ error: "Unauthorization : You're not user Login " });

      const userDelete = await this.UserRepository.findUnique({
        where: { id: userId },
        include: {
          threads: true,
          likes: true,
          replies: true,
        },
      });

      console.log(userDelete);

      if (!userDelete) return res.status(400).json({ error: "User not found" });

      // Menghapus user untuk sesama user yang salaing folow
      await this.UserFollowingRepository.deleteMany({
        where: {
          OR: [{ followerId: userId }, { followingId: userId }],
        },
      });

      await Promise.all([this.ThreadRepository.deleteMany({ where: { user_id: userId } }), this.LikeRepository.deleteMany({ where: { user_id: userId } }), this.ReplyRepository.deleteMany({ where: { user_id: userId } })]);

      const deleteUser = await this.UserRepository.delete({
        where: { id: userId },
      });

      return res.status(200).json(deleteUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
})();
