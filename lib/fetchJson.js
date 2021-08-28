///////////////////////////////////////////////
//ブラウザ側の処理。（top.jsのとこで書いてるのと一緒）
//////////////////////////////////////////////
/**
 * 【fetcher】ブラウザ側がuseSWRを使って、APIサーバーからデータをとるときに（useUserみたいに今ログイン中のユーザの情報をとるとか）使う関数。useSWRを使うための部品。 default function
 * @module
 * @param {array} args
 * @returns {object} 呼んだAPIから返ってきた結果
 * @throws response.okではなかったとき API側からエラーが返ってきたときとか、ネットにつながらなかったときとか
 */
export default async function fetcher(...args) {

  try {
    const response = await fetch(...args)
    const data = await response.json()
    if (response.ok) {
      return data
    }
    const error = new Error(response.statusText) 
    error.response = response
    error.data = data
    throw error //response.okではなかったとき API側からエラーが返ってきたとき
  } catch (error) {
    if (!error.data) {
 
      error.data = { message: error.message }
    }
    throw error //ネットにつながらなかったときとか
  }
}
