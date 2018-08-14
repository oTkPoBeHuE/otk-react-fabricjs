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
		image.onerror = () => reject('error');
	});
}

export function getImageByName({ images, name }) {
	return images.find(image => image.name === name);
}

export function changeImageByName({ images, name, func }) {
	return images.map(image => (image.name === name ? func(image) : image));
}

export function scaleImage({ image, width, height }) {
	let tmpHeight = image.height * 10;
	let tmpWidth = image.width * 10;

	if (tmpHeight > height) {
		const scalingHeightCoef = height / tmpHeight;
		tmpHeight = height;
		tmpWidth = tmpWidth * scalingHeightCoef;
	}

	if (tmpWidth > width) {
		const scalingWidthCoef = width / tmpWidth;
		tmpWidth = width;
		tmpHeight = tmpHeight * scalingWidthCoef;
	}

	return {
		...image,
		height: Math.floor(tmpHeight),
		width: Math.floor(tmpWidth)
	};
}

export function centerImages(state) {
	const logoImage = getImageByName({ images: state.images, name: 'logoImage' });
	const productImage = getImageByName({ images: state.images, name: 'productImage' });

	const convasCenter = {
		x: Math.floor(state.width / 2),
		y: Math.floor(state.height / 2)
	};

	const logoImageCenter = {
		x: Math.floor(logoImage.width / 2),
		y: Math.floor(logoImage.height / 2)
	};

	const productImageCenter = {
		x: Math.floor(productImage.width / 2),
		y: Math.floor(productImage.height / 2)
	};

	const newLogoImageCenter = {
		x: convasCenter.x - logoImageCenter.x,
		y: convasCenter.y - logoImageCenter.y
	};

	const newProductImageCenter = {
		x: convasCenter.x - productImageCenter.x,
		y: convasCenter.y - productImageCenter.y
	};

	let imagesTmp = changeImageByName({
		images: state.images,
		name: 'logoImage',
		func: image => ({ ...image, x: newLogoImageCenter.x, y: newLogoImageCenter.y })
	});

	imagesTmp = changeImageByName({
		images: imagesTmp,
		name: 'productImage',
		func: image => ({ ...image, x: newProductImageCenter.x, y: newProductImageCenter.y })
	});

	return imagesTmp;
}

export function setCorrectImagePositions(state) {
	let tmpImages = state.images;
	tmpImages = changeImageByName({
		images: tmpImages,
		name: 'logoImage',
		func: image => scaleImage({ image, width: 150, height: 150 })
	});

	tmpImages = changeImageByName({
		images: tmpImages,
		name: 'productImage',
		func: image => scaleImage({ image, width: 480, height: 480 })
	});

	const newState = {
		...state,
		images: tmpImages
	};

	tmpImages = centerImages(newState);
	return tmpImages;
}
