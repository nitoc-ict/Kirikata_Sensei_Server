import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "./schema/userModel.js";

// ユーザー作成 (POST)
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, permission } = req.body;
    if (!username || !password || !permission) {
      return res.status(400).json({ error: "usernameとpasswordは必須です" });
    }
    // パスワードのハッシュ化
    // ソルトは10ラウンドで生成
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { username, password: hashedPassword, permission };

    const user = new User(userData);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "不明なエラーが発生しました" });
    }
  }
};

// 全ユーザー取得
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "不明なエラーが発生しました" });
    }
  }
};

// 特定ユーザー取得
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "ユーザーが見つかりません" });
    }
    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "不明なエラーが発生しました" });
    }
  }
};

// ユーザー情報の更新
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { username, password, permission } = req.body;

    if (!username || !password || !permission) {
      return res
        .status(400)
        .json({ error: "必要なフィールドが不足しています" });
    }

    // パスワードのハッシュ化
    // ソルトは10ラウンドで生成
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, password: hashedPassword, permission },
      { new: true } // 更新後のドキュメントを返すオプション
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "ユーザーが見つかりません" });
    }

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "不明なエラーが発生しました" });
    }
  }
};

// ユーザーの削除
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "ユーザーが見つかりません" });
    }
    res.json({ message: "ユーザーが削除されました", user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "不明なエラーが発生しました" });
    }
  }
};
