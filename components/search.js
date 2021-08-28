///////////////////////////////////////////////////////////////////////////////////////////////
// ネコ検索関係のコンポーネント
///////////////////////////////////////////////////////////////////////////////////////////////
import React, { useEffect, useState } from "react"
import InputBreed from "react-select"
import catBreedsList from "../lib/catBreedsList.json"
import Row from "react-bootstrap/Row"
import CatRow from "./CatRow"
import CatPage from "./CatPage"

let catBreedList = catBreedsList

const isClearable = true

/**
 * 【CatSearch】ネコ検索のためのdefault function
 * @module
 * @param {object} props Propsとして引数を受け取る。
 * @param {boolean} props.isGuest ゲストかどうかのboolean
 * @param {object} props.catInfo 検索結果のネコチャン情報
 * @param {function} getCats 指定したモードでの、ネコチャン情報を取得・モードの更新をする関数
 * @param {object} pageInfo pageInfo: { catPageNum, currentPage, maxPageNum } ページ番号等の情報が入ったオブジェクト
 * @param {function} pushFav CatAPIにお気に入りを登録する関数
 * @param {function} removeFav お気に入り解除する関数
 * @param {function} upvoteCat 魚数を増やす（CatAPIに新しいvotesを登録する関数）
 *
 */

export default function CatSearch({
  isGuest,
  catInfo,
  getCats,
  pageInfo = {},
  pushFav,
  removeFav,
  upvoteCat,
}) {
  const [searchBreeds, setSearchBreeds] = useState()
  const { catPageNum = [], currentPage = 1, maxPageNum = 1 } = pageInfo

  return (
    <div>
      <Row>&nbsp;&nbsp; Breeds：</Row>
      <Row>&nbsp;&nbsp;&nbsp;You can search leave breeds blank!</Row>
      <InputBreed
        options={catBreedList}
        isClearable={isClearable}
        onChange={
          (
            objOfCatBreed //選んだやつがここに入る
          ) => setSearchBreeds(objOfCatBreed ? objOfCatBreed.value : null)
          /* isMultiがあると、value = [{ value: 'abys' }, ...]
             isMultiがないと、value = { value: 'abys' } 。配列じゃなくなる！
         */
        }
        instanceId="searchID"
      />
      <SearchButton getCats={getCats} searchBreeds={searchBreeds} />
      <CatsList
        catInfoArr={catInfo}
        CatGreet={upvoteCat} // upvoteCatに名前変えてもいいかも
        saveAsFav={pushFav}
        removeFav={removeFav}
        isGuest={isGuest}
      />
      <br></br>
      <CatPage
        catPageNum={catPageNum}
        getCats={getCats}
        searchBreeds={searchBreeds}
        currentPage={currentPage}
        maxPageNum={maxPageNum}
      />
    </div>
  )
}

/**
 * 【SearchButton】検索ボタン。指定した血統種(なくても可)で検索する。SearchButtonをおすとgetCats関数にsearchBreedsで受け取った文字列、もしくは空を引数として渡す
 *  @param {object} props Propsとして引数を受け取る。
 *  @param {function} props.getCats 指定したモードでの、ネコチャン情報を取得・モードの更新をする関数
 *  @param {string[]} props.searchBreeds 検索対象の血統種。なくても可。
 */
export function SearchButton({ getCats, searchBreeds }) {
  return (
    <div className="component-search-button">
      <button
        className="btn btn-info"
        type="button"
        onClick={() => getCats("search", searchBreeds)}
      >
        Search😺
      </button>
    </div>
  )
}

/**
 * 【CatsList】検索結果を表示させる
 * @param {object} props Propsとして引数を受け取る。
 * @param {object[]} props.catInfoArr 検索した結果のネコの情報がオブジェクトで配列に入っている [{ imageId ,imageUrl , votes, favorite }]
 * @param {function} props.CatGreet 押すとvotesに+1する関数
 * @param {function} props.saveAsFav 押すとお気に入り保存する関数
 * @param {function} props.removeFav 押すとお気に入りから削除する関数
 * @param {boolean} props.isGuest ゲストユーザーかどうかのBoolean
 */
export function CatsList({
  catInfoArr = [],
  CatGreet,
  saveAsFav,
  removeFav,
  isGuest,
}) {
  return (
    <table className="table" align="center">
      <tbody>
        {catInfoArr.map((info) => (
          <CatRow
            catInfo={info}
            CatGreet={CatGreet}
            key={info.imageId}
            saveAsFav={saveAsFav}
            removeFav={removeFav}
            isGuest={isGuest}
          />
        ))}
      </tbody>
    </table>
  )
}
