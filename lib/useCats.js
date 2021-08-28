import { useState, useEffect } from "react"

import useCatSearch from "./useCatSearch"
import useAllFavorites from "./useAllFavorites"
import useAllCatVotes from "./useAllCatVotes"

/**
 * 【useCat】ネコチャン検索をした結果と、お気に入りしたネコチャン情報を統合したカスタムフック
 * @module
 * @param {string} subId ユーザのsubId
 * @returns {object} cats ネコチャン情報の入ったオブジェクト
 * @returns {function} getCats 指定したモードでの、ネコチャン情報を取得・モードの更新をする関数
 * @returns {function} switchMode モードの更新をする関数
 * @returns {object} pageInfo: { catPageNum, currentPage, maxPageNum } ページ番号等の情報が入ったオブジェクト
 * @returns {function} pushFav CatAPIにお気に入りを登録する関数
 * @returns {function} removeFav CatAPIにお気に入り解除をさせる関数
 * @returns {function} upvoteCat 魚数を増やす（CatAPIに新しいvotesを登録する関数）
 *
 */
export default function useCats(subId) {
  const [catPageNum, currentPage, maxPageNum, catImageInfo, searchCat] =
    useCatSearch()
  const [allCatFavorites, pushFav, removeFav, refreshCatFavorites] =
    useAllFavorites(subId)
  const [allCatVotes, upvoteCat] = useAllCatVotes()

  // 上記の情報を統合するリスト
  const [cats, setCats] = useState([])
  // 検索モードを管理するためのフラグ
  const [searchMode, setSearchMode] = useState("search")

  /**
   * ネコチャンを取得する。結果的にこのカスタムフックが返す `cats` が更新される。
   *
   * - `saerch`: ネコチャンの品種で検索する
   * - `fav`: ネコチャンのお気に入りの種類一覧で検索する。
   * @param {string} mode ネコチャンの検索方法。 `search` または `fav` のどちらか。
   * @param {string} breed ネコチャンの品種。 `null` でもオッケー。
   * @param {number} pageNum ネコチャンを `search` したときのページ番号
   */
  const getCats = (mode, breed, pageNum = 1) => {
    if (mode === "search") {
      setSearchMode("search")
      searchCat(breed, pageNum)
    } else if (mode === "fav") {
      setSearchMode("fav")
      refreshCatFavorites()
    }
  }

  const switchMode = (mode) => {
    setSearchMode(mode)
  }

  /**
   * ネコチャン一覧、お気に入り情報、いいね情報が更新された場合に、cats情報を更新する。
   * これらの一覧を統合しておく。
   */
  useEffect(() => {
    if (searchMode === "search") {
      // catImageInfoをもとに更新する
      setCats(
        catImageInfo.map((cat) => {
          //fav {(object|undefined)}  ネコチャンがお気に入りされているかどうか。お気に入りされていればネコチャン情報がオブジェクトで入り、お気に入りされていなければundefinedが入る
          const fav = getFav(allCatFavorites, cat.imageId)
          return {
            ...cat,
            votes: getVotes(allCatVotes, cat.imageId),
            favorite: fav,
          }
        })
      )
    } else if (searchMode === "fav") {
      setCats(
        allCatFavorites.map((cat) => {
          return {
            imageId: cat.image_id,
            imageUrl: cat.imageUrl,
            votes: getVotes(allCatVotes, cat.image_id),
            favorite: cat,
          }
        })
      )
    }
  }, [searchMode, catImageInfo, allCatFavorites, allCatVotes])

  return {
    cats,
    getCats,
    switchMode,
    pageInfo: { catPageNum, currentPage, maxPageNum },
    pushFav,
    removeFav,
    upvoteCat,
  }
}

/**
 * 指定したimageIdのネコチャンがお気に入りになっているかどうか返す
 *
 * @param {object[]} allCatFavorites 指定のsub_idを持つユーザのお気に入り🐈配列
 * @param {string} imageId image_id
 * @returns {(object|undefined)} お気に入り登録されてるかどうかの結果 その猫がお気に入り情報になかったらundefined、あればオブジェクトが入る
 */
const getFav = (allCatFavorites, imageId) => {
  return allCatFavorites.filter((neko) => neko.image_id === imageId).pop()
}

/**
 * Votes全体から、渡されたネコチャンのIDに該当するものだけを取ってくる。
 * 返り値はそのネコチャン向けのVotes。
 *
 * @param {object[]} allVotes  取ってきたVotes全体。
 * @param {string} imageId  ネコチャンのID
 * @returns {number}  そのネコチャンのVotes
 */

const getVotes = (allVotes, imageId) => {
  return allVotes.filter((obj) => obj.image_id === imageId).length
}
