import MyPage from "../components/mypage"
/**
 * 【APP】ログイン成功後のページの表示　MyPageコンポーネントにisGuestの引数を渡している
 */
export default function App() {
  return <MyPage isGuest={false} />
}
