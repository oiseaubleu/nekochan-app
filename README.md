This is a starter template for [Learn Next.js](https://nextjs.org/learn).

## 全体の構成

![img](docs/System%20Overview.svg)

## 画面遷移

![img2](docs/Screen%20transition.svg)

## ディレクトリ構成

```
project_root/
├─components
├─docs
├─lib
├─pages
│  └─api
│      └─users
├─public
│  │─images
│  └─jsdoc
└─styles
```

- components
  - コンポーネント
- docs
  - swaggerで表示するyamlファイルなど、ドキュメント関係の置き場所
- lib
  - カスタムフックにした何度も呼ぶ関数とか色々便利グッズが入っている。そのうちクライアント側のものと、NEXT 側のものとフォルダを分ける予定。
- pages
  - Nextjs で表示されるページコンポーネントを配置する。
- pages/api
  - サーバー(next とか)側で動く API の置き場所
- pages/api/users
  - ログイン処理、ユーザー関連処理の API
- public
  - 静的ファイルを配置する。
- public/images
  - コンポーネントで使う画像の置き場所
- public/jsdoc
  - JSDoc関連の置き場所
- styles
  - 全体のスタイルを配置する。

## ローカル環境のセットアップ

`.env.local` に以下の情報を記載する。

* `AWS_ACCESS_KEY_ID`: AWSのアクセスキー。DynamoDBおよびSESを使うために利用。
* `AWS_SECRET_ACCESS_KEY`: AWSのSecret。同上。
* `AWS_REGION`: AWSのリージョン。お好みで。
* `IRONSESSION_KEY`: Iron-sessionでセッションのキーとして利用する文字列。
* `CAT_API_KEY`: [Cat API](https://thecatapi.com/) のAPI Key。