# backend

# ファイル名に＃がつくものは開発環境用

# API の使い方

```bash
# http API

# ユーザー作成
/api/users post
  req:
    username, # 重複不可
    password,
    permission, # 登録されたユーザーの権限(教師か生徒か) "admin" か "user"
  res:
    *success*
      username,
      password,
      permission, # 登録されたユーザーの権限(教師か生徒か)
      _id,
      createdAt,
      __v,

    *error*
      error, # エラーメッセージ

# 全ユーザー情報取得
/api/users get
  req:
    - # なし
  res:
    *success* # 配列
    {
      username,
      password,
      permission, # 登録されたユーザーの権限(教師か生徒か) "admin" か "user"
      _id,
      createdAt,
      __v,
    },
    {
      username,
      password,
      permission, # 登録されたユーザーの権限(教師か生徒か) "admin" か "user"
      _id,
      createdAt,
      __v,
    },

    *error*
      error, # エラーメッセージ

# ユーザー情報編集
/api/users/:id put
  # :idには、ユーザー情報の_idが入る
  req:
    username,
    password,
    permission, # ユーザーの権限(教師か生徒か) "admin" か "user"
  res:
    *succes*
      username,
      password,
      permission, # ユーザーの権限(教師か生徒か) "admin" か "user"
      _id,
      createdAt,
      __v,

    *error*
      error, # エラーメッセージ


# ユーザー削除
/api/users/:id delete
  # :idには、ユーザー情報の_idが入る
  req:
    - # なし
  res:
    *succes*
      message, # 成功メッセージ
      user, # 削除されたユーザーの情報

    *error*
      error, # エラーメッセージ

# ログイン機能
/api/auth post
  req:
    username,
    password,
  res:
    message,
    token, # ログインの時に必要なトークン
    permission, # ログインされたユーザーの権限(教師か生徒か) "admin" か "user"
    status, # 処理が成功しているかどうかのステータス 成功: 200 失敗: 400番台


# socket.io API

## 生徒側

### on イベント

connect
  # 接続時に発火
disconnect
  # 切断時に発火
reconnect
  # 再接続成功時に発火
connect_error
  # 接続失敗時に発火

message
  # ルーム指定の時
    type # room_not_found か room_full

  # 座席指定の時
    type # invalid_seat か seat_occupied

  # ユーザーがルーム内に参加してきた時
    type, # student_joined
    status, # joined
    usetId, # socket.ioのid
    role, # host か student (教師か生徒か)
    room, # ルーム名
    username, # 参加してきたユーザーのユーザー名
    seatIndex, # 指定した座席の番号

  # ユーザーが切断する時
    type, # student_left
    status, # left
    usetId, # socket.ioのid
    role, # host か student (教師か生徒か)
    room, # ルーム名
    username, # 参加してきたユーザーのユーザー名
    seatIndex, # 指定した座席の番号

  # ホストがルームを閉鎖した時
    message, # ホスト切断通知

roomInfo
  succece: boolen
  maxSeats: int
  occupiesdSeats: int[]
sessionStarted
sessionEnded
seatUpdate

### emit イベント

join
getRoomInfo
dangerAlert
studentProgress
sessionResponse

## 教師側

### on イベント

connect
  # 接続時に発火
connect_error
  # 接続失敗時に発火

message
receiveJson
studentProgress
sessionResponse
dangerAlert

### emit イベント

join
closeRoom
startSession
endSession
```
