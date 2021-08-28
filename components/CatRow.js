///////////////////////////////////////////////////////////////////////////////////////////////
// CatList関係のコンポーネント
///////////////////////////////////////////////////////////////////////////////////////////////
import Button from "react-bootstrap/Button"
import Image from "next/image"

/**
 *【CatRow】検索結果を表示させる default function
 * @module
 * @param {object} props Propsとして引数を受け取る。
 * @param {object[]}  props.catInfo 検索結果のネコチャン情報のオブジェクトが入った配列
 * @param {function}  props.saveAsFav Favoriteボタンを押したときに動く関数
 * @param {function}  props.removeFav Delete from Favoriteを押したときに動く関数
 * @param {function}  props.CatGreet 押すとvotesに+1する関数
 * @param {Boolean}  props.isGuest ゲストユーザーかどうかのBoolean
 */
export default function CatRow({
  catInfo,
  saveAsFav,
  removeFav,
  CatGreet,
  isGuest,
}) {
  //ゲストユーザーだったら、FavZoneは表示しない
  let FavoriteZone
  if (!isGuest) {
    FavoriteZone = (
      <FavZone
        fav={catInfo.favorite}
        saveAsFav={saveAsFav}
        removeFav={removeFav}
        imageId={catInfo.imageId}
      />
    )
  }
  return (
    <tr>
      <td>{FavoriteZone}</td>
      <td>
        <CatImage
          imageUrl={catInfo.imageUrl}
          imageId={catInfo.imageId}
          fav={catInfo.favorite}
        />
      </td>
      <td>
        <CatVotesNum votes={catInfo.votes} />
      </td>
      <td>
        <CatGreetButton catimage_id={catInfo.imageId} CatGreet={CatGreet} />
      </td>
    </tr>
  )
}

/**
 *【FavZone】検索結果の１行（１画像）のお気に入りボタン
 * @param {object} props Propsとして引数を受け取る。
 * @param {(object|undefined)}  props.fav ネコチャンがお気に入りされているかどうか。お気に入りされていればネコチャン情報がオブジェクトで入り、お気に入りされていなければundefinedが入る
 * @param {string}  props.imageId ネコチャンのimageId
 * @param {function}  props.saveAsFav Favoriteボタンを押したときに動く関数
 * @param {function}  props.removeFav Delete from Favoriteを押したときに動く関数
 */
function FavZone({ fav, saveAsFav, imageId, removeFav }) {
  return (
    <div>
      <Favorite fav={fav} saveAsFav={saveAsFav} catimage_id={imageId} />
      <br></br>
      <DeleteFavorite fav={fav} removeFav={removeFav} catimage_id={imageId} />
    </div>
  )
}
/**
 *【Favorite】すでにお気に入りのネコチャンだったら "Your favorite cat!"、そうでなかったらfavボタンを表示させる
 * @param {object} props Propsとして引数を受け取る。
 * @param {(object|undefined)}  props.fav ネコチャンがお気に入りされているかどうか。お気に入りされていればネコチャン情報がオブジェクトで入り、お気に入りされていなければundefinedが入る
 * @param {string}  props.catimage_id ネコチャンのimageId
 * @param {function}  props.saveAsFav Favoriteボタンを押したときに動く関数
 */
function Favorite({ fav, saveAsFav, catimage_id }) {
  let buttonChange
  if (fav) {
    buttonChange = "Your favorite cat!"
  } else {
    buttonChange = (
      <Button variant="outline-info" onClick={() => saveAsFav(catimage_id)}>
        <Image src="/images/smallneko.png" height={32} width={32} alt="送信" />
        fav💛
      </Button>
    )
  }
  return <div>{buttonChange}</div>
}
/**
 *【DeleteFavorite】お気に入りのネコチャンの場合のみ、Remove from FAVボタンを表示させる
 * @param {object} props Propsとして引数を受け取る。
 * @param {(object|undefined)}  props.fav ネコチャンがお気に入りされているかどうか。お気に入りされていればネコチャン情報がオブジェクトで入り、お気に入りされていなければundefinedが入る
 * @param {string}  props.catimage_id ネコチャンのimageId
 * @param {function}  props.removeFav Delete from Favoriteを押したときに動く関数
 */
function DeleteFavorite({ fav, removeFav, catimage_id }) {
  let deleteButtonChange
  if (fav) {
    deleteButtonChange = (
      <Button variant="outline-danger" onClick={() => removeFav(catimage_id)}>
        Remove from FAV
      </Button>
    )
  }
  return <div>{deleteButtonChange}</div>
}
/**
 *【CatImage】ネコチャンの画像を表示させる
 * @param {object} props Propsとして引数を受け取る。
 * @param {(object|undefined)}  props.fav ネコチャンがお気に入りされているかどうか。お気に入りされていればネコチャン情報がオブジェクトで入り、お気に入りされていなければundefinedが入る
 * @param {string}  props.imageId ネコチャンのimageId
 * @param {string}  props.imageUrl ネコチャンの画像のURL
 */
function CatImage({ fav, imageUrl, imageId }) {
  return (
    <div style={{ position: "relative", height: "200px", width: "200px" }}>
      <Image
        src={imageUrl}
        layout="fill"
        objectFit="scale-down"
        alt="Oops!  He/She looks shy..."
        align="right"
      />
    </div>
  )
}
/**
 *【CatVotesNum】ネコチャンが持っている魚の数の表示
 * @param {number}  props.votes ネコチャンが持っている魚の数
 */
function CatVotesNum({ votes }) {
  return (
    <div>
      🐟 {votes}
      <br></br>
    </div>
  )
}
/**
 *【CatGreetButton】ネコチャンにお魚をあげるボタンを表示させて、魚数を増やすボタン
 * @param {object} props Propsとして引数を受け取る。
 * @param {function}  props.CatGreet 押すとvotesに+1する関数
 * @param {string}  props.catimage_id ネコチャンのimageId
 */
function CatGreetButton({ CatGreet, catimage_id }) {
  return (
    //押すと何が起こるのか？⇒①voteのapiにpostされ、value:1が登録される ②setStateでvotes+1される
    <div>
      <Button variant="outline-info" onClick={() => CatGreet(catimage_id)}>
        <Image src="/images/fish1.png" height={32} width={32} alt="送信" />
      </Button>
    </div>
  )
}
