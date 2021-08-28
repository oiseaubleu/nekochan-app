//expressと一緒。リクエスト（DELETEとか）を受け取ったら、何をして、ブラウザとかReactに何を返すのか決めてるとこ
//今回はnext.jsを使ってる

import { putUserToDynamoDB, getUserFromDynamoDB } from "../../../lib/user"
import withSession from "../../../lib/session"
/**
 * 【アカウント追加API】SignUpコンポーネントで使う
 */
export async function addAccount(req, res) {
  const bcrypt = require("bcrypt")
  const { body } = req
  const password = body.password
  const email = body.userId
  //すでにアカウントがあるかどうかを判断するためのやつ
  let data = await getUserFromDynamoDB(email)
  //バリデーション。
  //半角の英数字であり、かつ、半角の@が1つ使用されていること(あてはまらないとnull)
  let regex = /\w+@\w+\.\w+/gi
  if (!regex.exec(email)) {
    res.status(400).json({
      //res.status(400)ってエラーだと思う
      result: "FAILURE",
      errorCode: "E003",
      errorMessage:
        "Your email address is wrong, please use half-width character.",
    })
  } else if (Object.keys(data).length) {
    res.status(400).json({
      result: "FAILURE",
      errorCode: "E005",
      errorMessage: "The email address already exists.",
    })
  } else {
    bcrypt.hash(password, 10, (error, hash) => {
      putUserToDynamoDB(body.userId, hash).then((data) => {
        res.end(JSON.stringify({ result: "SUCCESS", data }))
      })
    })
    req.session.set("user", {
      //↓のようにすることで、他のAPIからreq.session.get()でログインしてると{userId:なんとか}が取れる
      userId: email, //APIサーバがレスポンスを返すときに「このcookieを設定してね」ってブラウザに伝える中身
      isLoggedIn: true,
    })
    await req.session.save() //.thenのasyncの時の書き方
  }
}
export default withSession(addAccount)
