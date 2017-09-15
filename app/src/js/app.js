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
			class DataStatus {
				constructor() {
					this.dataAll = dataAll;
					this.totalCount = this.dataAll.length;
				}
				complateCount() {
					return this.totalCount - this.leftCount();
				}
				leftCount() {
					let result = 0;
					this.dataAll.forEach((value) => {
						if (value.status === 'open') {
							result += 1;
						}
					});
					return result;
				}
				completionRate() {
					return (this.complateCount() / this.totalCount) * 100;
				}
			}
			const dataStatus = new DataStatus(dataAll);

			const container = document.getElementById('js-statusBox');
			// タスク総数
			container.querySelector('.totalCount').textContent = dataStatus.totalCount;
			// 残タスク数
			container.querySelector('.leftCount').textContent = dataStatus.leftCount();
			// 完了済み
			container.querySelector('.leftCount').textContent = dataStatus.complateCount();
			// 完遂率
			container.querySelector('.completionRate').textContent = dataStatus.completionRate();
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

