import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./schema/userModel.js";

// 秘密鍵は環境変数から取得
// 複雑な値にすること
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// ユーザー認証 (POST)
export const authenticateUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      console.log("error");
      return res.status(401).json({
        error: "ユーザーが見つかりません",
        status: 401,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: "パスワードが間違っています",
        status: 401,
      });
    }

    // jwt発行(ユーザー情報の一部だけをペイロードとして含める)
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      // セッションの有効期限を1時間に設定
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "認証に成功しました",
      token,
      // userId: user._id,
      permission: user.permission,
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "不明なエラーが発生しました" });
    }
  }
};

/**
 * 特別な長寿命JWTを生成する関数
 * @param user - トークンのペイロードに含めるユーザー情報
 * @returns 生成されたJWT文字列
 */
export const generateSpecialToken = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      console.log("error");
      return res.status(401).json({
        error: "ユーザーが見つかりません",
        status: 401,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: "パスワードが間違っています",
        status: 401,
      });
    }

    // jwt発行(ユーザー情報の一部だけをペイロードとして含める)
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      // セッションの有効期限を1時間に設定
      { expiresIn: "1y" }
    );

    res.status(200).json({
      message: "認証に成功しました",
      token,
      // userId: user._id,
      permission: user.permission,
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "不明なエラーが発生しました" });
    }
  }
};
