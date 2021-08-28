import ChangePassword from "../components/ChangePassword"
import CanNotChangePassword from "../components/canNotChangePassword"
import useUser from "../lib/useUser"
import { getUserIdUseRandomStringFromDynamoDB } from "../lib/user"

/**
 * 【App】ChangePasswordもしくはCanNotChangePasswordページを表示させる default function
 * @module
 * @param {object} props Propsとして引数を受け取る。
 * @param {string} props.randomString 入れられたURLから受け取ったランダム文字列
 * @param {(string|null)} props.userId ランダム文字列を使って得たuserId ないとNULL
 */

export default function App({ randomString, userId }) {
  if (userId) {
    return <ChangePassword userId={userId} randomString={randomString} />
  } else {
    return <CanNotChangePassword /> 
  }
}

/**
 * 【getServerSideProp】サーバーサイドレンダリングのための関数
 * @param {object} context queryとかそのほか色々なものが入ったオブジェクト。
 */
export async function getServerSideProps(context) {
  
  const randomString = context.query.auth //URLの中の?auth=""の””内をもってくる
  const data = await getUserIdUseRandomStringFromDynamoDB(randomString)
  const userId = data.Item?.userId

  return {
    props: {
      randomString,
      userId: userId ? userId : null,
    }, 
  }
}
