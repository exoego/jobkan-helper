<p align="center">
<img src="docs/hero_image_2.png" alt="ジョブカン勤怠ヘルパー"/>
</p>

# jobkan-helper

ジョブカン勤怠を便利にする **非公式** Web ブラウザ拡張です。<br>

## インストール

| Google Chrome | Mozilla Firefox |
|---|---|
| [![ジョブカン勤怠ヘルパー on Chrome ウェブストア](docs/chrome_webstore_border.png "Chrome ウェブストアリンク")](https://chrome.google.com/webstore/detail/kkcgojenedjkbechhjdkbklolhchfbjn?hl=ja) | [リリース一覧](https://github.com/exoego/jobkan-helper/releases) <br>Addon ADD-ONS では公開しておりません。<br>GitHub リリースページからインストールします。 |

## ご利用前に

このツールは、ジョブカンを便利にしたい **有志** の開発者によって開発、無償公開されています。

このツールは、**無保証** です。<br>
ジョブカンの仕様が不明な点がある中で作っているため、ミスがあるかもしれません。このツールによっていかなる不利益が生じましても、一切の保証をいたしません。<br>
なにか不具合を見つけたり、こうしたらより便利になるというアイデアをご報告いただけると、できる限り努力しますが、対応できないこともあります。<br>
あらかじめご了承いただける方のみご利用ください。

このツールは **非公式** です。<br>
ツールに関する要望や問い合わせなどは、ジョブカンの公式開発元やその関係者へのご迷惑にならないよう、
https://github.com/exoego/jobkan-helper で行ってください。<br>

## 本ツールの機能 

* ジョブカン勤怠管理
  * 出勤簿
    * 過不足自動計算: 月末に向けた稼働時間を調整しやすいように、休暇を含めた過不足を自動計算します

## 本ツールの開発方法

本ツールは、機能追加や不具合追加の貢献を歓迎しています。<br>

1. `npm install`
2. `npm run start:chrome` または `npm run start:firefox`
3. 起動したブラウザでジョブカンにログインする
4. 変更した機能を試したいジョブカンのページを開く
5. ソースコードを編集する
6. ジョブカンのページをリロードし、変更を試す。もっと編集する場合は 5に戻る）
7. 完成したらプルリクエストを送る

## バージョン履歴

バージョン履歴は https://github.com/exoego/jobkan-helper/releases をご覧ください。
