# English Grammar Atlas

日本の高校生・大学受験生向けの英文法学習サイト。文法の正確性と理解しやすさを優先し、GitHub Pagesで無料運用できる完全静的構成です。

**Phase 1 + 最小限の教材閲覧を実装。26分野・130小単元を設計。原稿3本はすべて `in-review`（人間の校閲前）です。公開ビルドに教材本文はまだ含まれません。**

## Quick start

Node **24.19.0** / npm **11.x**（`.nvmrc`参照）。Windowsでも同じnpmコマンドで動作します。

```bash
npm ci
npm run dev:review
```

表示されたURLの `/grammer/` を開きます。校閲プレビューではホーム→サンプル教材、または章1・3・12から3教材を閲覧できます。`npm run dev` も校閲用です。`npm run dev:public` は公開状態だけを表示します。

```bash
npm run verify
npm run build:review  # 人間の校閲用。公開禁止
npm run preview      # 直前のdistを表示。公開・校閲ビルドの区別に注意
```

`build:review` はnoindex・サイトマップなしです。配備前には必ず `npm run build` で公開版に作り直してください。

## 実装済み

- Astro/strict TypeScript/MDX/Tailwind/Zod・Content Collections。
- レスポンシブなホーム、26章の一覧・章ページ、汎用教材ページ、学習ガイド。
- パンくず、PCの章ナビ・ページ内目次、モバイルの折りたたみナビ、前後・関連・前提リンク。
- 著者指定のS/V/O/C/M表示、主節・従属節と修飾関係・省略の説明用コンポーネント。
- 独自教材3本、確認問題と開閉可能な解説（手動確認。自動採点は未実装）。
- ダークモード・文字サイズ設定（localStorage。保存不能時も利用可）。
- 校閲状態による公開制御、スキーマ・参照・循環・公開リンクの検証、SEO、CI/CD定義。

## 未実装

Reactによる対話型演習、学習履歴・ブックマーク・復習・JSON入出力、Pagefind全文検索、用語集、KaTeX、知識グラフ、PWA。これらの不要な依存関係はまだ追加していません。

## ディレクトリ

```text
src/
  components/        共通UI・構文表示
  content/lessons/    MDX教材本文
  data/              カリキュラム・確認問題（本文と独立）
  layouts/           SEOと共通レイアウト
  lib/               スキーマ・公開制御・URL
  pages/             静的ルート
  styles/            共通デザイン
scripts/             コンテンツ検証・出力リンク検証
tests/              unit / e2e
docs/               設計・カリキュラム・執筆規則
.github/workflows/   CIとPages配備
```

## テスト

```bash
npm run check
npm run validate:content
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

E2EはPC・モバイル幅でページ遷移、3教材、解答開閉、表示設定の保存、保存拒否時の動作を確認します。学習記録のE2Eは機能実装時に追加します。既存のプレビューを使う場合は `E2E_BASE_URL` にoriginを設定します。CIは校閲ビルドでサンプルをテストした後、別途公開ビルドを作り、未公開教材が配備されないことを検証します。

実行済みの結果と確認できていない範囲は [検証記録](docs/verification.md) を参照してください。

## GitHub Pages

リポジトリ名は **grammer** です。プロジェクト名はEnglish Grammar Atlasです。

1. 所有者の承認の下で、Settings → Pages → Sourceを **GitHub Actions** にします。
2. mainへのpushでCIが成功すると、同じworkflowのdeployジョブが公開版のみを配備します。
3. 公開予定URL: `https://megaminxkr.github.io/grammer/`。

`site` は `https://<owner>.github.io`、`base` は `/<repository>` を `GITHUB_REPOSITORY` から導出します。ローカル既定値は `megaminxkr/grammer`。`SITE_URL` と `BASE_PATH` で独自ドメイン等に変更可能です（サイト設定変更は別途承認）。ユーザーサイトならbaseは `/`。全内部リンク・アイコン・canonical・robotsのsitemapはbaseに対応します。

PRではcontents readのみ、deployジョブだけpages write/id-token writeを要求します。これはworkflowファイルの宣言であり、作成者がGitHubの設定を変更したという意味ではありません。Pagesが無効な間、deployは失敗するため設定確認後に再実行してください。

## 教材を公開するには

人間が原稿・例文・解答・制約を校閲した後、その人の許可を得て次の情報を追記します。

```yaml
status: reviewed
review:
  reviewer: 実際の校閲者名または承認されたチーム名
  reviewedAt: '2026-10-22'
  method: human
```

これは手順の例で、現在のサンプルが校閲済みであることを意味しません。GitHubのPublicソースに原稿は含まれます。静的サイトからの除外はソースの秘匿ではありません。

## ドキュメント

[Architecture](docs/architecture.md) · [Curriculum](docs/curriculum.md) · [Content guidelines](docs/content-guidelines.md) · [Roadmap](docs/roadmap.md) · [Contributing](CONTRIBUTING.md)

ライセンスは[ソフトウェア](LICENSE-CODE.md)と[教材](LICENSE-CONTENT.md)を分離しています。所有者のライセンス決定前に、Publicであることを再利用許諾と解釈しないでください。
