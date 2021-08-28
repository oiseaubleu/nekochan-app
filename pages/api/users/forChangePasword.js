/**
 * 【パスワード更新のAPI】
 * フォームから入れた前のパスワードと、今テーブルに登録されている、これから更新するパスワードがそもそも同じかどうかの確認
 * すでに登録されているパスワードと、入力した昔のパスワードが同じなら、新しいパスワードの更新をする
 * すでに登録されているパスワードと、入力した昔のパスワードが違ったらエラーを返す
 * 【何を受け取るのか】
 * 下記のオブジェクト
  {
      exPassword: passwordInfo.exPassword,
      newPassword: passwordInfo.newPassword,
      userId: userId,
    }
 * 【何が返されるのか】
 * 無事にパスワードの更新ができたとき⇒result: "SUCCESS", data
 * どこかでエラー⇒400　 errorCode: "E006"とか諸々
 * 【どこから呼ばれるAPIか】components/ChangePassword
 */

import {
  getUserFromDynamoDB,
  updateUserPasswordOfDynamoDb,
} from "../../../lib/user"

export default async function forChangePasword(req, res) {
  const bcrypt = require("bcrypt")
  const { body } = req
  const exPassword = body.exPassword
  const newPassword = body.newPassword
  const userId = body.userId

  //exPassword(フォームから入れた前のパスワード)と、今テーブルに登録されている、これから更新するパスワードがそもそも同じかどうかの確認
  ///今テーブルに登録されているパスワードをもってくる
  let data = await getUserFromDynamoDB(userId)
  let nowPass = data.Item.password
  //let result = "FALSE"//確認用

  ///exPasswordのハッシュ化と比較
  bcrypt.compare(exPassword, nowPass, (error, isEqual) => {
    //すでに登録されているパスワードと、入力した昔のパスワードが同じなら、新しいパスワードの更新をする
    if (isEqual) {
      bcrypt.hash(newPassword, 10, (error, hash) => {
        updateUserPasswordOfDynamoDb(userId, hash).then((data) => {
          res.end(JSON.stringify({ result: "SUCCESS", data })) //このdataっていらなくない？？⇒使わないから要らないけど一応。
        })
      })
      //res.end(JSON.stringify({ exPassword, newPassword, userId, nowPass }))//値の確認用
    } else {
      //すでに登録されているパスワードと、入力した昔のパスワードが違ったらエラーを返す
      res.status(400).json({
        result: "FAILURE",
        errorCode: "E006",
        errorMessage: "The previous password is invalid.",
      })
      // res.end(JSON.stringify({ result }))//値の確認用
    }
  })
  // bcrypt.hash(exPassword, 10, (error, hash) => {
  //   let result = nowPass === hash
  //   res.end(
  //     JSON.stringify({ exPassword, newPassword, userId, hash, nowPass, result })
  //   )
  //   // res.end(JSON.stringify({ nowPass, hash }))
  // })
}
