///////////////////////////////////////////////////////////////////////////////////////////////
// 画像アップロード関係のコンポーネント
///////////////////////////////////////////////////////////////////////////////////////////////
import Modal from "react-bootstrap/Modal"
import React, { PureComponent, useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import Image from "next/image"

/**
 *【AddImage】 画像アップロード部分の表示をする default function
 * @module
 * @param {object} props Propsとして引数を受け取る。
 * @param {boolean} props.uploadSuccess  アップロードが成功したかどうかを表すBoolean
 * @param {function} props.FileUpload  ファイルをアップロードするための関数
 * @param {function} props.ChangeSuccessModal  アップロード成功後、モーダルを閉じたときに uploadSuccess をfalseに変更するための関数
 */
export default function AddImage({
  uploadSuccess,
  FileUpload,
  ChangeSuccessModal,
}) {
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
    ChangeSuccessModal()
  }
  const handleShow = () => setShow(true)

  let modalHeader, modalBody
  if (uploadSuccess === "loading") {
    modalHeader = (
      <Modal.Header>
        <Modal.Title>
          Loading...
          <Image
            src="/images/hasiruneko.gif"
            alt="runnningcat"
            width={50}
            height={50}
          />
        </Modal.Title>
      </Modal.Header>
    )
  } else if (uploadSuccess === "success") {
    // アップロードに成功した場合のヘッダーと中身
    modalHeader = (
      <Modal.Header>
        <Modal.Title>Success!!!😺</Modal.Title>
      </Modal.Header>
    )
 
  } else {
    // アップロード前のヘッダーと中身
    modalHeader = (
      <Modal.Header>
        <Modal.Title>UPLOAD your image!!!😺</Modal.Title>
      </Modal.Header>
    )
    modalBody = (
      <Modal.Body>
        <SelectImage />
        <Row className="m-2">
          <UploadButton FileUpload={FileUpload} />
        </Row>
      </Modal.Body>
    )
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        UPLOAD your image
      </Button>

      <Modal show={show} onHide={handleClose}>
        {modalHeader /* 上で切り替えたHeaderを置く */}
        {modalBody /* 上で切り替えたBodyを置く */}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

/**
 * 【SelectImage】画像選択用のフォーム
 * この中の input要素のIDは、画像アップロードの際に参照しているので注意。
 */
export function SelectImage() {
  return (
    <form>
      <input type="file" id="catimages" name="YourCatImage" required></input>
    </form>
  )
}

/**
 *【UploadButton】 ファイルアップロード用のボタンの実装
 * @param {object} props Propsとして引数を受け取る。
 * @param {function} props.FileUpload  ファイルアップロードするための関数
 */
export function UploadButton({ FileUpload }) {
  return (
    <Button variant="success" type="submit" onClick={() => FileUpload()}>
      UPLOAD
    </Button>
  )
}
