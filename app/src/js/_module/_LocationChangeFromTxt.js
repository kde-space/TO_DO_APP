/**
 * テキストからページ遷移
 */
class LocationChangeFromTxt {
	constructor(option) {
		this.option = {
			targetsClass: 'js-linkTxt',
			attrName: 'data-href',
			event: 'click'
		};
		Object.assign(this.option, option);
	}
	/**
	 * 初期設定
	 */
	init() {
		document.addEventListener('DOMContentLoaded', () => {
			const targets = document.getElementsByClassName(this.option.targetsClass);
			if (targets.length < 1) { return; }
			const attrName = this.option.attrName;
			const event = this.option.event;
			Object.keys(targets).forEach((v) => {
				targets[v].addEventListener(event, (e) => {
					e.preventDefault();
					location.href = e.currentTarget.getAttribute(attrName);
				});
			});
		});
	}
}

export default LocationChangeFromTxt;
