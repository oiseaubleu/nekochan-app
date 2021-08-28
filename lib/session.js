///////////////////////////////////////////////////////////////////////////////////////////////
// サーバ側の処理
///////////////////////////////////////////////////////////////////////////////////////////////
import { withIronSession } from "next-iron-session"
/**
 * 【withSession】 ironsessionを使うときの基本情報（cookienameとか）を決めてる　default function
 * たとえば、pages/api/users/signInでセッション情報をもってきたいときに、withSessionを使ってるけど、そのとき使ってたりする
 * @module
 * @param {function} handler APIを処理する何かしらの関数
 */

export default function withSession(handler) {
  return withIronSession(handler, {
    
    password: process.env.IRONSESSION_KEY, 
    cookieName: "nekochan_mogumogu_cookie",
    cookieOptions: {
      
      secure: process.env.NODE_ENV === "production", 
    },
  })
}
