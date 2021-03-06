/**
 * サーバー（NEXT）側
 * AmazonSESでメールを送るところ
 *
 */

import AWS from "aws-sdk"

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_MYAPP,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_MYAPP,
  },
  region: process.env.AWS_REGION_MYAPP,
})

//SDKを使うためのオブジェクト
const sesv2 = new AWS.SESV2()

/**
 * 【sendAuthenticationEmail】SESからメールを送るための設定 default function
 * @module
 * @param {string} userId
 * @param {string} puid ランダムな文字列
 * @returns {object} 無事にメールが送られたかどうかの結果
 */
export default function sendAuthenticationEmail(userId, puid) {
  const params = {
    //ContentにRawかSimpleかTemplateを選ぶ（とりあえず今Simpleを選んでみる）
    Content: {
      Simple: {
        Body: {
          Text: {
            Data: createMessage(puid),
            Charset: "UTF-8",
          },
        },
        Subject: {
          Data: "NEKOCHAN AUTHENTICATION",
        },
      },
    },
    //ドキュメントには書いてないけど、指定してしてあげないと送れなかったのでたぶん必須
    FromEmailAddress: "test.nekochanapp@gmail.com",
    Destination: {
      //アドレス入れる
      ToAddresses: [userId],
    },
  }

  //ただのfetchの代わり
  return sesv2.sendEmail(params).promise()
}

/**
 * 【createMessage】認証メールの本文を作成する。
 * @param {string} randomString URLに埋め込むランダムな文字列
 * @returns {string} メールの内容となる文字列
 */
function createMessage(randomString) {
  const hostname =
    process.env.NODE_ENV === "production"
      ? "https://" + process.env.VERCEL_URL
      : "http://localhost:3000"
  return `Please click following URL for authentication.

  ${hostname}/ChangePassword?auth=${randomString}`
}
