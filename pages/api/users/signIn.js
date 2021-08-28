//expressと一緒。リクエスト（DELETEとか）を受け取ったら、何をして、ブラウザとかReactに何を返すのか決めてるとこ
//今回はnext.jsを使ってる

/**
 * 【サインインのAPI】
 * 入力されたuserIDのユーザーがいない場合はエラーを返す
 * 入力されたuserIDのユーザーがいる場合はパスワードを比較する
 * パスワードが合致した場合はセッション情報を追加し、successを返す
 * パスワードが合致しなかった場合はエラーを返す

 * 【何を受け取るのか】
 * 下記のオブジェクト
{
      userId: signInInfo.email,

      password: signInInfo.password,
    }

 * 【何が返されるのか】
 * 入力されたuserIDのユーザーがいない場合⇒400{ errorCode: "E001", errorMessage: "No such user found." }
 * パスワードが間違えている場合⇒400{ errorCode: "E002", errorMessage: "Password is wrong." }
 * 無事にログインできた場合⇒200 { Message: "Success" }
 * 
 * 【どこから呼ばれるAPIか】components/SignIn
 * 
 *  memo
 * //APIからログイン情報をもらう必要がある⇒全部もらってきたらセキュリティ上よくなさそうなので、
  //必要な情報だけ取ってくる
  //この場合、userId（メールアドレス）を渡してそのパスワードを持ってくる必要がある
 */

import { getUserFromDynamoDB, updateUserOfDynamoDb } from "../../../lib/user"
import withSession from "../../../lib/session"
async function signIn(req, res) {
  const { body } = req
  const bcrypt = require("bcrypt")
  const password = body.password
  //①まずは、userIdがそもそもないときにありませんよって返すための処理
  //getUserFromDynamoDBを使ってみる
  let data = await getUserFromDynamoDB(body.userId)

  if (!Object.keys(data).length) {
    res
      .status(400)
      .json({ errorCode: "E001", errorMessage: "No such user found." })
  } else {
    //②userIdが存在していたら、すでに登録されているハッシュ化されたパスワードと、今入ったパスワードを比較する
    const hashedPassword = data.Item.password
   
    const result = await bcrypt.compare(password, hashedPassword)

    if (result) {
      req.session.set("user", {
        //↓のようにすることで、他のAPIからreq.session.get()でログインしてると{userId:なんとか}が取れる
        userId: body.userId, //APIサーバがレスポンスを返すときに「このcookieを設定してね」ってブラウザに伝える中身
        isLoggedIn: true,
      })
      await req.session.save() //.thenのasyncの時の書き方
      res.status(200).json({ Message: "Success" }) //ログインできたってこと
    } else {
      res
        .status(400)
        .json({ errorCode: "E002", errorMessage: "Password is wrong." })
    }
  }
}

export default withSession(signIn) //nextjsはdefaultってついてる関数の中身を実行する
