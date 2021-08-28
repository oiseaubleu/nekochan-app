import MyPage from "../components/mypage"
/**
 * 【APP】ゲストページの表示　MyPageコンポーネントにisGuestの引数を渡している
 */
export default function App() {
  return <MyPage isGuest={true} />
}
