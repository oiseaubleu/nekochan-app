///////////////////////////////////////////////////////////////////////////////////////////////
// Favoriteタブ関係のコンポーネント
///////////////////////////////////////////////////////////////////////////////////////////////
import React, { PureComponent, useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Image from "next/image"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

/**
 * 【FavTab】お気に入りネコチャンタブの表示する default function
 * @module
 * @param {object} props Propsとして引数を受け取る。
 * @param {boolean} props.isSelected お気に入りタブそのものが選ばれているかどうかのBoolean
 * @param {object[]} props.favList 検索した結果のネコの情報がオブジェクトで配列に入っている [{ imageId ,imageUrl , votes, favorite }]
 * @param {function} props.CatGreet 押すとvotesに+1する関数
 * @param {function} props.removeFav 押すとお気に入りから削除する関数
 */
export default function FavTab({ isSelected, favList, catGreet, removeFav }) {
  let [currentCatNum, setCurrentCatNum] = useState(5) //現在表示されているネコの数
  let currentFavCats = favList.slice(0, currentCatNum) //現在表示しているネコの情報
  //表示されているネコの数を変化させる関数↓
  const moreAndMore = () => {
    setCurrentCatNum((prev) => prev + 5)
  }

  const handlePageClick = (data) => {
   
    let selected = data.selected
    setCurrentPageNum(selected)
  }

  let favTabAppear
  let loadMoreAppear
  //もし、currentCatNumがfavList.length以上になったらmoreボタンはもういらないので出さない
  if (currentCatNum < favList.length) {
    loadMoreAppear = <LoadMoreButton moreAndMore={moreAndMore} />
  }

  if (favList.length === 0 || !isSelected) {
    favTabAppear = <>Let's search your favorite😻!!</>
  } else {
   
    favTabAppear = (
      <Container>
        {currentFavCats.map(
          (
            favcatInfo 
          ) => (
            <Col>
              <FavRow
                favoriteId={favcatInfo.favorite?.favoriteId}
                favcatImageId={favcatInfo.imageId}
                favcatUrl={favcatInfo.imageUrl}
                favcatVotes={favcatInfo.votes}
                favcatDate={favcatInfo.favorite?.created_at}
                catGreet={catGreet}
                removeFav={removeFav}
              />
            </Col>
          )
        )}
        {loadMoreAppear}
      </Container>
    )
  }
  return <> {favTabAppear}</>
}

/**
 * 【LoadMoreButton】LOAD MOREボタンの表示
 * @param {function} props.moreAndMore 押すと表示されるネコチャンの数を変化させる関数
 */
export function LoadMoreButton({ moreAndMore }) {
  return (
    <Button variant="secondary" onClick={moreAndMore}>
      LOAD MORE ...🐈🐈🐈
    </Button>
  )
}

/**
 * 【FavRow】お気に入りネコチャン１匹を表示するための関数
 * @param {object} props Propsとして引数を受け取る。
 * @param {string} props.favcatImageId お気に入りネコチャンのimageId
 * @param {string} props.favcatUrl お気に入りネコチャンのURL
 * @param {number} props.favcatVotes お気に入りネコチャンの魚数
 * @param {date} props.favcatDate お気に入りネコチャンにした日
 * @param {function} props.catGreet 押すとvotesに+1する関数
 * @param {string} props.favoriteId お気に入りネコチャンのfavoriteId
 * @param {function} props.removeFav 押すとお気に入りから削除する関数
 */
export function FavRow({
  favcatImageId,
  favcatUrl,
  favcatVotes,
  favcatDate,
  catGreet,
  favoriteId,
  removeFav,
}) {
  
  let favcatDateAppear = ""
  if (favcatDate) {
    const favDate = new Date(favcatDate)
    const year = favDate.getFullYear()
    const month = favDate.getMonth() + 1
    const date = favDate.getDate()
    favcatDateAppear = `${year}/${month}/${date}`
  }
  return (
    <Row>
      {" "}
      <Col>
        <Row>You added at {favcatDateAppear}.</Row>
        <Row>
          🐟{favcatVotes} &nbsp;&nbsp;
          <CatGreetButton catGreet={catGreet} favcatImageId={favcatImageId} />
        </Row>
        <Row>
          <DeleteFavorite favcatImageId={favcatImageId} removeFav={removeFav} />
        </Row>
      </Col>
      <Col>
        <Row>
          {" "}
          <img
            src={favcatUrl}
            alt="Oops!  He/She looks shy..."
            width="100%"
            align="right"
          />
        </Row>
      </Col>
    </Row>
  )
}
/**
 * 【CatGreetButton】おさかなボタンの実装
 * @param {object} props Propsとして引数を受け取る。
 * @param {string} props.favcatImageId お気に入りネコチャンのimageId
 * @param {function} props.catGreet 押すとvotesに+1する関数
 */
export function CatGreetButton({ catGreet, favcatImageId }) {
  return (
    <div>
      {" "}
      <Button variant="outline-info" onClick={() => catGreet(favcatImageId)}>
        <Image src="/images/fish1.png" height={32} width={32} alt="送信" />
      </Button>
    </div>
  )
}

/**
 * 【DeleteFavorite】お気に入りから削除するボタンの実装
 * @param {object} props Propsとして引数を受け取る。
 * @param {string} props.favcatImageId お気に入りネコチャンのimageId
 * @param {function} props.removeFav 押すとお気に入りから削除する関数
 */
export function DeleteFavorite({ removeFav, favcatImageId }) {
  return (
    <div>
      <Button variant="link" onClick={() => removeFav(favcatImageId)}>
        Remove from FAV
      </Button>
    </div>
  )
}
