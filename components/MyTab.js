///////////////////////////////////////////////////////////////////////////////////////////////
// MyTab関係のコンポーネント
///////////////////////////////////////////////////////////////////////////////////////////////
import React, { PureComponent, useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ReactPaginate from "react-paginate"
import Image from "next/image"

/**
 * 【MyTab】myTab表示させるdefault function
 * @module
 * @param {object} props Propsとして引数を受け取る。
 * @param {object[]} props.myImages 自分がアップロードした画像の情報が入っているオブジェクトが入った配列
 * @param {function} props.deleteMyUploadPic 自分のアップロードした画像を削除する関数
 */
export default function MyTab({ myImages, deleteMyUploadPic }) {
  let [currentPageNum, setCurrentPageNum] = useState(0)
  let limit = 1
  let currentPageCat = myImages.slice(
    currentPageNum * limit,
    (currentPageNum + 1) * limit
  )
  let totalPage = Math.ceil(myImages.length / limit)
  let myTabAppear

  const handlePageClick = (data) => {
    let selected = data.selected
    setCurrentPageNum(selected)
  }

  if (myImages.length === 0) {
    myTabAppear = <>Let's share your photos!!</>
  } else {
    //魚もらってる子は魚のカウントをする
    myTabAppear = (
      <Container>
        {currentPageCat.map((image) => (
          <MyTabRow
            uploadedDate={image.created_at}
            imageUrl={image.url}
            votes={image.votes}
            imageId={image.imageId}
            deleteMyUploadPic={deleteMyUploadPic}
          />
        ))}

        <ReactPaginate
          breakClassName={"break-me"}
          pageCount={totalPage}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageLinkClassName={"page-link"}
          pageClassName={"page-item"} //reactBootstrapのclass名を入れてる（reactBootstrapのCSSをReactPaginateのコンポーネントに適用）
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
        />
      </Container>
    )
  }

  return <>{myTabAppear}</>
}

/**
 * 【MyTabRow】自分がアップロードした画像の表示
 * @param {object} props Propsとして引数を受け取る。
 * @param {date} props.uploadedDate 自分がアップロードした日付
 * @param {string} props.imageUrl 自分がアップロードした画像のURL
 * @param {number} props.votes 自分がアップロードした画像の魚数
 * @param {string} props.imageId 自分がアップロードした画像のimageId
 * @param {function} props.deleteMyUploadPic 自分のアップロードした画像を削除する関数
 */
export function MyTabRow({
  uploadedDate,
  imageUrl,
  votes,
  imageId,
  deleteMyUploadPic,
}) {
  return (
    <Container>
      <Row>
        <Col>
          <Row>{uploadedDate}</Row>
          <Row>You have {votes}🐟!!</Row>
          <Row>
            <DeleteMyUploadPicButton
              imageId={imageId}
              deleteMyUploadPic={deleteMyUploadPic}
            />
          </Row>
        </Col>
        <Col>
          <Row
            style={{ position: "relative", height: "200px", width: "200px" }}
          >
            {" "}
            <Image
              src={imageUrl}
              layout="fill"
              objectFit="scale-down"
              alt="Oops!  Something is wrong..."
              align="right"
            />
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
/**
 * 【DeleteMyUploadPicButton】自分がアップロードした画像の削除をするボタンの実装
 * @param {string} props.imageId 自分がアップロードした画像のimageId
 * @param {Function} props.deleteMyUploadPic 自分のアップロードした画像を削除する関数
 */
export function DeleteMyUploadPicButton({ imageId, deleteMyUploadPic }) {
  return (
    <Button
      variant="danger"
      size="sm"
      onClick={() => deleteMyUploadPic(imageId)}
    >
      Delete this pic
    </Button>
  )
}
