import { Request, Response } from "express";
import UserService from "../1-service/UserService";

export default new (class UserController {
  findAll(req: Request, res: Response) {
    UserService.findAll(req, res);
  }

  findById(req: Request, res: Response) {
    UserService.findById(req, res);
  }

  delete(req: Request, res: Response) {
    UserService.delete(req, res);
  }
})();
