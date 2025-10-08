# ユーザー管理 API ドキュメント

## 概要

この API は、ユーザーの作成、取得、更新、削除（CRUD 操作）を行うためのエンドポイントを提供します。パスワードは bcrypt を使用してハッシュ化され、安全に保存されます。

## ベース URL

```
http://localhost:3000/api
```

---

## エンドポイント一覧

### 1. ユーザー作成

新しいユーザーを作成します。

**エンドポイント**

```
POST /api/users
```

**リクエストボディ**

```json
{
  "username": "string (必須)",
  "password": "string (必須)",
  "permission": "string (必須)"
}
```

**レスポンス**

- **成功 (201 Created)**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "testuser",
  "password": "$2b$10$...(ハッシュ化されたパスワード)",
  "permission": "admin",
  "createdAt": "2025-10-08T12:00:00.000Z",
  "updatedAt": "2025-10-08T12:00:00.000Z"
}
```

- **エラー (400 Bad Request)**

```json
{
  "error": "usernameとpasswordは必須です"
}
```

**注意事項**

- パスワードは 10 ラウンドのソルトでハッシュ化されます
- すべてのフィールドが必須です

---

### 2. 全ユーザー取得

登録されているすべてのユーザー情報を取得します。

**エンドポイント**

```
GET /api/users
```

**リクエストパラメータ**
なし

**レスポンス**

- **成功 (200 OK)**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "user1",
    "password": "$2b$10$...",
    "permission": "admin",
    "createdAt": "2025-10-08T12:00:00.000Z",
    "updatedAt": "2025-10-08T12:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "username": "user2",
    "password": "$2b$10$...",
    "permission": "user",
    "createdAt": "2025-10-08T12:30:00.000Z",
    "updatedAt": "2025-10-08T12:30:00.000Z"
  }
]
```

- **エラー (400 Bad Request)**

```json
{
  "error": "エラーメッセージ"
}
```

---

### 3. 特定ユーザー取得

指定された ID のユーザー情報を取得します。

**エンドポイント**

```
GET /api/users/:id
```

**パスパラメータ**

- `id` (必須): ユーザーの MongoDB オブジェクト ID

**リクエスト例**

```
GET /api/users/507f1f77bcf86cd799439011
```

**レスポンス**

- **成功 (200 OK)**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "testuser",
  "password": "$2b$10$...",
  "permission": "admin",
  "createdAt": "2025-10-08T12:00:00.000Z",
  "updatedAt": "2025-10-08T12:00:00.000Z"
}
```

- **エラー (404 Not Found)**

```json
{
  "error": "ユーザーが見つかりません"
}
```

- **エラー (400 Bad Request)**

```json
{
  "error": "エラーメッセージ"
}
```

---

### 4. ユーザー情報更新

指定された ID のユーザー情報を更新します。

**エンドポイント**

```
PUT /api/users/:id
```

**パスパラメータ**

- `id` (必須): ユーザーの MongoDB オブジェクト ID

**リクエストボディ**

```json
{
  "username": "string (必須)",
  "password": "string (必須)",
  "permission": "string (必須)"
}
```

**レスポンス**

- **成功 (200 OK)**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "updateduser",
  "password": "$2b$10$...(新しいハッシュ化されたパスワード)",
  "permission": "user",
  "createdAt": "2025-10-08T12:00:00.000Z",
  "updatedAt": "2025-10-08T13:00:00.000Z"
}
```

- **エラー (404 Not Found)**

```json
{
  "error": "ユーザーが見つかりません"
}
```

- **エラー (400 Bad Request)**

```json
{
  "error": "必要なフィールドが不足しています"
}
```

**注意事項**

- すべてのフィールドが必須です（部分更新はサポートされていません）
- パスワードは更新時に再度ハッシュ化されます

---

### 5. ユーザー削除

指定された ID のユーザーを削除します。

**エンドポイント**

```
DELETE /api/users/:id
```

**パスパラメータ**

- `id` (必須): ユーザーの MongoDB オブジェクト ID

**リクエスト例**

```
DELETE /api/users/507f1f77bcf86cd799439011
```

**レスポンス**

- **成功 (200 OK)**

```json
{
  "message": "ユーザーが削除されました",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "password": "$2b$10$...",
    "permission": "admin",
    "createdAt": "2025-10-08T12:00:00.000Z",
    "updatedAt": "2025-10-08T12:00:00.000Z"
  }
}
```

- **エラー (404 Not Found)**

```json
{
  "error": "ユーザーが見つかりません"
}
```

- **エラー (400 Bad Request)**

```json
{
  "error": "エラーメッセージ"
}
```

---

## セキュリティ

### パスワードのハッシュ化

- すべてのパスワードは bcrypt を使用してハッシュ化されます
- ソルトラウンド数: 10
- ハッシュ化されたパスワードのみがデータベースに保存されます

### 推奨事項

- 本番環境では、すべてのエンドポイントに認証ミドルウェアを追加することを強く推奨します
- HTTPS 通信を使用してください
- 適切なレート制限を実装してください

---

## エラーハンドリング

すべてのエンドポイントで共通のエラーレスポンス形式を使用します。

**エラーレスポンス形式**

```json
{
  "error": "エラーメッセージの説明"
}
```

**主な HTTP ステータスコード**

- `200 OK`: リクエスト成功
- `201 Created`: リソース作成成功
- `400 Bad Request`: リクエストが不正、または必須フィールドの不足
- `404 Not Found`: 指定されたリソースが見つからない
- `500 Internal Server Error`: サーバー内部エラー

---

## 使用例

### curl を使用した例

**ユーザー作成**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "securepassword123",
    "permission": "user"
  }'
```

**全ユーザー取得**

```bash
curl -X GET http://localhost:3000/api/users
```

**特定ユーザー取得**

```bash
curl -X GET http://localhost:3000/api/users/507f1f77bcf86cd799439011
```

**ユーザー更新**

```bash
curl -X PUT http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updateduser",
    "password": "newpassword456",
    "permission": "admin"
  }'
```

**ユーザー削除**

```bash
curl -X DELETE http://localhost:3000/api/users/507f1f77bcf86cd799439011
```

---

## データモデル

### User オブジェクト

| フィールド | 型       | 説明                               |
| ---------- | -------- | ---------------------------------- |
| \_id       | ObjectId | MongoDB が自動生成する一意の ID    |
| username   | String   | ユーザー名（必須）                 |
| password   | String   | ハッシュ化されたパスワード（必須） |
| permission | String   | ユーザーの権限レベル（必須）       |
| createdAt  | Date     | 作成日時（自動生成）               |
| updatedAt  | Date     | 更新日時（自動更新）               |
