///////////////////////////////////////////////////////////////////////////////////////////////
// TOP画面のコンポーネント
///////////////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import Alert from "react-bootstrap/Alert"
import Image from "next/image"
import { useRouter } from "next/router"
import Link from "next/link"

import SignUp from "./SignUp"
import SignIn from "./SignIn"
import useUser from "../lib/useUser"

/**
 * 【TopPage】TOPページを表示させるdefault function
 */
export default function TopPage() {
  //ページ遷移のためのカスタムフック
  const router = useRouter()
  // ユーザ情報更新用の関数を持っておく。SignIn直後に、キャッシュを更新する必要がある。
  const { mutateUser } = useUser()

  /**
   * 【jumpToGuestpage】ゲストページに飛ぶ関数
   */
  const jumpToGuestpage = (event) => {
    router.push("/guestpage")
  }

  return (
    <Container>
      <Main jumpToGuestpage={jumpToGuestpage} />
      <br></br>
      <Comment />
      <br></br>
      <Link href="../apiDoc">
        <a>spec document of API by Swagger</a>
      </Link>
      <br></br>
      <Link href="../jsdoc/index.html">
        <a>spec document by JSDoc</a>
      </Link>
    </Container>
  )
}

/**
 * 【Main】ContentsとDescribeを表示させるfunciton
 * [Contents row1:About(0.5)・GuestButton(0.5)・Login(1)/
 * Describe row1]
 * @module
 * @param {function} props.jumpToGuestpage ゲストページに飛ぶ関数
 */
export function Main({ jumpToGuestpage }) {
  return (
    <Row>
      <Contents jumpToGuestpage={jumpToGuestpage} />

      <Describe />
    </Row>
  )
}

/**
 * 【Contents】About,GuestButton,Loginを表示させる
 * @param {function} props.jumpToGuestpage ゲストページに飛ぶ関数
 *
 */
export function Contents({ jumpToGuestpage }) {
  return (
    <Container className="pb-5">
      <Row>
        <Col sm={12} md={6}>
          <Row>
            <About />
          </Row>

          <Row className="mt-4">
            {" "}
            <GuestButton jumpToGuestpage={jumpToGuestpage} />
          </Row>
        </Col>

        <Col sm={12} md={6}>
          <Login />
        </Col>
      </Row>
    </Container>
  )
}
/**
 * 【About】左上部のアプリの説明の表示をさせる
 */
export function About() {
  return (
    <div>
      {" "}
      <h3>By the cats for the cats </h3>
      This application is social networking service for CATS.
      <td></td>Cats are called "nekochan" in Japanese. May you have wonderful
      new friends!
      <br></br>
    </div>
  )
}
/**
 * 【GuestButton】ゲストページに飛ぶボタンを設置する
 * @param {function} props.jumpToGuestpage ゲストページに飛ぶ関数
 */
export function GuestButton({ jumpToGuestpage }) {
  return (
    <div>
      <h4>You can try to search without SIGN IN.</h4>

      <Button variant="success" onClick={(event) => jumpToGuestpage(event)}>
        guest user
      </Button>
    </div>
  )
}

/**
 * 【Login】ログインと、メンバー登録のタブの表示
 */
export function Login() {
  return (
    <Tabs defaultActiveKey="signIn" id="uncontrolled-tab-example">
      <Tab eventKey="signIn" title="SIGN IN">
        {" "}
        <SignIn />
      </Tab>

      <Tab eventKey="signUp" title="SIGN UP">
        {" "}
        <SignUp />
      </Tab>
    </Tabs>
  )
}

/**
 * 【Describe】アプリ内容の説明
 */
export function Describe() {
  return (
    <Container>
      <Row className="pb-5">
        <Col sm={12} md={6} lg={4}>
          <Row>
            {" "}
            <Image
              src="/images/test1.png"
              alt="DescribeImageThree"
              width={200}
              height={200}
            />
          </Row>
          <Row className="m-5">
            {" "}
            <h4>You can meet many cats all over the world!</h4>
            <p>
              Now, we are in hard times...but, we can have emotional connection
              without meawsial distance!
            </p>
          </Row>
        </Col>

        <Col sm={12} md={6} lg={4}>
          <Row>
            {" "}
            <Image
              src="/images/test2.png"
              alt="DescribeImageOne"
              width={200}
              height={200}
            />
          </Row>
          <Row className="m-5">
            {" "}
            <h4>You can send a gift "🐟"</h4>
            <p>
              to him/her. Not onece.<br></br>If you want that, you can do it
              over and over again ;-)
            </p>
          </Row>
        </Col>

        <Col sm={12} md={6} lg={4}>
          <Row>
            {" "}
            <Image
              src="/images/test3.png"
              alt="DescribeImageTwo"
              width={200}
              height={200}
            />
          </Row>
          <Row className="m-5">
            <h4>
              Let's share your photos!
              <br></br>
            </h4>
            <p>
              You can share your wonderful photos!
              <br></br>
              Also, you can save your favorite photos.
            </p>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

/**
 * 【Comment】口コミの表示
 */
export function Comment() {
  return (
    <Container>
      <Row className="mx-5" style={{ height: "100px" }}>
        <Col className="px-5" style={{ position: "relative" }}>
          {" "}
          <Image
            src="/images/miina_round.jpg"
            alt="CommentImageOne"
            layout="fill"
            objectFit="contain"
          />
        </Col>
        <Col className="px-5" style={{ position: "relative" }}>
          {" "}
          <Image
            src="/images/mako_round.jpg"
            alt="CommentImageTwo"
            layout="fill"
            objectFit="contain"
          />
        </Col>
      </Row>

      <Row className="mx-5">
        <Col>
          {" "}
          Miina<br></br>“I want many fishes!!”
        </Col>
        <Col>
          {" "}
          Mako<br></br>“They are all cute!I'm enjoying it!”
        </Col>
      </Row>
    </Container>
  )
}
