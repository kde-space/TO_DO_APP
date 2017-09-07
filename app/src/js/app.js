/**
 * TO DO アプリ
 */
import "babel-polyfill";

const TO_DO_APP = {
	init() {
		this.stage = document.getElementById('stage');

		/**
		 * 初期表示テキスト
		 * @param {String} str メッセージ
		 */
		const showMessage = (str) => {
			const div = document.createElement('div');
			div.textContent = str;
			this.stage.appendChild(div);
		};

		/**
		 * フォームの表示
		 */
		const showForm = () => {
			const div = document.createElement('div');
			div.className = 'addTaskForm';
			div.innerHTML = `
				<form name="addTask">
					内容：<input type="text" name="content">
					優先度：<lebel><input type="radio" name="priority" value="high">高</label>
							<lebel><input type="radio" name="priority" value="normal">中</label>
							<lebel><input type="radio" name="priority" value="low">低</label>
					期限：<input type="date" name="limit">
					<input type="submit" value="追加">
					<input type="reset" value="クリア">
				</form>
			`;
			this.stage.appendChild(div);
		};

		/**
		 * フォームのイベント設定
		 */
		const addFormEvent = () => {
			const addTaskForm = document.forms.addTask;
			addTaskForm.addEventListener('submit', (e) => {
				e.preventDefault();
				const task = [
					addTaskForm.content.value,
					addTaskForm.priority.value,
					addTaskForm.limit.value
				];
				this.createTask(task, this.stage);
				addTaskForm.reset();
			});
		};

		showMessage('タスクを入力しましょう');
		showForm();
		addFormEvent();
	},

	/**
	 * タスクインスタンスの作成
	 * @param {Array} ary タスクのプロパティ
	 * @param {Node} stage 挿入先となる要素
	 */
	createTask(ary, stage) {
		class Task {
			constructor(ary) {
				this.element = document.createElement('div');
				this.element.textContent = ary[0];
				this.element.priority = ary[1];
				this.element.limit = ary[2];
				stage.appendChild(this.element);
			}
		}
		const task = new Task(ary);
	}
};

TO_DO_APP.init();

