///////////////////////////////////////////////////////////////////////////////////////////////
// ブラウザ側の処理
///////////////////////////////////////////////////////////////////////////////////////////////
import { useState, useEffect } from "react"

const DEFAULT_HEADER = { "x-api-key": process.env.NEXT_PUBLIC_CAT_API_KEY }
//const SUB_ID_DEFAULT = "your-user-korekana";

/**
 * 【useAllFavorites】CatAPIからお気に入りのネコチャン情報を取ってくる・CatAPIにお気に入りのネコチャンを登録・削除するカスタムフック。
 * ※subIdは、getAllFavorites、pushFavでのみ使用
 * @module
 * @param {string} subId
 * @returns {array} [allCatFavorites, pushFav, pushRemove, RefreshCatFavorites]
 * @returns {Object} allCatFavorites　指定のsubIdのお気に入りネコチャン情報
 * @returns {function} pushFav 　CatAPIにお気に入りを登録する関数
 * @returns {function} pushRemove CatAPIにお気に入り解除をさせる関数
 * @returns {function} RefreshCatFavorites お気に入りのネコチャン情報をリフレッシュする関数
 *
 */
export default function useAllFavorites(subId) {
  const [allCatFavorites, setAllCatFavorites] = useState([])

  const RefreshCatFavorites = () => {
    setAllCatFavorites([])
    getAllFavorites(subId)
  }

  /**
   * 【getAllFvorites】すべてのネコチャンのお気に入り情報をCatAPIから取ってきてallCatFavoritesに入れる関数 [GET]
   * @param {string} subId
   * @param {number} limit　1ページ分として、いくつのデータをとってくるか（これは今のところ固定で100）
   * @param {number} page　ページ数　０始まり
   */
  const getAllFavorites = (subId, limit = 100, page = 0) => {
    const param = {
      page,
      limit,
      sub_id: subId,
    }
    const query_params = new URLSearchParams(param)

    fetch("https://api.thecatapi.com/v1/favourites?" + query_params, {
      headers: DEFAULT_HEADER,
    }).then((res) => {
      res.json().then((data) => {
        const favArr = data.map((obj) => ({
          image_id: obj.image_id,
          favoriteId: obj.id,
          imageUrl: obj.image.url,
          created_at: obj.created_at,
         
        }))
        setAllCatFavorites((prev) =>
          prev.concat(favArr).sort((a, b) => {
            a.created_at < b.created_at ? -1 : 1
          })
        )
       
      })

      let paginationCount = Number(res.headers.get("pagination-count"))
      if (paginationCount > limit * (page + 1)) {
        getAllFavorites(subId, limit, page + 1) // 次のページの情報を取ってくる
      }
    })
  }

  /**
   * 【pushFav】CatAPIにお気に入りを登録する関数　[POST]
   * favボタンを押すと、お気に入り登録される
   * @param {string} imageId
   */
  const pushFav = (imageId) => {
    //APIに登録
    ///登録したいオブジェクト
    const favObj = {
      image_id: imageId,
      sub_id: subId,
    }
    //console.log("sending request", favObj)
    ///登録処理
    return (
      fetch("https://api.thecatapi.com/v1/favourites/", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...DEFAULT_HEADER },
        body: JSON.stringify(favObj),
      })
        //登録に成功したらまた今のお気に入り情報を取ってきてsetStateしてほしい
        .then((res) => res.json())
        .then((body) => {
          //setAllCatFavoritesもとりあえず更新(追加)しないと、正しく反映しない（次のライフサイクルメソッドまで最新の情報を取ってこれない）
          setAllCatFavorites((prevAllCatFavorites) =>
            prevAllCatFavorites.concat([
              { image_id: imageId, favoriteId: body.id },
            ])
          )
        })
    )
  }

  /**
   * 【pushRemove】CatAPIにお気に入り解除をさせる関数　[DELETE]
   * Removeボタンを押すと、お気に入り解除される
   * @param {string} imageId
   */
  const pushRemove = (imageId) => {
    //DELETEはimageidではなくfavorite_idでやるのでfavorite_idを取ってくる
    let favId = allCatFavorites
      .map((catfav) => {
        if (catfav.image_id === imageId) {
          return catfav.favoriteId
        }
      })
      .join("")

    //APIにDELETEお願いする
    ///APIへの処理ねがい
    return (
      fetch("https://api.thecatapi.com/v1/favourites/" + favId, {
        method: "DELETE",
        headers: DEFAULT_HEADER,
      })
        
        .then((res) => res.json())
        .then((body) => {
         
          setAllCatFavorites((prevAllCatFavorites) =>
            prevAllCatFavorites.filter((fav) => fav.image_id !== imageId)
          )
        })
    )
  }

  
  useEffect(() => {
    if (subId) {
      // subIdがundefinedのときは意味ないので読み込まない
      getAllFavorites(subId)
    } 
  }, [subId]) 

  return [allCatFavorites, pushFav, pushRemove, RefreshCatFavorites]
}
