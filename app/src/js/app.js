/**
 * TO DO アプリ
 */
import "babel-polyfill";

const TO_DO_APP = () => {
	const stage = document.getElementById('stage');

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
				limit: form.limit.value
			};
			model.setItem(task);
			form.reset();
		});
	};

	/**
	 * 画面の描画
	 */
	const render = () => {
		const dataAll = model.getItem();
		const ul = document.createElement('ul');
		let html = '';
		dataAll.forEach((v) => {
			html += `<li>${v.content}<strong>優先度</strong>${v.priority}<strong>リミット</strong>${v.limit}</li>`;
		});
		ul.innerHTML = html;
		while (stage.firstChild) {
			stage.removeChild(stage.firstChild);
		}
		stage.appendChild(ul);
	};

	// カスタムイベントのリスナー登録
	model.dispatcher.addEventListener('dataChange', render);

	// フォームボタンのイベント登録
	addFormEvent();
};

TO_DO_APP();

