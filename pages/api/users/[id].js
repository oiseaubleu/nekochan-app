//このファイルたぶん使ってない？

//expressと一緒。リクエスト（DELETEとか）を受け取ったら、何をして、ブラウザとかReactに何を返すのか決めてるとこ
//今回はnext.jsを使ってる
//https://nextjs-ja-translation-docs.vercel.app/docs/api-routes/introduction

import { getUserFromDynamoDB, putUserToDynamoDB } from "../../../lib/user"
//http://localhost:3000/api/users/s28@gmail.comみたいな感じでみる
// export default function getUserInfo(req, res) {
//   const {
//     query: { id },
//   } = req

//   getUserFromDynamoDB(id).then((data) => {
//     res.end(JSON.stringify(data))
//   })
// }

// express.jsだと・・・
// const app = express()
// app.get('/path', (req, res) => {
//   // なんかの処理
// })
// のように、GETのとき、POSTのときのような書き分けができた

// // Next.jsでは、↑のような書き方はまだサポートされていないので、自分でGETなのかPOSTなのかを判断する必要がある。
export default function handleUserInfo(req, res) {
  if (req.method === "PUT") {
    // PUTのリクエストを受け取った時の処理を記載する
    const {
      query: { id },
    } = req
    return putUserToDynamoDB(id).then((data) => {
      res.end(JSON.stringify(data))
    })
  } else if (req.method === "GET") {
    // GETのリクエストを受け取った時の処理を記載する
    const {
      query: { id },
    } = req

    return getUserFromDynamoDB(id).then((data) => {
      res.end(JSON.stringify(data))
    })
  }
}
