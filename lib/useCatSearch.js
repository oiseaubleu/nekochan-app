///////////////////////////////////////////////////////////////////////////////////////////////
// ブラウザ側の処理
///////////////////////////////////////////////////////////////////////////////////////////////
import { useState, useEffect } from "react"

const DEFAULT_HEADER = { "x-api-key": process.env.NEXT_PUBLIC_CAT_API_KEY }

/**
 * 【useCatSearch】CatAPIから検索したネコチャンをもってくる・ページ番号の設定をする カスタムフック
 * @module
 * @param {string} searchedCatBreeds ネコチャンの種類を表す文字列
 * @param {number} pushPageNum 押された数字（1ページ目＝１）
 * @returns {Object} [catPageNum, currentPage, maxPageNum, catImageInfo, searchCat]
 *  @returns {array}　catPageNum　表示するページ番号（数字）の羅列
 *  @returns {number}　currentPage　現在のページ（＝クリックされたページ）
 *  @returns {number}  maxPageNum　最大ページ数
 *  @returns {Object}　catImageInfo　検索した結果のネコチャン情報のオブジェクト
 *  @returns {function}　searchCat ネコチャン情報の取得・ページ番号の設定等の関数
 *
 */

export default function useCatSearch() {
  const [catPageNum, setCatPageNum] = useState([]) //表示するページが入った配列。[1,2,3]みたいな形。
  const [currentPage, setCurrentPage] = useState(0) //現在のページ（＝クリックされたページ）
  const [maxPageNum, setMaxPageNum] = useState(0) //ページの最大数。数字。
  const [catImageInfo, setCatImageInfo] = useState([]) //配列に入った🐈情報 [{ imageId ,imageUrl , votes, favorite }]

  /**
   * 【searchCat】
   * CatAPIから検索した猫種のネコチャン情報を取ってくる（catImageInfo） [GET]
   * 最大ページ数をsetする(maxPageNum)
   * 表示するページ番号の配列をsetする(catPageNum・createCatPageNum)
   * @param {string} searchedCatBreeds 検索する猫種
   * @param {number} pushPageNum ページ番号　初期値は１
   */
  const searchCat = (searchedCatBreeds, pushPageNum = 1) => {
    //console.log(`searchCat called with ${searchedCatBreeds} and ${pushPageNum}`)
    // [2.各種検索結果管理用のStateをHookを使った書き方に変更する]
    setCatImageInfo([])
    setCatPageNum([])
    setCurrentPage(pushPageNum)

    //検索種類未入力で検索ボタンだけ押すと全部の🐈がでてくるって設定
    const param = {
      limit: 5,
      page: pushPageNum - 1,
      order: "Asc",
    }
    if (searchedCatBreeds) {
      param["breed_id"] = searchedCatBreeds
    }

    const query_params = new URLSearchParams(param)
    //ページの設定と、catInfoの中身全部の設定
    return (
      fetch(`https://api.thecatapi.com/v1/images/search?` + query_params, {
        headers: DEFAULT_HEADER,
      })
        .then((res) => {
          // setMaxPageNum() を呼んだあと、反映されるまでに時間がかかるので、一時的な変数に格納する。
          // setCatPageNum() に渡す必要があるため。（渡さないと、初期値0が渡されてページネーションが出ないことがある）
          const maxPageNumTemp = Math.ceil(
            Number(res.headers.get("pagination-count")) / 5
          )
          setMaxPageNum(maxPageNumTemp)
          setCatPageNum(createCatPageNum(pushPageNum, maxPageNumTemp))
          return res.json()
        })
        //setCatInfoするのはvotesとかも必要だから、search.jsのほうでやる ①bodyまるごと渡してsearch.jsでまとめてやる②votesとfavoriteだけsearch.jsでやる
        .then((body) => {
          const infoArr = body.map((obj) => ({
            imageId: obj.id,
            imageUrl: obj.url,
    
          }))

          setCatImageInfo(infoArr)
         // console.log("now catImageInfo is: ", catImageInfo)
        })
    )
  }

  /**
   * 【createCatPageNum】pageの配列を作る関数
   *
   * 開始番号：
   * * 基本ルール = 選択したページ番号 ― 2
   * * 例外ルール = 選択したページ番号 <= 2 のときは、1
   *
   * 終了番号：
   * * 基本ルール = 選択したページ番号 + 2
   * * 例外ルール = 選択したページ番号+２が最大ページよりも大きいとき：最大ページが終了番号になる
   * * 例外ルール = 選択したページ <= 2 かつ 最大ページ >= 4 のとき、
   *
   * @param {number} pushPageNum クリックされたページ番号
   * @param {number} maxPageNum 最高ページ数
   * @returns {Array} stateのcatPageNumに突っ込む配列
   */
  const createCatPageNum = (pushPageNum, maxPageNum) => {
    console.log(pushPageNum, maxPageNum)
    const pageNumArr = []
    const startPage = Math.max(1, pushPageNum - 2)
    let endPage = pushPageNum + 2
    if (pushPageNum + 2 > maxPageNum) {
      endPage = maxPageNum
    }
    if (pushPageNum <= 2 && maxPageNum >= 4) {
      endPage = maxPageNum === 4 ? 4 : 5
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumArr.push(i)
    }
    return pageNumArr
  }

  return [catPageNum, currentPage, maxPageNum, catImageInfo, searchCat]
}
