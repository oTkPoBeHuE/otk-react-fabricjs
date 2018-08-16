import React, { PureComponent } from 'react';

//import Konva from 'konva';
//import { Stage, Layer, Image, Transformer } from 'react-konva';

import ReactCanvas from './react_canvas/react_canvas';
import { logos, tshirts } from './images/images.js';

import {
	// printImageData,
	getImageByName,
	changeImageByName,
	// scaleImage,
	// centerImages,
	setCorrectImagePosition,
	loadImg
} from './utils/utils';

const PRODUCT_IMAGE = 'PRODUCT_IMAGE';
const LOGO_IMAGE = 'LOGO_IMAGE';
const IMAGES_LIBRARY = {
	[PRODUCT_IMAGE]: tshirts,
	[LOGO_IMAGE]: logos
};

export default class App extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			number: 0,
			resultImage: '',
			selectedName: '',
			images: {
				[PRODUCT_IMAGE]: null,
				[LOGO_IMAGE]: null
			},
			size: 100,
			width: 500,
			height: 600,
			imageNumers: {
				[PRODUCT_IMAGE]: 0,
				[LOGO_IMAGE]: 0
			}
		};

		this.updateImagePosition = this.updateImagePosition.bind(this);
		this.changeSelectedName = this.changeSelectedName.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.loadImages();
	}

	changeImage(url, name) {
		return new Promise((resolve, reject) => {
			loadImg(url)
				.then(image =>
					this.setState(
						state => {
							const currentImg = state.images[name];
							return {
								images: {
									...state.images,
									[name]: {
										...currentImg,
										image: image
									}
								}
							};
						},
						() => resolve(this.state.images)
					)
				)
				.catch(error => reject(error));
		});
	}
	setImage(url, data) {
		return new Promise((resolve, reject) => {
			loadImg(url)
				.then(image => ({
					...data,
					image: image,
					width: image.width,
					height: image.height,
					rotation: 0
				}))
				.then(image =>
					this.setState(
						state => ({
							images: { ...state.images, [data.name]: image }
						}),
						() => resolve(this.state.images)
					)
				)
				.catch(error => reject(error));
		});
	}

	loadImages() {
		const addLogoProductImage = this.setImage(tshirts[this.state.imageNumers[PRODUCT_IMAGE]], {
			x: 15,
			y: 15,
			name: PRODUCT_IMAGE
		});

		const addLogoImage = this.setImage(this.state.imageNumers[LOGO_IMAGE], {
			x: 10,
			y: 10,
			name: LOGO_IMAGE
		});

		Promise.all([addLogoImage, addLogoProductImage]).then(values => {
			this.setState(state => ({
				images: setCorrectImagesPositions(state)
			}));
		});
	}

	onHandleClick() {
		const { selectedName, imageNumers } = this.state;
		if (!selectedName) {
			return;
		}

		const newNumber = (imageNumers[selectedName] + 1) % IMAGES_LIBRARY[selectedName].length;
		const newImage = IMAGES_LIBRARY[selectedName][newNumber];
		this.changeImage(newImage, selectedName);
		this.setState(state => ({
			imageNumers: {
				...state.imageNumers,
				[state.selectedName]: newNumber
			}
		}));
	}

	onSave() {
		const addImage = () => this.setState({ resultImage: this.stageRef.toImage() });
		this.setState({ selectedName: '' }, () => setTimeout(addImage, 60));
	}

	handleChange(event) {
		const value = parseInt(event.target.value, 10);
		this.setState(state => ({
			images: changeImageByName({
				images: state.images,
				name: this.state.selectedName,
				func: image => ({ ...image, height: value })
			})
		}));
	}

	updateImagePosition(images) {
		this.setState({ images: images });
	}

	changeSelectedName(selectedName) {
		this.setState({ selectedName: selectedName });
	}
	get selectedImage() {
		console.log('!!this.state.images', this.state.images);
		console.log('!!this.state.selectedName', this.state.selectedName);
		return getImageByName({ images: this.state.images, name: this.state.selectedName });
	}
	render() {
		return (
			<div>
				<div style={{ backgroundColor: 'black', display: 'flex', justifyContent: 'center' }}>
					<div style={{ backgroundColor: 'white', width: '500px', height: '600px' }}>
						<ReactCanvas
							width={this.state.width}
							height={this.state.height}
							ref={node => (this.stageRef = node)}
							images={this.state.images}
							updateImagePosition={this.updateImagePosition}
							changeSelectedName={this.changeSelectedName}
							selectedName={this.state.selectedName}
						/>
					</div>
				</div>
				<div style={{ backgroundColor: 'grey' }}>
					{this.selectedImage ? (
						<input
							id="typeinp"
							type="range"
							min="10"
							max="500"
							value={this.selectedImage.height}
							onChange={this.handleChange}
							step="5"
						/>
					) : null}
					<button onClick={() => this.onHandleClick()}>Change Image</button>
					<button onClick={() => this.onSave()}>Save Image</button>
				</div>
				{this.state.resultImage ? <img src={this.state.resultImage} alt="resutImage" /> : null}
			</div>
		);
	}
}

function setCorrectImagesPositions(state) {
	let tmpImages = state.images;

	tmpImages = setCorrectImagePosition({
		images: tmpImages,
		canvas: {
			width: state.width,
			height: state.height
		},
		imageName: LOGO_IMAGE,
		size: {
			width: 150,
			height: 150
		}
	});

	tmpImages = setCorrectImagePosition({
		images: tmpImages,
		canvas: {
			width: state.width,
			height: state.height
		},
		imageName: PRODUCT_IMAGE,
		size: {
			width: 480,
			height: 480
		}
	});

	return tmpImages;
}
