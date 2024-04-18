import { Request, Response } from "express";
import AuthService from "../1-service/AuthService";
import AuthMidleware from "../middleware/AuthMidleware";

export default new (class AuthController {
  register(req: Request, res: Response) {
    AuthService.register(req, res);
  }
  login(req: Request, res: Response) {
    AuthService.login(req, res);
  }

  logout(req: Request, res: Response) {
    AuthMidleware.logout(req, res);
  }
})();
