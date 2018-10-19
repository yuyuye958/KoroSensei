!function () {
	var css1 = `/*
 * 你看过一部名为 暗杀教室 的日本动漫吗？
 * 没看过也没关系
 * 现在来认识一下剧中的Koro老师吧！            
*/

/* 先来个背景颜色 */
body {
    transition: background 0.2s ease;
    background: #fff369;
    background-position-y: -14px;  
}

/* 做些准备工作 */
.container {
	width: 400px;
	height: 400px;
	margin: 10px auto;
	text-align: center;
	position: relative;
}

/* 我需要将我的代码高亮 */
.token.comment, .token.punctuation {
  color: #757575;
}
.token.selector {
  color: #690;
}
.token.property {
  color: #905;
}

/* 来开始画吧! */
/* 先绝对定位一下 */
.koroSensei {
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 100%;
	transition: all 0.2s ease;
}

/* 然后我们直接来画嘴巴 */
.koroSensei .face {
	background: linear-gradient(90deg, #fff 80%, #333 80%);
	background-size: 20px;
	width: 300px;
	height: 300px;
	border-radius: 100%;
	margin: auto;
	margin-top: 50px;
}

.koroSensei .face:before {
	content: '';
	position: absolute;
	width: 350px;
	height: 250px;
	border-radius: 100%;
	left: 22px;
	top: 48px;
	transition: all 0.2s ease;
}

/* 我还需要一对眼睛 */
.koroSensei .face:after {
	background-image: radial-gradient(#0c0c0c, black 4px, transparent 4px),
	radial-gradient(#0c0c0c, black 4px, transparent 4px);
	background-size: 240px 240px, 240px 240px;
	background-position: -93px -88px, 76px -86px;
	content: '';
	position: absolute;
	width: 224px;
	height: 116px;
	left: 0;
	right: 0;
	margin: auto;
	margin-top: 81px;
}

/* 
 * 接下来用JavaScript加个阴影吧
 * 加完阴影就能显出立体感了
 */

`;

	var css2 = `/* 
 * 好像太单调了
 * 我们给老师再加8种表情
 * 因为这部分的CSS代码太多太耗时 想看的话可见我的源代码
 * 所以直接调用我们的JS来换表情吧
 * 这里会继续滚动显示用来生成不同阴影和切换表情的代码
 */
`;

	var js1 = `
function shadow(key) {
	var str = '';
	//rgb(227, 166, 20)rgb(234, 194, 48)
	for (var i = 1; i < 100; i += 3) {
		str = str + '' + i + 'px ' + i * 0.5 + 'px ' + dict[key] + ', ' + 5 / i + '),';
	}
	str = str + '' + i + 'px ' + i * 0.5 + 'px ' + dict[key] + ', ' + 5 / i + ')';
	$('.koroSensei').css({ 'box-shadow': 'none' });
	$('.koroSensei').css({ 'box-shadow': str });
	console.log(str);
}

var theClass = 'normal';
$('.emoji').find('li').click(function() {
	$('.face').removeClass(theClass).addClass($(this).attr('class'));
	$('body').removeClass(theClass).addClass($(this).attr('class'));
	theClass = $(this).attr('class');
	shadow(theClass);
});
`;

	var css3 = `/* 
* 给你按钮自己切换表情吧！
*/

.emoji {
    display: block;
	text-align: center;
	list-style-type: none;
	left: 0;
	right: 0;
	padding: 0;
	position: absolute;
	margin: auto;
	bottom: 3%;
}
.emoji li {
	font-size: 10pt;
	cursor: pointer;
	display: inline-block;
	text-align: center;
	padding: 3px 3px;
	text-decoration: none;
	box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.3);
	border-radius: 4px;
	margin: 0 1px;
	color: #333;
}

/* 
* 谢谢观赏！
*/

`;

	// 调用
	writeCSS('', css1, '').then(() => {
		shadow('normal');
		$('body').addClass('normal');
	}).then(() => {
		writeCSS(css1, css2, css1).then(() => {
			let i = 1;
			let IntervalID2 = setTimeout(function fn() {
				$('.emoji').children('li').get(i).click();
				i++;
				if (i < $('.emoji > li').length) {
					setTimeout(fn, duration*120)
				}else if (i === $('.emoji > li').length) {
					// 这里碰到了问题要记住  i=10的时候这个interval就报错了
					setTimeout(() => {
						$('.emoji').children('li').get(0).click();
					}, duration*120);
					window.clearInterval(IntervalID2);
				}
			}, duration*120);
			writeJS(css1 + css2, js1).then(() => {
				writeCSS(css1 + css2 + js1, css3, css1 + css2);
			})
		})
	})

	var duration = 25
	// 变速
	$('.changeSpeed').on('click', 'button', function (e) {
		let $button = $(e.currentTarget)
		let speed = $button.attr('data-speed')
		$button.addClass('active').siblings('.active').removeClass('active')
		switch (speed) {
			case 'slow':
				duration = 50
				break
			case 'normal':
				duration = 25
				break
			case 'fast':
				duration = 6
				break
		}
	})

	// 把代码写到style和#code标签里
	function writeCSS(origin, addcode, styleCode) {
		let n = 0;
		let domcode = document.querySelector('#code');
		return new Promise((resolve, reject) => {
			let IntervalID = setTimeout(function fn() {
				domcode.innerHTML = Prism.highlight(origin + addcode.substr(0, n), Prism.languages.css, 'css');
				codeStyle.innerHTML = styleCode + addcode.substr(0, n);
				domcode.scrollTop = domcode.scrollHeight; // 让domcode自动滚动到底部
				n++;
				if (n < addcode.length) {
					setTimeout(fn, duration)
				} else {
					resolve.call(undefined);
				}
			}, duration);
		});
	}

	// 把JS代码写到code里
	function writeJS(origin, code) {
		let n = 0;
		let domcode = document.querySelector('#code');
		return new Promise((resolve, reject) => {
			let IntervalID = setTimeout(function fn() {
				domcode.innerHTML = Prism.highlight(origin + code.substr(0, n), Prism.languages.javascript, 'javascript');
				domcode.scrollTop = domcode.scrollHeight; // 让paper自动滚动到底部
				n++;
				if (n < code.length) {
					setTimeout(fn, duration)
				} else {
					resolve.call(undefined);
				}
			}, duration);
		});
	}

	// 画图用到的JS
	var dict = {
		normal: 'rgba(234, 194, 48',
		right: 'rgba(234, 93, 28',
		mistake: 'rgba(80, 45, 91',
		disdain: 'rgba(234, 194, 48',
		sad: 'rgba(163, 192, 224',
		blank: 'rgba(224, 222, 222',
		blush: 'rgba(237, 177, 234',
		furious: 'rgba(0,0,0',
		shocked: 'rgba(123, 164, 209'
	};

	function shadow(key) {
		var str = '';
		//rgb(227, 166, 20)rgb(234, 194, 48)
		for (var i = 1; i < 100; i += 3) {
			str = str + '' + i + 'px ' + i * 0.5 + 'px ' + dict[key] + ', ' + 5 / i + '),';
		}
		str = str + '' + i + 'px ' + i * 0.5 + 'px ' + dict[key] + ', ' + 5 / i + ')';
		$('.koroSensei').css({ 'box-shadow': 'none' });
		$('.koroSensei').css({ 'box-shadow': str });
		console.log(str);
	}
	var theClass = 'normal';
	$('.emoji').find('li').click(function () {
		$('.face').removeClass(theClass).addClass($(this).attr('class'));
		$('body').removeClass(theClass).addClass($(this).attr('class'));
		theClass = $(this).attr('class');
		shadow(theClass);
	});

}.call()

