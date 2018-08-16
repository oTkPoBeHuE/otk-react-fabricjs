export function printImageData(mesgae, image) {
	console.clear();
	console.log('------' + mesgae + '-------');
	console.log('height', image.height);
	console.log('width', image.width);
	console.log('x', image.x);
	console.log('y', image.y);
	console.log('---------------------------');
}

export function loadImg(url) {
	return new Promise((resolve, reject) => {
		const image = new window.Image();
		image.src = url;
		image.onload = () => resolve(image);
		image.onerror = () => reject('Error loading image.');
	});
}

export function getImageByName({ images, name }) {
	return images[name];
}

export function changeImageByName({ images, name, func }) {
	return {
		...images,
		[name]: func(images[name])
	};
}

// Вписать картинку
function fitImage({ image, width, height }) {
	let tmpHeight = image.height * 10;
	let tmpWidth = image.width * 10;

	if (tmpHeight > height) {
		tmpWidth = Math.floor(tmpWidth * height / tmpHeight);
		tmpHeight = height;
	}

	if (tmpWidth > width) {
		tmpHeight = Math.floor(tmpHeight * width / tmpWidth);
		tmpWidth = width;
	}
	//
	// console.log('!!!fitImage', image);
	// console.log('!!!tmpWidth', tmpWidth);
	// console.log('!!!tmpWidth', tmpWidth);
	return {
		...image,
		height: tmpHeight,
		width: tmpWidth
	};
}

function getСoordinatesOfCenter(obj) {
	return {
		x: Math.floor(obj.width / 2),
		y: Math.floor(obj.height / 2)
	};
}

function сoordinatesImageInСenter(image, canvas) {
	const canvasCenter = getСoordinatesOfCenter(canvas);
	const imageCenter = getСoordinatesOfCenter(image);

	return {
		x: canvasCenter.x - imageCenter.x,
		y: canvasCenter.y - imageCenter.y
	};
}

function moveImageToCenter({ images, imageName, canvas }) {
	const image = getImageByName({ images: images, name: imageName });
	const сoordinatesImageInCenter = сoordinatesImageInСenter(image, canvas);

	return changeImageByName({
		images: images,
		name: imageName,
		func: image => ({ ...image, x: сoordinatesImageInCenter.x, y: сoordinatesImageInCenter.y })
	});
}

export function setCorrectImagePosition({ images, canvas, imageName, size }) {
	let tmpImages = images;
	//console.log('setCorrectImagePosition');
	tmpImages = changeImageByName({
		images: tmpImages,
		name: imageName,
		func: image => fitImage({ image, width: size.width, height: size.height })
	});

	tmpImages = moveImageToCenter({
		images: tmpImages,
		imageName: imageName,
		canvas: { width: canvas.width, height: canvas.height }
	});

	return tmpImages;
}
