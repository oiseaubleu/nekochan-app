//////////////////////////////////////////////////////////////////////////////////////////////
// サインインのコンポーネント
///////////////////////////////////////////////////////////////////////////////////////////////
import React, { useEffect, useState } from "react"
import useUser from "../lib/useUser"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import { useRouter } from "next/router"
/**
 * 【SignIn】サインイン部分を表示させるdefault function
 */
export default function SignIn() {
  // ユーザ情報更新用の関数を持っておく。SignIn直後に、キャッシュを更新する必要がある。
  const { mutateUser } = useUser()
  //sign in が失敗したとき noAccount/wrongPasswordみたいな、受け取ったエラーメッセージが入る。成功時・なんも始まってないときはtrue
  const [signInSuccess, setSignInSuccess] = useState(true)


  const [signInInfo, setSignInInfo] = useState({ email: "", password: "" })
  //ページ遷移のためのカスタムフック
  const router = useRouter()
  /**
   * 【handleSignInfoChange】サインインの情報（メールアドレスとパスワード）をstateに入れる関数
   * 【signInFunc】SigniInボタンが押されたときに働く関数
   */
  const handleSignInfoChange = (event) => {
    let name = event.target.name
    let value = event.target.value

    setSignInInfo((prev) => ({ ...prev, [name]: value }))
  }

  const signInFunc = (event) => {
    event.preventDefault()
 
    const signInObj = {
      userId: signInInfo.email,

      password: signInInfo.password,
    }
    fetch("/api/users/signIn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signInObj),
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

        alert("login success")
        setSignInSuccess(true)
        mutateUser({ isLoggedIn: true })
        router.push("/mypage")
      })
      .catch((err) => {
        err.response.json().then((body) => setSignInSuccess(body.errorMessage))
   
      })
    setSignInInfo({ email: "", password: "" })
  }
  
  let message
  if (signInSuccess !== true) {
    message = <Alert variant="danger"> {signInSuccess}😿 </Alert>
  }
  return (
    <Form>
      {message}

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email" 
          placeholder="Enter email"
          name="email"
          onChange={(event) => handleSignInfoChange(event)}
          value={signInInfo.email}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          onChange={(event) => handleSignInfoChange(event)}
          value={signInInfo.password}
        />
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        onClick={(event) => signInFunc(event)}
      >
        Submit
      </Button>
    </Form>
  )
}
