//////////////////////////////////////////////////////////////////////////////////////////////
// マイページのコンポーネント
///////////////////////////////////////////////////////////////////////////////////////////////
import React, { PureComponent, useEffect, useState } from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import useCats from "../lib/useCats"
import useAllCatVotes from "../lib/useAllCatVotes"
import useMyImages from "../lib/useMyImages"

import AddImage from "./AddImage"
import PasswordReset from "./PasswordReset"
import FavTab from "./FavTab"
import MyTab from "./MyTab"

import CatSearch from "./search"
import SignUp from "./SignUp"
import useUser from "../lib/useUser"

/**
 * 【MyPage】サインイン部分を表示させるdefault function
 * @module
 * @param {boolean} props.isGuest ゲストユーザーかどうかのBoolean
 */

export default function MyPage({ isGuest }) {
  //ユーザ情報（ログインしてるだとか、してなければ細かいユーザ情報も）
  // ユーザ情報更新用の関数を持っておく。SignOut直後に、キャッシュを更新する必要がある。
  let hikisu
  if (isGuest) {
    hikisu = undefined
  } else {
    hikisu = { redirectTo: "/" }
  }
  const { user, mutateUser } = useUser(hikisu)

  const subId = user?.userId

  const { cats, getCats, switchMode, pageInfo, pushFav, removeFav, upvoteCat } =
    useCats(subId)
  // MyImageのVotesを取得するために呼び出す。
  const [allCatVotes, _] = useAllCatVotes()
  const [infoForMyImages, RefreshMyImages, deleteMyUploadPic, FileUpload] =
    useMyImages(subId)
  const [myImages, setMyImages] = useState([]) //自分がアップロードした画像の情報
  const [successModalOpen, setSuccessModalOpen] = useState("notOpen") //アップロードが成功したかどうかのモーダル
  const [selectedTab, setSelectedTab] = useState("searchPhotosTab")
  // loading notOpen success failed

  /**
   * 【tabSelection】それぞれのタブの切り替えをする関数
   * @paramm {string} eventKey 選んだタブの名前が入る
   */
  const tabSelection = (eventKey) => {
    setSelectedTab(eventKey)
    if (eventKey === "searchPhotosTab") {
      switchMode("search")
    }
    if (eventKey === "favTab") {
      switchMode("fav")
      getCats("fav")
    }
    if (eventKey === "myPageTab") {
      getMyImagesFromAPI(subId)
    }
  }

  useEffect(() => {
    let forOrderMyImages = infoForMyImages.map((obj) => ({
      ...obj,
      votes: getVotes(allCatVotes, obj.imageId),
    }))
    let OrderMyImages = forOrderMyImages.sort((a, b) => {
      if (a.created_at < b.created_at) {
        return -1
      } else {
        return 1
      }
    })
    setMyImages(OrderMyImages)
  }, [infoForMyImages, allCatVotes])

  /**
   * 【getMyImagesFromAPI】myPageTabのタブが選択されたときに働く関数。
   */
  const getMyImagesFromAPI = (limit = 100, page = 0) => {
    RefreshMyImages()
  }

  /**
   * Votes全体から、渡されたネコチャンのIDに該当するものだけを取ってくる。
   * 返り値はそのネコチャン向けのVotes。
   *
   * @param {object[]} allVotes  取ってきたVotes全体。
   * @param {string} imageId  ネコチャンのID
   * @returns {number}  そのネコチャンのVotes
   */
  const getVotes = (allCatVotes, imageId) => {
    return allCatVotes.filter((obj) => obj.image_id === imageId).length
  }

  /**
   * 【uploadFileAndShowSuccess】ファイルのアップロードをする関数。
   * ちなみにアップロードが成功すると成功画面になって、MyPicタブの自動更新がされる！
   */
  const uploadFileAndShowSuccess = () => {
    setSuccessModalOpen("loading")
    FileUpload().then(() => setSuccessModalOpen("success"))
  }

  /**
   * 【signOut】SignOutButtonが押されたときに働く関数。userIdとか渡さなくていいのは、cookieで見てるから
   */
  const signOut = () => {
    fetch("/api/users/signOut", {
      method: "POST",
    }).then(mutateUser({ isLoggedIn: false }))
  }

  /**
   * ゲストユーザだったときに、ボタン系は出さず、SignUpのフォームだけ出す
   */
  let sideMenu
  if (isGuest) {
    sideMenu = (
      <Col sm={12} md={6}>
        {" "}
        <SignUp />{" "}
      </Col>
    )
  } else if (!user || user.isLoggedIn === false) {
    return (
      <Col>
        <Row>loading...🐈</Row>
      </Col>
    )
  } else {
    sideMenu = (
      <Col sm={12} md={6}>
        <Row>Welcome {user?.userId}!!</Row>
        <Row>
          <AddImage
            FileUpload={uploadFileAndShowSuccess}
            ChangeSuccessModal={() => setSuccessModalOpen("notOpen")}
            uploadSuccess={successModalOpen}
          />
        </Row>
        {/* <Row>
          <InviteModalButton inviteSuccess={inviteSuccess} />
        </Row> */}
        <Row className="my-2">
          <PasswordReset />
        </Row>
        <Row>
          <SignOutButton signOut={signOut} />
        </Row>
      </Col>
    )
  }
  return (
    <>
      <Container>
        <Row>
          <Col sm={12} md={6}>
            <MypageTabs
              tabSelection={tabSelection}
              selectedTab={selectedTab}
              cats={cats}
              getCats={getCats}
              pageInfo={pageInfo}
              myImages={myImages}
              deleteMyUploadPic={deleteMyUploadPic}
              pushFav={pushFav}
              removeFav={removeFav}
              upvoteCat={upvoteCat}
              isGuest={isGuest}
              subId={subId}
            />
          </Col>
          {sideMenu}
        </Row>
      </Container>
    </>
  )
}

