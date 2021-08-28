import "../styles/global.css"
import Link from "next/link"
import { SWRConfig } from "swr"
import fetch from "../lib/fetchJson"
import Container from "react-bootstrap/Container"
/**
 *【App】 すべてのページに共通して設定するもの
 * @module
 * @param {page} props.Component アクティブなページ
 * @param {object} props.pageProps 　サーバサイドレンダリングとかで先に作ってあるpropsがある場合はここに入る。なければ空。
 */
export default function App({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        onError: (err) => {
          console.error(err)
        },
      }}
    >
      <Container>
        <h1 className="py-5">
          <Link href="/top">
            <a>NEKOCHAN😺</a>
          </Link>
        </h1>
        <Component {...pageProps} />
      </Container>
    </SWRConfig>
  )
}
