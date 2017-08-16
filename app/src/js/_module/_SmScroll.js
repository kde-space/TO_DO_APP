class SmScroll {
	constructor(option) {
		this.option = {
			selector: '.js-smoothScroll',
			pos: 0
		};
		Object.assign(this.option, option);
	}

	init() {
		document.addEventListener('DOMContentLoaded', () => {
			const selectors = document.querySelectorAll(this.option.selector);
			Object.keys(selectors).forEach((v) => {
				selectors[v].addEventListener('click', (e) => {
					e.preventDefault();
					const hrefData = e.target.getAttribute('href').substr(1);
					const clientRect = document.getElementById(hrefData).getBoundingClientRect();
					// ターゲットのY位置
					const targetOffsetTop = document.body.scrollTop + clientRect.top;
					//scrollTo(0, targetOffsetTop);
					// 現在のY位置
					let nowOffsetTop = document.body.scrollTop;
					setTimeout(function loop() {
						nowOffsetTop = document.body.scrollTop;
						scrollTo(0, nowOffsetTop - 20);
						if (nowOffsetTop <= targetOffsetTop) { return; }
						setTimeout(loop);
					});

					//window.scrollTo(0, targetY);
				});
			});
		});
		document.addEventListener('scroll', () => {
			console.log(document.body.scrollTop);
		});
	}
}

export default SmScroll;

