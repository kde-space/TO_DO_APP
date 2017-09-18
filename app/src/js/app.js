/**
 * TO DO アプリ
 */
import "babel-polyfill";

const TO_DO_APP = () => {
	const stage = document.getElementById('stage');
	//const modal = document.getElementById('js-modal');
	const CLASS_NONE = 'js-none';

	// Model管理
	const model = {
		dispatcher: document.createElement('div'),
		ev: new Event('dataChange'),
		// ステート（直接外部からは参照できない）
		_stateAll: [
			{content: "ご飯を食べる", priority: "high", limit: "2017-09-19", status: "open"},
			{content: "歯を磨く", priority: "middle", limit: "", status: "open"},
			{content: "昼寝する", priority: "low", limit: "", status: "open"},
			{content: "トマトジュースを飲む", priority: "middle", limit: "", status: "open"},
			{content: "映画を見る", priority: "middle", limit: "", status: "open"},
			{content: "勉強する", priority: "high", limit: "", status: "open"},
			{content: "渋谷で買い物をする", priority: "high", limit: "", status: "open"},
			{content: "友達と飲み会", priority: "middle", limit: "", status: "open"},
			{content: "ああああ", priority: "middle", limit: "", status: "complete"},
			{content: "小説を3冊読む", priority: "middle", limit: "", status: "open"},
			{content: "今後の社会について考える", priority: "high", limit: "2017-09-21", status: "open"}
		],

		/**
		 * ステートへの保存
		 * @param {String} type
		 * @param {*} arg
		 */
		setItem(type, arg) {
			if (type === 'add') {
				this._stateAll.push(arg);
			} else if (type === 'changeStatus') {
				this._stateAll[arg[0]].status = arg[1] ? 'complete' : 'open';
			} else if (type === 'edit') {
				const targetElement = this._stateAll[arg[0]];
				targetElement.content = arg[1];
				targetElement.priority = arg[2];
				targetElement.limit = arg[3];
			}
			this.dispatcher.dispatchEvent(this.ev);
		},

		/**
		 * ステートの取得
		 */
		getItem(opt_index) {
			if (opt_index >= 0 && opt_index < this._stateAll.length) {
				return this._stateAll[opt_index];
			}
			return this._stateAll;
		},

		/**
		 * 完了済みの要素を削除
		 */
		removeCompletedItem() {
			this._stateAll = this._stateAll.filter((value) => {
				if (value.status !== 'complete') {
					return value;
				}
			});
			this.dispatcher.dispatchEvent(this.ev);
		}
	};

	/**
	 * 汎用的に使える関数群
	 */
	const utilityFunc = {
		/**
		 * 中身を空にする
		 * @param {Node} target 中身を空にするオブジェクト
		 */
		emptyHtml(target) {
			while (target.firstChild) {
				target.removeChild(target.firstChild);
			}
		},

		/**
		 * ゼロパディング
		 * @param {Number} Num ゼロパティングする値
		 * @param {Number} digit 最終的な桁数
		 * @return {String}
		 */
		addZeroPadding(Num, digit) {
			let result = '';
			for (let i = 1; i < digit; i += 1) {
				result += '0';
			}
			return (result + Num).slice(-digit);
		},

		/**
		 * 優先度を示す文字列を表示用に変換
		 * @param {String} priority 優先度を示す文字列
		 */
		getPriorityStr(priority) {
			let str = '';
			switch (priority) {
			case 'high':
				str = '高';
				break;
			case 'low':
				str = '低';
				break;
			default:
				str = '中';
				break;
			}
			return str;
		}

	};

	/**
	 * フォームのイベント登録
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
			model.setItem('add', task);
			form.reset();
		});
	};

	/**
	 * フォームのinput[type="date"]のmin属性に今日の日付を設定
	 */
	const setInputDateMin = () => {
		const dateInput = document.querySelectorAll('input[type="date"]');
		if (dateInput.legnth < 1) {
			return;
		}
		const today = new Date();
		const formattedToday = `${today.getFullYear()}-${utilityFunc.addZeroPadding(today.getMonth() + 1, 2)}-${utilityFunc.addZeroPadding(today.getDate(), 2)}`;
		Array.prototype.slice.call(dateInput).forEach((input) => {
			input.setAttribute('min', formattedToday);
		});
	};

	// 全データから各値をまとめたオブジェクト
	const statusData = {
		init() {
			// 全データ
			const dataAll = model.getItem();
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
			this.completeCount = this.totalCount - this.leftCount;
			// タスク完遂率
			this.completionRate = Math.floor((this.completeCount / this.totalCount) * 100);
		}
	};

	/**
	 * タスクの描画
	 */
	const renderTask = () => {
		// 全データ
		const dataAll = model.getItem();
		const ul = document.createElement('ul');
		let html = '';
		dataAll.forEach((dataItem) => {
			html += `
				<li class="taskItem is-${dataItem.priority} ${dataItem.status === 'complete' ? 'is-complete' : ''}">
					<p class="taskContent">${dataItem.content}</p>
					<div class="taskStatus">
						<dl>
							<dt>優先度</dt><dd>${utilityFunc.getPriorityStr(dataItem.priority)}</dd>
						</dl>
						${dataItem.limit ? `
						<dl>
							<dt>期限</dt><dd>${dataItem.limit}</dd>
						</dl>
						` : ''}
						<ul>
							<li><label><input type="checkbox" class="js-completeItem" ${dataItem.status === 'complete' ? 'checked' : ''}>完了</label></li>
							<li><button class="js-editItem">編集</button></li>
						</ul>
					</div>
				</li>
			`;
		});
		ul.innerHTML = html;
		utilityFunc.emptyHtml(stage);
		stage.appendChild(ul);
	};

	/**
	 * ステータスの描画
	 */
	const renderStatus = () => {
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
			['.totalCount', '.leftCount', '.completeCount', '.completionRate'],
			'textContent',
			statusData
		);
	};

	/**
	 * 完了済みタスクを削除するボタンの表示切り替え
	 */
	const toggleShowTaskDeleteBtn = () => {
		const taskDeleteBtn = document.getElementById('js-taskDeleteBtn');
		const taskDeleteBtnClassList = taskDeleteBtn.classList;
		if (statusData.completeCount > 0) {
			taskDeleteBtnClassList.remove(CLASS_NONE);
		} else if (!taskDeleteBtnClassList.contains(CLASS_NONE)) {
			taskDeleteBtnClassList.add(CLASS_NONE);
		}
	};

	/**
	 * 完了ボタンへのイベント登録
	 */
	const addCompleteEvent = () => {
		const allcompleteInputs = document.querySelectorAll('.js-completeItem');
		Array.prototype.slice.call(allcompleteInputs).forEach((completeInput, index) => {
			completeInput.addEventListener('click', (e) => {
				model.setItem('changeStatus', [index, e.currentTarget.checked]);
			});
		});
	};

	const modal = {
		wrapper: document.getElementById('js-modal'),
		form: document.forms['js-taskEdit'],
		editBtnIndex: null,

		/**
		 * モーダルを開く
		 */
		open() {
			this.wrapper.classList.remove(CLASS_NONE);
		},

		/**
		 * モーダルを閉じる
		 */
		close() {
			this.wrapper.classList.add(CLASS_NONE);
		},

		/**
		 * モーダルを閉じるイベントを登録
		 */
		setCloseEvent() {
			const modalBg = this.wrapper.querySelector('.modal-bg');
			const modalCloseBtn = this.wrapper.querySelector('.modal-close');
			[modalBg, modalCloseBtn].forEach((item) => {
				item.addEventListener('click', () => {
					this.close();
				});
			});
		},

		/**
		 * モーダル内のフォームを初期化
		 */
		initForm(index) {
			const itemState = model.getItem(index);
			const form = this.form;
			form.querySelector('input[type="text"]').value = itemState.content;
			form.querySelector('input[type="date"]').value = itemState.limit;
			Array.prototype.slice.call(form.querySelectorAll('input[type="radio"]')).forEach((item) => {
				if (item.value === itemState.priority) {
					item.checked = true;
				} else if (item.checked) {
					item.checked = false;
				}
			});
		},

		/**
		 * モーダル内のフォームのイベント登録
		 * 		編集された内容にステートを更新
		 */
		setEditFormEvent() {
			const form = this.form;
			form.addEventListener('submit', (e) => {
				e.preventDefault();
				const index = this.editBtnIndex;
				const content = form.content.value;
				const priority = form.priority.value;
				const limit = form.limit.value;
				model.setItem('edit', [index, content, priority, limit]);
				// モーダル閉じる
				this.close();
			});
		}

	};

	/**
	 * 編集ボタンへのイベント登録
	 */
	const addEditEvent = () => {
		const allEditBtn = document.querySelectorAll('.js-editItem');
		Array.prototype.slice.call(allEditBtn).forEach((editBtn, index) => {
			editBtn.addEventListener('click', () => {
				modal.initForm(index);
				modal.open();
				modal.editBtnIndex = index;
			});
		});
	};


	/**
	 * 完了済みタスクをゴミ箱へ移動
	 */
	const moveCompleteTask = () => {
		const deleteBtn = document.getElementById('js-taskDeleteBtn').firstElementChild;
		deleteBtn.addEventListener('click', () => {
			model.removeCompletedItem();
		});
	};


	/**
	 * 画面の描画
	 */
	const render = () => {
		renderTask();
		renderStatus();
		toggleShowTaskDeleteBtn();
		addCompleteEvent();
		addEditEvent();
	};

	/**
	 * 実行
	 */
	const start = () => {
		setInputDateMin();

		// フォームのイベント登録
		addFormEvent();

		statusData.init();

		// 一時的
		render();

		moveCompleteTask();

		// カスタムイベントのリスナー登録
		model.dispatcher.addEventListener('dataChange', () => {
			statusData.init();
			render();
		});

		// モーダルの閉じるイベント登録
		modal.setCloseEvent();

		// モーダルのフォームイベント登録
		modal.setEditFormEvent();
	};

	start();
};

TO_DO_APP();

