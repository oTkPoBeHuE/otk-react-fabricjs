import React, { PureComponent } from 'react';
import { render } from 'react-dom';

//import Konva from 'konva';
//import { Stage, Layer, Image, Transformer } from 'react-konva';

import ReactCanvas from './react_canvas/react_canvas';
import img1 from './images/img1.png';
import img2 from './images/img2.jpeg';
import img3 from './images/img3.png';
import logo from './images/logo.png';
import tshirt from './images/tshirt.jpg';

import {
	// printImageData,
	// getImageByName,
	changeImageByName,
	// scaleImage,
	// centerImages,
	// setCorrectImagePositions,
	loadImg
} from './utils/utils';

const images = [img1, img2, img3];

export default class App extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			number: 0,
			resultImage: '',
			selectedName: '',
			images: [],
			size: 100,
			width: 500,
			height: 600
		};

		this.updateImagePosition = this.updateImagePosition.bind(this);
		this.changeSelectedName = this.changeSelectedName.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.loadImages();
	}

	addImage(url, data) {
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
							images: [...state.images, image]
						}),
						() => resolve(this.state.images)
					)
				)
				.catch(error => reject(error));
		});
	}

	loadImages() {
		const addLogoProductImage = this.addImage(tshirt, {
			x: 15,
			y: 15,
			name: 'productImage'
		});
		const addLogoImage = this.addImage(logo, {
			x: 10,
			y: 10,
			name: 'logoImage'
		});

		Promise.all([addLogoImage, addLogoProductImage]).then(values => {
			this.setState(state => ({
				images: state
			}));
		});
	}

	onHandleClick() {
		this.setState(state => {
			const newNumber = (state.number + 1) % images.length;
			const imgs = changeImageByName({
				images: state.images,
				name: 'logoImage',
				func: image => ({ ...image, image: images[newNumber] })
			});

			return { images: imgs, number: newNumber };
		});
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
					{this.state.selectedName ? (
						<input
							id="typeinp"
							type="range"
							min="10"
							max="500"
							value={this.state.images.find(image => image.name === this.state.selectedName).height}
							onChange={this.handleChange}
							step="5"
						/>
					) : null}
					<button onClick={() => this.onHandleClick()}>Change Image</button>
					<button onClick={() => this.onSave()}>Save Image</button>
				</div>
				{this.state.resultImage ? <img src={this.state.resultImage} /> : null}
			</div>
		);
	}
}
// img={images[this.state.number]}
