//////////////////////////////////////////////////////////////////////////////////////////////
// サインアップのコンポーネント
///////////////////////////////////////////////////////////////////////////////////////////////
import React, { useEffect, useState } from "react"
import useUser from "../lib/useUser"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import { useRouter } from "next/router"
/**
 * 【SignUp】サインアップ部分を表示させるdefault function
 */
export default function SignUp() {
  // ユーザ情報更新用の関数を持っておく。SignIn直後に、キャッシュを更新する必要がある。
  const { mutateUser } = useUser()
  //sign upが成功したとき success してないと表示するエラーメッセージが入る
  const [signUpSuccess, setSignUpSuccess] = useState("success")
  const [accountInfo, setAccountInfo] = useState({ email: "", password: "" })
  //ページ遷移のためのカスタムフック
  const router = useRouter()

  /**
   * 【handleChange】新しいアカウントの情報（メールアドレスとパスワード）をstateに入れる関数
   * 【addAccount】SignUpボタンが押されたときに働く関数
   */
  const handleChange = (event) => {
    let name = event.target.name
    let value = event.target.value

    setAccountInfo((prev) => ({ ...prev, [name]: value }))
  }
  const addAccount = (event) => {

    event.preventDefault()
    // アドレスが＠なければ「正しいメールアドレスを入力してください（全角・＠なしは不可）」

    setSignUpSuccess("processing")

    // 登録したいオブジェクト
    const accountObj = {
      userId: accountInfo.email,

      password: accountInfo.password,
    }
    fetch("/api/users/addAccount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accountObj),
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
        setSignUpSuccess("success") 
        mutateUser({ isLoggedIn: true })
        router.push("/mypage")
      })
      .catch((err) => {
        err.response.json().then((body) => {
          if (body.errorCode === "E003") {
            setSignUpSuccess(body.errorMessage)
          }
          if (body.errorCode === "E005") {
            setSignUpSuccess(body.errorMessage)
          }
        })
      })

    setAccountInfo({ email: "", password: "" })
  }

  let message
  if (signUpSuccess !== "success" && signUpSuccess !== "processing") {
    message = <Alert variant="danger"> {signUpSuccess}😿 </Alert>
  }
  return (
    <Form>
      <strong>Create your account😻</strong>
      {message}
      <Form.Group controlId="signUpForm">
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={(event) => handleChange(event)}
            value={accountInfo.email}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={(event) => handleChange(event)}
            value={accountInfo.password}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          onClick={(event) => addAccount(event)}
        >
          Submit
        </Button>
      </Form.Group>
    </Form>
  )
}
