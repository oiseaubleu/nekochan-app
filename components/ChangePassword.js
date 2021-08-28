//////////////////////////////////////////////////////////////////////////////////////////////
// パスワード変更画面のコンポーネント
///////////////////////////////////////////////////////////////////////////////////////////////
import React, { useEffect, useState } from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import { useRouter } from "next/router"

/**
 * 【ChangePassword】パスワード変更画面の実装をしている default function
 * @module
 * @param {object} props Propsとして引数を受け取る。
 * @param {string} props.userId userId
 * @param {string} props.randomString ランダムな文字列（つかってない）
 */

export default function ChangePassword({ userId, randomString }) {
  const [passwordInfo, setPasswordInfo] = useState({
    exPassword: "",
    newPassword: "",
    newPasswordForConfirmation: "",
  })
  const [signInSuccess, setSignInSuccess] = useState("success")
  //ページ遷移のためのカスタムフック
  const router = useRouter()
  ////////////////////////////
  //フォームの中の値を更新する
  ////////////////////////////
  const handleChange = (event) => {
    let name = event.target.name
    let value = event.target.value
    setPasswordInfo((prev) => ({ ...prev, [name]: value }))
  }

  ////////////////////////////
  //フォームの内容チェッカー
  ////////////////////////////
  const [exPassword, newPassword, newPasswordForConfirmation] = [
    passwordInfo.exPassword,
    passwordInfo.newPassword,
    passwordInfo.newPasswordForConfirmation,
  ]
  let message
  let submitButton
  //フォームのどれか空欄だと提出ボタンがそもそも押せない
  if (
    exPassword === "" ||
    newPassword === "" ||
    newPasswordForConfirmation === ""
  ) {
    submitButton = (
      <div>
        Please fill out this form. After then you can click submit button.
      </div>
    )
  }
  //新しいパスワードと、新しいパスワード（確認用）が合致してないとsubmit出てこない
  if (newPassword !== newPasswordForConfirmation) {
    message = <Alert variant="danger"> Please input same new password. </Alert>
    submitButton = <div></div>
  }
  if (
    exPassword !== "" &&
    newPassword !== "" &&
    newPasswordForConfirmation !== ""
  ) {
    submitButton = (
      <Button
        variant="primary"
        type="submit"
        onClick={(event) => addNewPassword(event)}
      >
        Submit
      </Button>
    )
  }

  ////////////////////////////
  //新しいパスワードを登録するやつ
  ////////////////////////////
  const addNewPassword = (event) => {
    event.preventDefault()
    setSignInSuccess("processing")

    const passwordObject = {
      exPassword: passwordInfo.exPassword,
      newPassword: passwordInfo.newPassword,
      userId: userId,
    }

    //APIに渡す
    fetch("/api/users/forChangePasword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordObject),
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          let error = new Error()
          error.response = res
          throw error
        }
      })
      .then((body) => {

        setSignInSuccess("success")

        router.push("/mypage")
      })
      .catch((err) => {
        err.response.json().then((body) => {
          if (body.errorCode === "E006") {
            setSignInSuccess(body.errorMessage)
          }
        })
      })

    setPasswordInfo({
      exPassword: "",
      newPassword: "",
      newPasswordForConfirmation: "",
    })
  }
  let errorMessageForUser
  if (signInSuccess !== "success" && signInSuccess !== "processing") {
    errorMessageForUser = <Alert variant="danger"> {signInSuccess}😿 </Alert>
  }
  return (
    <Form>
      <strong>Change your password🔐</strong>
      {message}
      {errorMessageForUser}
      <Form.Group controlId="changePassForm">
        <Form.Group controlId="previousPass">
          <Form.Label>PREVIOUS Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Previous Password"
            name="exPassword"
            onChange={(event) => handleChange(event)}
            value={passwordInfo.exPassword}
          />
        </Form.Group>

        <Form.Group controlId="newPass">
          <Form.Label>NEW Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="NEW Password"
            name="newPassword"
            onChange={(event) => handleChange(event)}
            value={passwordInfo.newPassword}
          />
        </Form.Group>

        <Form.Group controlId="newPass2">
          <Form.Label>
            NEW Password(Please input your password again for confirmation.)
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="NEW Password"
            name="newPasswordForConfirmation"
            onChange={(event) => handleChange(event)}
            value={passwordInfo.newPasswordForConfirmation}
          />
        </Form.Group>
        {submitButton}
      </Form.Group>
    </Form>
  )
}
