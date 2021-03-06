![result](https://github.com/kde-space/TO_DO_APP/blob/images/demo.gif)

## 概要
JavaScript設計の学習のために作成した簡易的なTO DO アプリです。  
https://kde-space.github.io/TO_DO_APP/index.html

## 機能
- タスクごとに優先度（3段階）、期限を設定可
- タスクに設定した期限と、本日とを比較して状況を表示
- タスクをステータスに応じて各々色分け  
![result](https://github.com/kde-space/TO_DO_APP/blob/images/task_color.PNG) 
    - 優先度「高」：黄
    - 優先度「中」：白
    - 優先度「低」：青
    - 期限超過：赤
    - 完了済み：グレー

- 入力したタスクの編集可
- 完了済みのタスク、全てのタスクを一括削除可
- 並べ替え可（優先度順 あるいは 期限順）
- レスポンシブ対応
- データの自動保存（local storage）
- タスクの総数、タスク完遂率などを常に表示

## 仕様
### 技術選定
- JavaScriptはフレームワークやライブラリは使用せずにピュアなJavaScript（ES2015）で作成
- CSSはフレームワークにBootStrap4を使用

### 推奨環境（動作確認済み）
#### PC
- windows 10
    - Google Chrome
    - Microsoft Edge
#### SP
- iOS 11.3+
    - Safari
    - Google Chrome

## 使い方
### タスクを登録する
フォームエリアからタスクを入力して、「追加」をクリックします。

- 「内容」と「優先度（初期値：中）」は必須です。
- 「期限」は初期値で【本日の日付】が登録されています。
- 入力途中で「クリア」をクリックすると入力欄が空になります。

### タスクを編集する
編集したいタスクの「編集」ボタンをクリックします。  
モーダルウィンドウが表示されるので、「タスクを登録する」と同じ要領で編集したい項目を編集し、「完了」ボタンをクリックすると登録されます。

- 「×」ボタンもしくはモーダルウィンドウ外をクリックすると編集を行わずにモーダルウィンドウが閉じます。（つまり何も行わない）
- ここでも「内容」と「優先度」は必須項目のため空の状態で登録はできません。

### タスクを完了状態にする
タスクの「完了」チェックボックスをクリックして、チェックを入れます。  
もう一度クリックするとチェックが外れて完了状態を解除することができます。

### 完了したタスクを画面上から削除する
完了状態のタスクが一つでもあると、「完了済みタスク数」の箇所に「完了済みタスクを削除」というテキストリンクが表示されます。  
そのリンクをクリックすると完了済みタスクを削除することができます。

### タスクを並び替える
複数タスクがある場合、「タスクの並び替え」の箇所にある「優先度順」もしくは「期限順」のボタンをクリックして並び替えが可能です。

#### 優先度順
優先度「高」→「中」→「低」の順に並び替えをします。  
- **完了済みのタスクは、完了していないタスクより下**に並び替わります。

#### 期限順
期限が早いもの順に並び変わります。  
- **完了済みのタスクは、完了していないタスクより下**に並び替わります。
- 期限が空の場合は、「本日」が期限のタスクより後に並び替わります。

### 全タスクを削除する
「全タスク削除」をクリックすると、確認のアラートが表示されるので「OK」をクリックします。  
**一度削除すると元には戻せません。**




