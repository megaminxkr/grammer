# Verification record

実施日: 2026-10-22（日本時間）。この記録はPhase 1の実行結果です。ブラウザーの実画面検証と、静的成果物の検証を区別します。

| 検証 | 結果 |
| --- | --- |
| `npm ci` | 成功。lockfileから318パッケージを再インストール。 |
| `npm run check` | 成功。Astro/TypeScriptのエラー・警告・ヒント0件。 |
| `npm test` | 成功。12件。ID/スキーマ/校閲情報/依存参照/循環/公開制御/base処理。 |
| `npm run validate:content` | 成功。26章・130設計単元・3教材、10問題の構造と参照を検証。reviewedは0件。 |
| `npm run build` | 成功。31 HTMLページ。内部リンク・base・lang・canonical・sitemap・未公開教材除外を検証。 |
| `npm run build:review` | 成功。34 HTMLページ。3教材、10問の解説、構造図、単一H1、noindex、sitemapなしを成果物で検証。 |
| 校閲版→公開版の切り替え | 成功。生成ディレクトリを消去し、未公開ページや古いsitemapの残留を防止。 |
| `npm run test:e2e -- --list` | 成功。desktop/mobileで合計8ケースを認識。これはテスト実行成功を意味しない。 |
| Playwrightブラウザー導入 | 失敗。ダウンロードしたChromiumアーカイブが破損し、展開できない。 |
| Playwright E2E実行 | GitHub Actionsで成功。PC・モバイル幅のChromiumで8/8件成功（10.6秒）。静的な校閲成果物をプレビューして確認。ローカルではブラウザー導入失敗のため未実施。 |
| クラウドブラウザーでの実画面確認 | 未完了。ローカルプレビューの起動は成功したが、ブラウザーのURLセキュリティポリシーがアクセスを拒否。 |
| スマートフォン実機・WebKit・支援技術 | 実機・WebKit・支援技術は未検証。Chromiumのモバイル幅E2Eは成功。 |
| 秘密情報パターン検査 | 作成ソースに既知形式のキー・トークン・秘密鍵パターンの一致なし。包括的な秘密検出保証ではない。 |
| GitHub Pages設定変更・公開 | 未実施。所有者の確認前にSettingsや権限を変更していない。 |

主要ページ・3教材の表示、画面遷移、解答開閉、表示設定の保存、ストレージ拒否時の動作はCIのChromiumで確認済みです。手動での実画面確認・実機iOS/WebKit・スクリーンリーダー・WCAG 2.2 AA監査は未完了です。人間の教材校閲も未実施のため、3原稿はすべてin-reviewです。

[成功したCI実行](https://github.com/megaminxkr/grammer/actions/runs/39724228297)（コードコミット `abbadeae1dcbc6c02112cc5b027de06c7851b650`）。その後の検証記録・README更新は文書のみで、アプリケーションコードの変更はありません。
