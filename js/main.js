const $ = _ => document.querySelector(_)

let canvas, ctx, image

function init () {
	canvas = $('#canvas')
	ctx = canvas.getContext('2d')
	bindEvent()
}

function bindEvent () {
	const file = $('#file')
	file.addEventListener('change', open);
}

function open (e) {
	if (e.target.files[0]) {
		loading(true)
		image = e.target.files[0];
		const url = window.URL || window.webkitURL
		const img = new Image();
		img.src = url.createObjectURL(image)
		img.onload = function (e) {
			draw(img)
			loading(false)
		}
	}
}

function loading (bool) {
	const load = $('#loading')
	if (bool) {
		load.style.display = 'block'
	} else {
		load.style.display = 'none'
	}
}

function draw (img) {
	canvas.width = img.width
	canvas.height = img.height
	clear()
	ctx.drawImage(img, 0, 0)
	ascii()
	toImage()
}

function clear () {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function ascii () {
	if (!image) return;
	let data = ctx.getImageData(0, 0, canvas.width, canvas.height)
	let chars = ["@", "%", "#", "*", "+", "=", "-", ":", ".", " "]
	let grayStep = Math.ceil(255 / chars.length);
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.font = "5px Courier";
	ctx.fillStyle = "black";
	for (let i = 0; i < canvas.height * 4; i += 4) {
		for (let j = 0; j < canvas.width * 4; j += 4) {
			for (let x = 0; x < chars.length; x++) {
				if (data.data[(i * canvas.width + j) * 4] < (x * grayStep) + grayStep) {
					ctx.fillText(chars[x], j, i);
					break;
				}
			}
		}
	}
}
function toImage () {
	const ascii = $('#ascii')
	const dataURL = canvas.toDataURL()
	ascii.src = dataURL
	ascii.style.display = 'block'
}

window.onload = init;