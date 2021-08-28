///////////////////////////////////////////////////////////////////////////////////////////////
// サーバ側の処理
///////////////////////////////////////////////////////////////////////////////////////////////
/**
 * user.jsが、DynamoDBに格納した、ユーザ情報を取ってきたり作ったりするためのもの。
 * AWSのライブラリを使う。
 */
/**
 * @module
 */
import AWS from "aws-sdk"

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_MYAPP,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_MYAPP,
  },
  region: process.env.AWS_REGION_MYAPP,
})

// DynamoDBからデータを取ってくるためのオブジェクト
const docClient = new AWS.DynamoDB.DocumentClient()

/**
 * 【getUserFromDynamoDB】DynamoDBからユーザ情報を取ってくる処理
 * @param {string} userId ユーザID
 * @returns {promise}
 */
export function getUserFromDynamoDB(userId) {
  const param = {
    TableName: "User",
    Key: { userId },
  }
  const tottekuru = docClient.get(param).promise()

  return tottekuru
}

/**
 * 【putUserToDynamoDB】DynamoDBにユーザ情報を追加する処理(ユーザ新規追加)
 * @param {string} userId ユーザID
 * @param {string} password パスワード
 * @returns {promise}
 */

export function putUserToDynamoDB(userId, password) {
  const param = {
    TableName: "User",
    Item: {
      userId,

      password,
    },
  }
  return docClient.put(param).promise()
}

/**
 * 【putRandomStringToDynamoDB】DynamoDBにユーザ情報を追加する処理(パスワード変更のためのランダムな文字列を登録)
 * @param {string} userId ユーザID
 * @param {string} randomString ランダム文字列
 * @param {number} validUntil 何日後に登録したカラムが消えてほしいか、秒で表している
 * @returns {Promise}
 */

export function putRandomStringToDynamoDB(randomString, userId, validUntil) {
  const param = {
    TableName: "PasswordResetString",
    Item: {
      randomString,
      userId,
      validUntil,
    },
  }
  return docClient.put(param).promise()
}

/**
 * 【getUserIdUseRandomStringFromDynamoDB】DynamoDBからユーザ情報を取ってくる処理（ランダム文字列がプライマリーキーになってるuserId）
 * @param {string} randomString ランダム文字列
 * @returns {Promise}
 */
export function getUserIdUseRandomStringFromDynamoDB(randomString) {
  const param = {
    TableName: "PasswordResetString",
    Key: { randomString },
  }
  const tottekuru = docClient.get(param).promise()

  return tottekuru
}

/**
 * 【updateUserPasswordOfDynamoDb】DynamoDBのUserテーブルを更新する処理
 * @param {string} userId ユーザID
 * @param {string} newPassword 更新する新しいパスワード
 * @returns {Promise}
 */

export function updateUserPasswordOfDynamoDb(userId, newPassword) {
  const param = {
    TableName: "User",
    Key: { userId },
    ExpressionAttributeValues: {
      ":new": newPassword,
    },
    UpdateExpression: "set password=:new",
  }
  return docClient.update(param).promise()
}
