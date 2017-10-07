/**
 * TO DO アプリ
 */
import 'babel-polyfill';

const TO_DO_APP = () => {
	const stage = document.getElementById('stage');
	const CLASS_NONE = 'js-none';
	const now = new Date();

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

		escapeHtml(str) {
			if (typeof str !== 'string') {
				return str;
			}
			return str.replace(/[&'`"<>]/g, (match) => {
				return {
					'&': '&amp;',
					"'": '&#x27;',
					'`': '&#x60;',
					'"': '&quot;',
					'<': '&lt;',
					'>': '&gt;'
				}[match];
			});
		},

		/**
		 * 優先度を示す文字列を表示用に変換
		 * @param {Number} priority 優先度を示す数値
		 */
		getPriorityStr(priority) {
			let str = '';
			switch (priority) {
			case 3:
				str = '高';
				break;
			case 1:
				str = '低';
				break;
			default:
				str = '中';
				break;
			}
			return str;
		},

		getFormattedToday() {
			return `${now.getFullYear()}-${utilityFunc.addZeroPadding(now.getMonth() + 1, 2)}-${utilityFunc.addZeroPadding(now.getDate(), 2)}`;
		}
	};

	// Model管理
	const model = {
		dispatcher: document.createElement('div'),
		ev: new Event('dataChange'),

		// ステート（直接外部からは参照できない）
		_stateAll: [
			// {content: "ご飯を食べる", priority: 3, limit: "2017-10-1", status: "open"},
			// {content: "お米を食べる", priority: 3, limit: "2017-09-30", status: "open"},
			// {content: "お米を研ぐ", priority: 1, limit: "", status: "open"},
			// {content: "歯を磨く", priority: 3, limit: "2017-10-10", status: "open"},
			// {content: "昼寝する", priority: 1, limit: "2017-10-12", status: "open"},
			// {content: "トマトジュースを飲む", priority: 2, limit: "", status: "open"},
			// {content: "映画を見る", priority: 2, limit: "", status: "complete"}
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
				targetElement.priority = parseInt(arg[2], 10);
				targetElement.limit = arg[3];
			}
			//localStorage.hoge = JSON.stringify(this._stateAll);
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
		 * ソート
		 */
		sortItem(ary, order) {
			this._stateAll.sort((a, b) => {
				if (!Array.isArray(ary)) {
					return 0;
				}
				let valueA = null;
				let valueB = null;
				const FormattedToday = utilityFunc.getFormattedToday();

				for (let i = 0, l = ary.length; i < l; i += 1) {
					if (!Object.prototype.hasOwnProperty.call(a, ary[i]) ||
						!Object.prototype.hasOwnProperty.call(b, ary[i])) {
						return 0;
					}
					valueA = (typeof a[ary[i]] === 'string') ? a[ary[i]].toUpperCase() : a[ary[i]];
					valueB = (typeof b[ary[i]] === 'string') ? b[ary[i]].toUpperCase() : b[ary[i]];

					// 期限が空の場合は今日の日付を一時的に設定
					if (ary[i] === 'limit') {
						valueA = !valueA ? FormattedToday : valueA;
						valueB = !valueB ? FormattedToday : valueB;
					}

					if (valueA < valueB) {
						if (!Array.isArray(order) || order[i] === 'asc') {
							return -1;
						}
						return 1;
					} else if (valueA > valueB) {
						if (!Array.isArray(order) || order[i] === 'asc') {
							return 1;
						}
						return -1;
					}
				}
				return 0;
			});
			this.dispatcher.dispatchEvent(this.ev);
		},

		/**
		 * 完了済みの要素を削除
		 */
		removeCompletedItem() {
			this._stateAll = this._stateAll.filter((value) => {
				if (value.status !== 'complete') {
					return value;
				}
				return false;
			});
			this.dispatcher.dispatchEvent(this.ev);
		}
	};


	/**
	 * 空白（空文字）であるか
	 * @param {String} str
	 */
	const isBlank = (str) => {
		if (/\S/.test(str)) {
			return false;
		}
		return true;
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
			if (isBlank(task.content)) {
				alert('内容を入力してください');
				form.reset();
				return;
			}
			task.content = task.content.trim();
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
		const formattedToday = `${now.getFullYear()}-${utilityFunc.addZeroPadding(now.getMonth() + 1, 2)}-${utilityFunc.addZeroPadding(now.getDate(), 2)}`;
		Array.prototype.slice.call(dateInput).forEach((input) => {
			input.setAttribute('min', formattedToday);
		});
	};

	/**
	 * 全データから各値をまとめたオブジェクト
	 */
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
			this.completionRate = (() => {
				let result = null;
				result = Math.floor((this.completeCount / this.totalCount) * 100);
				if (Number.isNaN(result)) {
					return 0;
				}
				return result;
			})();
		}
	};

	/**
	 * ハイフンつなぎの日付から正確な日時を示すDateオブジェクト取得
	 * @param {String} dateText 2017-09-25 のようなハイフンつなぎの文字列
	 * @return {Object} Dateオブジェクト
	 */
	const getCorrectDateObj = (dateText) => {
		if (!dateText) {
			return null;
		}
		return new Date(dateText.replace(/-/g, '/'));
	};

	/**
	 * 期限に対しての状態を取得
	 * @param {String} dateText 2017-09-25 のようなハイフンつなぎの文字列
	 * @param {Date} endDateObj 期限の日付オブジェクト
	 * @param {Date} nowDateObj 現在の日付けオブジェクト
	 * @return {String}
	 */
	const getStatusAgainstlimit = (dateText, endDateObj, nowDateObj) => {
		if (!dateText || !endDateObj) {
			return null;
		}
		const endTime = (() =>
			new Date(
				endDateObj.getFullYear(),
				endDateObj.getMonth(),
				endDateObj.getDate() + 1,
				endDateObj.getHours(),
				endDateObj.getMinutes(),
				endDateObj.getSeconds() - 1
			))();
		if (endTime.getTime() - nowDateObj.getTime() <= 0) {
			return 'over';
		} else if (endTime.getTime() - nowDateObj.getTime() < 86400000) {
			return 'thatday';
		}
		return 'notyet';
	};

	/**
	 * 期限に対して現在の状態を表すhtmlを取得
	 * @param {String} status 期限に対しての現在の状態
	 * @param {Date} endDateObj 期限の日付オブジェクト
	 * @param {Date} nowDateObj 現在の日付けオブジェクト
	 * @return {String}
	 */
	const getShowHtmlAgainstlimit = (status, endDateObj, nowDateObj) => {
		switch (status) {
		case 'over': {
			return '期限が過ぎています';
		}
		case 'thatday': {
			return '期限当日です';
		}
		case 'notyet': {
			if (!endDateObj || !nowDateObj) {
				return null;
			}
			const diffTime = endDateObj.getTime() - nowDateObj.getTime();
			const diffDate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			return `残り${diffDate}日`;
		}
		default:
			return null;
		}
	};

	/**
	 * タスクの描画
	 */
	const renderTask = () => {
		// 全データ
		const dataAll = model.getItem();
		console.log(dataAll);
		const ul = document.createElement('ul');
		let html = '';

		dataAll.forEach((dataItem) => {
			const itemlimit = dataItem.limit;
			const endDay = getCorrectDateObj(itemlimit);
			const statusAgainstlimit = getStatusAgainstlimit(itemlimit, endDay, now);
			const htmlAgainstlimit = getShowHtmlAgainstlimit(statusAgainstlimit, endDay, now);
			const txt = dataItem.content;

			html += `
				<li class="taskItem is-${dataItem.priority}${dataItem.status === 'complete' ? ' is-complete' : ''}${statusAgainstlimit === 'over' ? ' is-over' : ''}">
					<p class="taskContent">${utilityFunc.escapeHtml(txt)}</p>
					<div class="taskStatus">
						<dl>
							<dt>優先度</dt><dd>${utilityFunc.getPriorityStr(+dataItem.priority)}</dd>
						</dl>
						${dataItem.limit ? `
						<dl>
							<dt>期限</dt><dd>${dataItem.limit}(${htmlAgainstlimit})</dd>
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
				if (+item.value === +itemState.priority) {
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
				let content = form.content.value;
				const priority = form.priority.value;
				const limit = form.limit.value;
				if (isBlank(content)) {
					alert('内容を入力してください');
					return;
				}
				content = content.trim();
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
	 * 並び替え
	 */
	const sortTask = () => {
		const CLASS_CONTAINER = 'js-sort';
		const sortBtns = document.getElementById(CLASS_CONTAINER).getElementsByTagName('a');
		if (sortBtns.length < 1) {
			return;
		}
		Array.prototype.slice.call(sortBtns).forEach((btn) => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				if (e.currentTarget.classList.contains(`${CLASS_CONTAINER}-priority`)) {
					model.sortItem(['priority', 'limit'], ['', 'asc']);
				} else if (e.currentTarget.classList.contains(`${CLASS_CONTAINER}-limit`)) {
					model.sortItem(['limit', 'priority'], ['asc', '']);
				}
			});
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

		sortTask();
	};

	start();
};

TO_DO_APP();

