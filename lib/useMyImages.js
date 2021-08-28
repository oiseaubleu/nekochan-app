///////////////////////////////////////////////////////////////////////////////////////////////
// ブラウザ側の処理
///////////////////////////////////////////////////////////////////////////////////////////////
import { useState, useEffect } from "react"

const DEFAULT_HEADER = { "x-api-key": process.env.NEXT_PUBLIC_CAT_API_KEY }

/**
 * 【useMyImages】アップロード関係のカスタムフック
 * @module
 * @returns {array} [infoForMyImages, RefreshMyImages, deleteMyUploadPic, FileUpload]
 *  @returns {object} infoForMyImages 自分がアップロードした画像の情報が入ったオブジェクト
 *  @returns {function} RefreshMyImages　自分アップロードした画像をリフレッシュする関数
 *  @returns {function} deleteMyUploadPic 自分のアップロードした画像を削除する関数
 *  @returns {function} FileUpload ファイルのアップロードをする関数
 *
 *
 */
export default function useMyImages(subId) {
  const [infoForMyImages, setinfoForMyImages] = useState([])
  /**
   * 【RefreshMyImages】自分のアップロードした画像を一度クリアした後、持ってくる。
   */
  const RefreshMyImages = () => {
    setinfoForMyImages([])
    getMyImagesFromAPI(subId)
  }

  /**
   * 【getMyImagesFromAPI】指定のsubIdをキーにアップロードした画像をCatAPIから取ってくる [GET]
   *  myPageTabのタブが選択されたときに働く関数。 myImageをごっそり持ってくるために、limitのところで再帰してる
   * @param {string} subId
   * @param {number} limit　1ページ分として、いくつのデータをとってくるか（これは今のところ固定で100）
   * @param {number} page　ページ数　０始まり
   */
  const getMyImagesFromAPI = (subId, limit = 100, page = 0) => {
    const param = {
      page,
      limit,
      order: "ASC",
      sub_id: subId,
    }
    const query_params = new URLSearchParams(param)

    fetch("https://api.thecatapi.com/v1/images?" + query_params, {
      headers: DEFAULT_HEADER,
    }).then((res) => {
      res.json().then((data) => {
        let myImagesInfoArr = data.map((obj) => ({
          imageId: obj.id,
          url: obj.url,
          created_at: obj.created_at,
          
        }))
        setinfoForMyImages((prev) => prev.concat(myImagesInfoArr))
 
      }) // ここまでで、res.json()の処理終わり。
      let paginationCount = Number(res.headers.get("pagination-count"))
      if (paginationCount > limit * (page + 1)) {
        getMyImagesFromAPI(subId, limit, page + 1) // 次のページの情報を取ってくる
      }
    })
  }

  /**
   * 【deleteMyUploadPic】自分のアップロードした画像を削除する関数。[DELETE]
   * @param {string} imageId
   */
  const deleteMyUploadPic = (imageId) => {
    fetch("https://api.thecatapi.com/v1/images/" + imageId, {
      method: "DELETE",
      headers: DEFAULT_HEADER,
    })
      .then((res) => res.json)
      .then((body) => {
        setinfoForMyImages((prev) => {
          return prev.filter((image) => image.imageId !== imageId)
        })
      })
  }

  /**
   * 【FileUpload】ファイルのアップロードをする関数。[POST]
   * アップロードが成功すると成功画面になって、MyPageタグの自動更新がされる！
   */

  const FileUpload = () => {
    //const subId = "your-user-0110"
    const formData = new FormData()
    const fileField = document.getElementById("catimages")
    formData.append("file", fileField.files[0])
    formData.append("sub_id", subId)
    return fetch("https://api.thecatapi.com/v1/images/upload", {
      method: "POST",
      headers: DEFAULT_HEADER,
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        //成功したらこっち（サクセスモーダルが開く（this.state.successModalOpenをtrueにする））
        // setSuccessModalOpen(true)
        // setMyImages([]) // すでに持ってるマイネコチャンを空にしておく
        RefreshMyImages(subId)
      })
      .catch((error) => {
        //失敗したらこっちにいく
        console.error("Error:", error)
      })
  }

  return [infoForMyImages, RefreshMyImages, deleteMyUploadPic, FileUpload]
}
