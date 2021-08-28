import Button from "react-bootstrap/Button"
///////////////////////////////////////////////////////////////////////////////////////////////
// CatPage関係のコンポーネント
///////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 【CatPage】ページ番号とprev,nextボタンを表示するdefault function
 * @module
 * @param {object} props Propsとして引数を受け取る。
 * @param {array} props.catPageNum 表示するページが入った配列。[1,2,3]みたいな形。
 * @param {number} props.maxPageNum ページの最大数
 * @param {number} props.currentPage 現在のページ（＝クリックされたページ）
 * @param {function} props.getCats 選択した猫種の指定したページのネコチャンを取ってくる関数
 * @param {string} props.searchBreeds 選択した猫種
 */
export default function CatPage({
  catPageNum,
  maxPageNum,
  currentPage,
  getCats,
  searchBreeds,
}) {
  let prev =
    currentPage <= 1 ? (
      ""
    ) : (
      <CatPagePrev
        currentPage={currentPage}
        getCats={getCats}
        searchBreeds={searchBreeds}
      />
    )
  let next =
    currentPage === 0 || currentPage === maxPageNum ? (
      ""
    ) : (
      <CatPageNext
        currentPage={currentPage}
        getCats={getCats}
        searchBreeds={searchBreeds}
      />
    )

  return (
    <table className="table" align="center">
      <tbody>
        <tr>
          <td>{prev}</td>

          <td>
            {catPageNum.map((page) => (
              <CatPageNum
                key={page}
                catPageNum={page}
                getCats={getCats}
                searchBreeds={searchBreeds}
              />
            ))}
          </td>
          <td>{next}</td>
        </tr>
      </tbody>
    </table>
  )
}
/**
 * 【CatPagePrev】Prevを押すと今のページ-１をCatSearch関数に渡す
 * @param {object} props Propsとして引数を受け取る。
 * @param {number} props.currentPage 現在のページ（＝クリックされたページ）
 * @param {function} props.getCats 選択した猫種の指定したページのネコチャンを取ってくる関数
 * @param {string} props.searchBreeds 選択した猫種
 */
export function CatPagePrev({ currentPage, getCats, searchBreeds }) {
  return (
    <Button
      variant="outline-primary"
      onClick={() => getCats("search", searchBreeds, currentPage - 1)}
    >
      Prev＜&nbsp;
    </Button>
  )
}
/**
 * 【CatPageNext】Nextを押すと今のページ+１をCatSearch関数に渡す
 * @param {object} props Propsとして引数を受け取る。
 * @param {number} props.currentPage 現在のページ（＝クリックされたページ）
 * @param {function} props.getCats 選択した猫種の指定したページのネコチャンを取ってくる関数
 * @param {string} props.searchBreeds 選択した猫種
 */
export function CatPageNext({ currentPage, getCats, searchBreeds }) {
  return (
    <Button
      variant="outline-primary"
      onClick={() => getCats("search", searchBreeds, currentPage + 1)}
    >
      &nbsp;＞Next
    </Button>
  )
}
/**
 * 【CatPageNum】ページ番号を押すと押したページ番号をCatSearch関数に渡す
 * @param {object} props Propsとして引数を受け取る。
 * @param {number} props.catPageNum 表示するページ
 * @param {function} props.getCats 選択した猫種の指定したページのネコチャンを取ってくる関数
 * @param {string} props.searchBreeds 選択した猫種
 */
export function CatPageNum({ getCats, searchBreeds, catPageNum }) {
  return (
    <Button
      variant="outline-primary"
      onClick={() => getCats("search", searchBreeds, catPageNum)}
    >
      {catPageNum}
    </Button>
  )
}
