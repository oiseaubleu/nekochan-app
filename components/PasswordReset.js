//////////////////////////////////////////////////////////////////////////////////////////////
// パスワードリセットのモーダル関係のコンポーネント
///////////////////////////////////////////////////////////////////////////////////////////////
import Modal from "react-bootstrap/Modal"
import React, { PureComponent, useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Link from "next/link"

/**
 * 【PasswordReset】パスワードリセットのモーダルを表示させるdefault function
 */

export default function PasswordReset() {
  //モ-ダル用
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [emailAuthenticationSuccess, setEmailAuthenticationSuccess] = useState(
    `If you click "OK", NEKOCHAN will send you a URL for verification.`
  )

  const emailAuthentication = (event) => {
    fetch("/api/users/emailAuthentication", {
      method: "POST",
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
        setEmailAuthenticationSuccess(
          "Please check your email. NEKOCHAN sent you authentication email."
        )
      })
      .catch((err) => {
        err.response
          .json()
          .then((body) =>
            setEmailAuthenticationSuccess(
              "We could not send email, please retry."
            )
          )
      })
  }

  return (
    <>
      <Button variant="warning" onClick={handleShow}>
        CHANGE your password
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>Password Reset</Modal.Header>
        <Modal.Body>{emailAuthenticationSuccess}</Modal.Body>
        <Modal.Footer>
          <Row>
            <Col>
              {" "}
              <Button
                variant="danger"
                onClick={(event) => emailAuthentication(event)}
              >
                OK
              </Button>
            </Col>
            <Col>
              {" "}
              <Button variant="secondary" onClick={handleClose}>
                Not now
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  )
}
