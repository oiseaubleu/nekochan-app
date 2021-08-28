///////////////////////////////////////////////////////////////////////////////////////////////
// ブラウザ側の処理
///////////////////////////////////////////////////////////////////////////////////////////////
import { useState, useEffect } from "react"

const DEFAULT_HEADER = { "x-api-key": process.env.NEXT_PUBLIC_CAT_API_KEY }

/**
 * 【useAllCatVotes】CatVotes関係のカスタムフック。
 * CatAPIから全部のネコチャンの情報を持ってくる・CatAPIに新しくvotesを追加する
 * ※subIdはvotesでは使わない
 * @module
 * @returns {array} [allCatVotes, upvoteCat]
 * @returns {object} allCatVotes 現在魚をもってるネコチャンのデータ丸ごと（imageId,valueのオブジェクト）
 * @returns {function} upvoteCat 魚数を増やす（CatAPIに新しいvotesを登録する関数）
 */
export default function useAllCatVotes() {
  const [allCatVotes, setAllCatVotes] = useState([])

  /**
   * 【getAllCatVotes】全部のネコチャンのvoteをCatAPIから取ってきてallCatVotesに入れる関数 [GET]
   * @param {number} limit 1ページ分として、いくつのデータをとってくるか（これは今のところ固定で100）
   * @param {number} page ページ数　０始まり
   */
  const getAllCatVotes = (limit = 100, page = 0) => {
    const param = {
      limit,
      page,
    }
    const query_params = new URLSearchParams(param)

    fetch("https://api.thecatapi.com/v1/votes?" + query_params, {
      headers: DEFAULT_HEADER,
    }).then((res) => {
      res.json().then((data) => {
        setAllCatVotes((prev) => prev.concat(data))
      })
      let paginationCount = Number(res.headers.get("pagination-count"))
      if (paginationCount > limit * (page + 1)) {
        getAllCatVotes(limit, page + 1) // 次のページの情報を取ってくる
      }
    })
  }

  /**
   * 【upvoteCat】CatAPIに新しいvotesを登録する関数 [POST]
   * @param {string} imageId 新しく魚をもらったネコチャンのimageId
   */
  const upvoteCat = (imageId) => {
    const voteObj = {
      image_id: imageId,
      value: 1,
    }
    ///登録したい処理
    return (
      fetch("https://api.thecatapi.com/v1/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...DEFAULT_HEADER },
        body: JSON.stringify(voteObj),
      })
        //登録に成功したら、見た目的に変えたいからsetStateで該当のimageId持ってるネコチャンのcatInfoのvotesだけ+1setStateする
        .then((res) => res.json())
        .then((body) => {
          if (body.message === "SUCCESS") {
            // ダミーのVotesを登録しておく
            setAllCatVotes((prev) => prev.concat({ image_id: imageId }))
          } else {
            console.warn(`something went wrong: ${body.message}`)
          }
        })
        .catch((e) => {
          console.warn(e)
        })
    )
  }

  useEffect(() => {
    getAllCatVotes()
  }, [])

  return [allCatVotes, upvoteCat]
}
