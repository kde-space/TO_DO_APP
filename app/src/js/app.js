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
		// ステート（直接外部からは参照できない）
		_stateAll: [],

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
			}
			this.dispatcher.dispatchEvent(this.ev);
		},

		/**
		 * ステートの取得
		 */
		getItem() {
			return this._stateAll;
		},

		removeAllItem() {
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
		const dateInput = document.getElementById('js-taskForm').querySelector('input[type="date"]');
		const today = new Date();
		const formattedToday = `${today.getFullYear()}-${utilityFunc.addZeroPadding(today.getMonth() + 1, 2)}-${utilityFunc.addZeroPadding(today.getDate(), 2)}`;
		dateInput.setAttribute('min', formattedToday);
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
							<li><button class="js-changeItem">編集</button></li>
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
		const CLASS_NONE = 'js-none';
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

	/**
	 * 完了済みタスクをゴミ箱へ移動
	 */
	const moveCompleteTask = () => {
		const deleteBtn = document.getElementById('js-taskDeleteBtn').firstElementChild;
		deleteBtn.addEventListener('click', () => {
			console.log(model.getItem());
			model.removeAllItem();
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
	};

	/**
	 * 実行
	 */
	const start = () => {
		setInputDateMin();

		// フォームのイベント登録
		addFormEvent();

		moveCompleteTask();

		// カスタムイベントのリスナー登録
		model.dispatcher.addEventListener('dataChange', () => {
			statusData.init();
			render();
		});

	};

	start();
};

TO_DO_APP();

