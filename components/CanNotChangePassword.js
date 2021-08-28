//////////////////////////////////////////////////////////////////////////////////////////////
// パスワード変更画面を表示できなかった場合に出す画面のコンポーネント
///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 【CanNotChangePassword】ChangePasswordのページの代わりを表示させる default function
 * @module
 */
export default function CanNotChangePassword() {
  return (
    <center>
      {" "}
      <p>
        <font size="+3">Unauthorized access.Please recheck your URL.</font>
      </p>
    </center>
  )
}
