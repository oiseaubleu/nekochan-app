///////////////////////////////////////////////////////////////////////////////////////////////
// ブラウザ側の処理
///////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 【useUser】
 * 1. `useSWR` を使って、APIでログイン処理
 * 2. `useEffect` を使って、ログインされてない場合のリダイレクト処理を記載
 * @module
 * @param {(boolean | string)} redirectTo ログインしてない場合にリダイレクトする先のURLもしくは、ログイン後にリダイレクトする先のURL（redirectAfterLoginがtrueのときだけ働く）
 * @returns {object} {user, mutateUser}
 *  @returns {object} user ユーザー情報のオブジェクト
 *  @returns {function} mutateUser　ユーザー情報に変化があったときに更新する関数
 */
import { useEffect } from "react"
import Router from "next/router"
import useSWR from "swr"

export default function useUser({
  redirectTo = false, //リダイレクト先のURLをもらえないときはデフォルトでfalse(ログインしてる人のリダイレクト先としても、ログインしてない人のリダイレクト先としても使う)
} = {}) {
  const { data: user, mutate: mutateUser } = useSWR("/api/user")
  useEffect(() => {
    //console.log(user)
    //userってオブジェクトがない（どっかでエラーになったとか。）もしくは、リダイレクト先がない（リダイレクトはしないけど、ユーザ情報だけほしいときとか）⇒それで終了（return { user, mutateUser } に飛ぶ）
    if (!redirectTo || !user) return
    //redirectToになにかURLが入っている＝ログインしてない人のURL＆ユーザがログインしてないとき
    if (redirectTo && !user?.isLoggedIn) {
      Router.push(redirectTo) //Routerにpushすると、クライアント側のページ遷移を処理する。
    }
  }, [user, redirectTo]) //user情報、redirectIfFound, redirectToのどれも変わってないときはuseEffectの中の処理はしない
  return { user, mutateUser }
  //mutateUserは、logOutボタンを押したときのためのfalseにする関数とかに使う。
}
