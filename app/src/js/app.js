/**
 * TO DO アプリ
 */
import "babel-polyfill";

const TO_DO_APP = () => {
	const stage = document.getElementById('stage');

	// Model管理
	const model = {
		dispatcher: document.createElement('div'),
		ev: new Event('dataChange'),
		_stateAll: [],
		setItem(item) {
			this._stateAll.push(item);
			this.dispatcher.dispatchEvent(this.ev);
		},
		getItem() {
			return this._stateAll;
		}
	};

	/**
	 * フォームのイベント設定
	 */
	const addFormEvent = () => {
		const form = document.forms['js-taskForm'];
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const task = {
				content: form.content.value,
				priority: form.priority.value,
				limit: form.limit.value,
				status: 'open'
			};
			model.setItem(task);
			form.reset();
		});
	};

	/**
	 * 中身を空にする
	 * @param {Node} target 中身を空にするオブジェクト
	 */
	const emptyHtml = (target) => {
		while (target.firstChild) {
			target.removeChild(target.firstChild);
		}
	};

	/**
	 * 画面の描画
	 */
	const render = () => {
		// 全データ
		const dataAll = model.getItem();

		/**
		 * タスクの描画
		 */
		const renderTask = () => {
			const ul = document.createElement('ul');
			let html = '';
			dataAll.forEach((dataItem) => {
				html += `
					<li class="taskItem">
						<p class="taskContent">${dataItem.content}</p>
						<dl>
							<dt>優先度</dt><dd>${dataItem.priority}</dd>
						</dl>
						<dl>
							<dt>リミット</dt><dd>${dataItem.limit}</dd>
						</dl>
						<ul>
							<li><label><input type="checkbox" class="js-complateItem">完了</label></li>
							<li><button class="js-changeItem">編集</button></li>
						</ul>
					</li>
				`;
			});
			ul.innerHTML = html;
			emptyHtml(stage);
			stage.appendChild(ul);
		};

		/**
		 * ステータスの描画
		 */
		const renderStatus = () => {
			// 各値をまとめたオブジェクト
			const statusData = {
				init() {
					// タスク総数
					this.totalCount = dataAll.length;
					// 残タスク数
					this.leftCount = (() => {
						let result = 0;
						dataAll.forEach((value) => {
							if (value.status === 'open') {
								result += 1;
							}
						});
						return result;
					})();
					// 完了済みタスク数
					this.complateCount = this.totalCount - this.leftCount;
					// タスク完遂率
					this.completionRate = (this.complateCount / this.totalCount) * 100;
				}
			};
			statusData.init();

			/**
			 * 各要素の任意のプロパティに、対象オブジェクトの同名のプロパティの値を設定
			 * @param {Node} containerNode 要素をまとめる親ノード
			 * @param {Array<string>} childNodeSelectors 対象となる要素のセレクタ
			 * @param {String} prop 変更する要素のプロパティ
			 * @param {Object} status 変更する要素へ設定する値がまとまっているオブジェクト
			 */
			const setValueSameNameProp = (containerNode, childNodeSelectors, prop, status) => {
				childNodeSelectors.forEach((childSelector) => {
					containerNode.querySelector(childSelector)[prop] = status[childSelector.slice(1)];
				});
			};

			setValueSameNameProp(
				document.getElementById('js-statusBox'),
				['.totalCount', '.leftCount', '.complateCount', '.completionRate'],
				'textContent',
				statusData
			);
		};

		renderTask();
		renderStatus();
	};

	// カスタムイベントのリスナー登録
	model.dispatcher.addEventListener('dataChange', render);

	// フォームボタンのイベント登録
	addFormEvent();
};

TO_DO_APP();

