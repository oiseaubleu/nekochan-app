///////////////////////////////////////////////////////////////////////////////////////////////
// APIサーバ側の処理
///////////////////////////////////////////////////////////////////////////////////////////////

//なぜwithSessionなのか？ ⇒req.session.なんとか を使う環境設定として必要だから。
import withSession from "../../lib/session"

/**
 * 【withSession】セッションがあるかどうかをcookieみてチェックしてセッションがあるときは、セッションの中のユーザ情報をブラウザに返す
 * ironsessionを使うために、withSessonに引数として、実行したい関数を入れている
 * どこから呼ばれているか:lib/useUser
 * 出力：ブラウザから受け取ったセッション情報に"user"キーで紐づく情報がある場合はisLoggedIn:true, userの情報
 * 　　　ない（null）場合は、isLoggedIn:falseだけを返す
 * userの中身:pages/api/users/signInやaddAccountで設定したuserIdが入っている
 */
export default withSession(async (req, res) => {
  const user = req.session.get("user")

  if (user) {
    res.json({
      isLoggedIn: true,
      ...user,
    })
  } else {
    res.json({
      isLoggedIn: false,
    })
  }
})