/////////////////////////////////////////////////////////////////////////////

/**
 * 【SignOutButton】サインアウトするときのボタン。押すとサインアウト関数を実行し、HOMEに戻る。
 * @param {function} props.signOut サインアウトの関数
 */
export function SignOutButton({ signOut }) {
  return (
    <>
      <Button variant="success" onClick={() => signOut()}>
        SIGN OUT
      </Button>
    </>
  )
}

/**
 * 【MypageTabs】検索画面・お気に入り一覧・マイページの３つからなるタブ
 * @param {object} props Propsとして引数を受け取る。
 * @param {function} props.tabSelection 選択したタブを表示させる関数
 * @param {stirng} props.selectedTab 現在選択しているタブ。searchかfavの二択
 * @param {object} props.cats 検索結果のネコチャン情報または、お気に入りネコチャン情報
 * @param {function} props.getCats 指定したモードでの、ネコチャン情報を取得・モードの更新をする関数
 * @param {object} props.pageInfo: { catPageNum, currentPage, maxPageNum } ページ番号等の情報が入ったオブジェクト
 * @param {object[]} props.myImages 自分がアップロードした画像の情報が入っているオブジェクトが入った配列
 * @param {function} props.deleteMyUploadPic 自分のアップロードした画像を削除する関数
 * @param {function} props.pushFav CatAPIにお気に入りを登録する関数
 * @param {function} props.removeFav お気に入り解除する関数
 * @param {function} props.upvoteCat 魚数を増やす（CatAPIに新しいvotesを登録する関数）
 * @param {boolean} props.isGuest ゲストユーザーかどうかのBoolean
 *
 * 〇ゲストユーザーのときのMypageTabs
 *  ・CatSearch
 * 〇ゲストユーザーではないときのMypageTabs
 *  ・CatSearch
 *  ・FavTab
 *  ・MyTab
 */

export function MypageTabs({
  tabSelection,
  selectedTab,
  cats,
  getCats,
  pageInfo,
  myImages,
  deleteMyUploadPic,
  pushFav,
  removeFav,
  upvoteCat,
  isGuest,
}) {
  let userTab

  if (isGuest) {
    userTab = (
      <Tabs defaultActiveKey="searchPhotosTab" id="uncontrolled-tab-example">
        <Tab eventKey="searchPhotosTab" title="Search Cats">
          <CatSearch
            isGuest={isGuest}
            catInfo={cats}
            getCats={getCats}
            pageInfo={pageInfo}
            pushFav={pushFav}
            removeFav={removeFav}
            upvoteCat={upvoteCat}
          />
        </Tab>

        <Tab eventKey="favTab" title="My Favorite">
          Please sign UP!!!
        </Tab>

        <Tab eventKey="myPageTab" title="My Pic">
          Please sign UP!!!
        </Tab>
      </Tabs>
    )
  } else {
    userTab = (
      <Tabs
        defaultActiveKey="searchPhotosTab"
        id="uncontrolled-tab-example"
        onSelect={(eventKey) => tabSelection(eventKey)}
      >
        <Tab eventKey="searchPhotosTab" title="Search Cats">
          <CatSearch
            isGuest={isGuest}
            catInfo={cats}
            getCats={getCats}
            pageInfo={pageInfo}
            pushFav={pushFav}
            removeFav={removeFav}
            upvoteCat={upvoteCat}
          />
        </Tab>

        <Tab eventKey="favTab" title="My Favorite">
          <FavTab
            isSelected={selectedTab === "favTab"}
            favList={cats}
            catGreet={upvoteCat}
            removeFav={removeFav}
          />
        </Tab>

        <Tab eventKey="myPageTab" title="My Pic">
          <MyTab myImages={myImages} deleteMyUploadPic={deleteMyUploadPic} />
        </Tab>
      </Tabs>
    )
  }

  return <>{userTab}</>
}
