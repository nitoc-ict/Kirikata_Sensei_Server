# 認証 API ドキュメント

## 概要

この API は、ユーザー認証と JWT（JSON Web Token）の発行を行います。認証に成功すると、1 時間有効なアクセストークンが発行されます。

## ベース URL

```
http://localhost:3000/api
```

---

## エンドポイント

### ユーザー認証

ユーザー名とパスワードを使用して認証を行い、JWT トークンを発行します。

**エンドポイント**

```
POST /api/auth
```

**リクエストボディ**

```json
{
  "username": "string (必須)",
  "password": "string (必須)"
}
```

**リクエスト例**

```json
{
  "username": "testuser",
  "password": "mypassword123"
}
```

---

## レスポンス

### 成功時 (200 OK)

認証に成功した場合、JWT トークンとユーザー情報が返されます。

```json
{
  "message": "認証に成功しました",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "permission": "admin",
  "status": 200
}
```

**レスポンスフィールド**

| フィールド | 型     | 説明                                 |
| ---------- | ------ | ------------------------------------ |
| message    | String | 成功メッセージ                       |
| token      | String | JWT 認証トークン（有効期限: 1 時間） |
| permission | String | ユーザーの権限レベル                 |
| status     | Number | HTTP ステータスコード                |

---

### エラーレスポンス

#### 1. ユーザーが見つからない (401 Unauthorized)

指定されたユーザー名がデータベースに存在しない場合。

```json
{
  "error": "ユーザーが見つかりません",
  "status": 401
}
```

#### 2. パスワードが間違っている (401 Unauthorized)

ユーザー名は正しいが、パスワードが一致しない場合。

```json
{
  "error": "パスワードが間違っています",
  "status": 401
}
```

#### 3. リクエストエラー (400 Bad Request)

リクエストボディが不正な場合や、その他のエラーが発生した場合。

```json
{
  "error": "エラーメッセージの詳細"
}
```

---

## JWT トークン

### トークンペイロード

発行される JWT トークンには以下の情報が含まれます:

```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "testuser",
  "iat": 1696777200,
  "exp": 1696780800
}
```

| フィールド | 説明                               |
| ---------- | ---------------------------------- |
| id         | ユーザーの MongoDB オブジェクト ID |
| username   | ユーザー名                         |
| iat        | トークン発行時刻（UNIX 時間）      |
| exp        | トークン有効期限（UNIX 時間）      |

### トークンの有効期限

- **有効期間**: 1 時間
- 有効期限が切れた場合は、再度認証が必要です

### トークンの使用方法

発行されたトークンは、認証が必要な API エンドポイントにアクセスする際に使用します。

## セキュリティ

### パスワード検証

- パスワードは bcrypt を使用して安全に比較されます
- データベースに保存されているハッシュ化されたパスワードと照合します
- 平文パスワードは保存されません

## 使用例

### curl を使用した例

**認証リクエスト**

```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "mypassword123"
  }'
```

**成功レスポンス**

```json
{
  "message": "認証に成功しました",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MzRhYmNkZWYxMjM0NTY3ODkwYWJjZCIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE2OTY3NzcyMDAsImV4cCI6MTY5Njc4MDgwMH0.signature",
  "permission": "admin",
  "status": 200
}
```

## エラーハンドリング

### HTTP ステータスコード

| コード | 説明                                                 |
| ------ | ---------------------------------------------------- |
| 200    | 認証成功                                             |
| 400    | リクエストが不正、または必須フィールドの不足         |
| 401    | 認証失敗（ユーザー名またはパスワードが間違っている） |

---

## フロー図

```
[クライアント]                    [サーバー]                    [データベース]
     |                                |                                |
     |--POST /api/auth-------------->|                                |
     |  { username, password }       |                                |
     |                               |                                |
     |                               |--ユーザー検索----------------->|
     |                               |<-ユーザー情報------------------|
     |                               |                                |
     |                               |--パスワード検証(bcrypt)        |
     |                               |                                |
     |                               |--JWT生成(SECRET_KEY)           |
     |                               |                                |
     |<-200 OK-----------------------|                                |
     |  { token, permission }        |                                |
     |                               |                                |
     |--認証付きリクエスト---------->|                                |
     |  socket.io auth  -> token  |                                |
     |                               |                                |
```
