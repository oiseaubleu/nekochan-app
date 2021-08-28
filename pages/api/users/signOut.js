//expressと一緒。リクエスト（DELETEとか）を受け取ったら、何をして、ブラウザとかReactに何を返すのか決めてるとこ
//今回はnext.jsを使ってる
/**
 * 【ログアウト処理のAPI】
セッション情報を破棄して、isLoggedInをfalseにする
 * 【何を受け取るのか】とくになにも
 * 【何が返されるのか】 { isLoggedIn: false }
 * 【どこから呼ばれるAPIか】components/mypage
 */
import withSession from "../../../lib/session"
export default withSession(async (req, res) => {
  req.session.destroy()
  res.json({ isLoggedIn: false }) // 多分使ってないが残しとく
})

//DynamoDBでユーザセッション情報を持っていたときのやり方↓
// import { updateUserOfDynamoDb } from "../../../lib/user"
// export default function signOut(req, res) {
//   const { body } = req

//   return updateUserOfDynamoDb(body.userId, false).then((data) => {
//     res.end(JSON.stringify(data))
//   })
// }
