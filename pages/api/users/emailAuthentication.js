/**
 * 【メール認証のAPI】components/PasswordResetで使う
 */
//
import sendAuthenticationEmail from "../../../lib/email"
import withSession from "../../../lib/session"

import { putRandomStringToDynamoDB } from "../../../lib/user"
export default withSession(async (req, res) => {
  ///////////ランダム文字列つくってる///////////
  let Puid = require("puid")
  let puid = new Puid()
  ///////////ランダム文字列と、ユーザIDと、有効期限を登録してる///////////
  //登録する日時から３日後にデータを消してほしい
  let now = Date.now()
  const validUntil = Math.floor((now + 3 * 24 * 60 * 60 * 1000) / 1000)
  //const validUntil = Math.floor((now + 30 * 1000) / 1000)
  //idをセッション情報からもらってくる
  const { userId } = req.session.get("user") //iron-sessionからいただいております
  //登録してる
  const randomString = puid.generate()
  putRandomStringToDynamoDB(randomString, userId, validUntil)
    .then((data) => {
      //ここのdataはDynamoDBに登録した結果が入る
      //登録が成功したあと、メール送る（登録に成功しないとメールは送られない）
      return sendAuthenticationEmail(userId, randomString)
    })
    .then((data) => {
      //ここのdataはsendAuthenticationEmailで送信の結果（promise）が入る
      res.end(JSON.stringify({ result: "SUCCESS", data }))
    })
    .catch((err) => {
      console.log(err)
      //保存に失敗したか、送信されないときのどっちかにここにエラーが入る
      //500はNEXTのemailAuthenticationがこけましたって意味。こっちで勝手につくったAPIがこけたときとかに使う。
      res.status(500).json(err)
    })
})

/**
 * なんでwithSessionをexportしないといけないのかの話。
 * withSessionという関数（の中でやってるイメージは↓参照）に、引数として自分が書いた関数を入れることでreq.sessionを使えるような状態の関数を返してくれてます
 *
 * @param {function} asyncFunction 実際にリクエストを処理する関数
 * @returns function 上のasyncFunction内でreq.sessionが使えるようになった関数
 */
// function withSessionNoImage(asyncFunction) {
//   return (req, res) => {
//     const session = createSession()
//     const req = getRequest()
//     req.session = session
//     const res = getResponse()
//     return asyncFunction(req, res)
//   }
// }
