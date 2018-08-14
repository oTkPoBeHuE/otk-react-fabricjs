import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer } from 'react-konva';
import Image from './image.js';
// import { printImageData, getImageByName, changeImageByName } from '../utils/utils';
import TransformerComponent from './transformer_component';

export default class ReactCanvas extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			selectedName: this.props.selectedName || ''
		};

		this.updateImagePosition = this.updateImagePosition.bind(this);
		this.printImage = this.printImage.bind(this);
		this.handleStageMouseDown = this.handleStageMouseDown.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.selectedName !== nextProps.selectedName) {
			this.setState({
				selectedName: nextProps.selectedName
			});
		}
	}

	updateImagePosition(data) {
		//this.printImageData('new images', data);
		const changeImage = image => (image.name === data.name ? { ...image, ...data } : image);
		const changeImages = images => images.map(changeImage);
		this.props.updateImagePosition(changeImages(this.props.images));
	}

	handleStageMouseDown = e => {
		// clicked on transformer - do nothing
		// console.log('!!!!!!!!!!handleStageMouseDown!!!!!!!!!');
		const parent = e.target.getParent();
		const clickedOnTransformer = parent && parent.className === 'Transformer';
		if (clickedOnTransformer) {
			return;
		}

		// clicked on stage - cler selection
		let name = '';
		if (e.target !== e.target.getStage()) {
			// find clicked rect by its name
			name = e.target.name() || '';
		}
		//const rect = this.state.rectangles.find(r => r.name === name);
		this.setState(
			{
				selectedName: name
			},
			() => this.changeSelectedName(name)
		);
	};

	changeSelectedName(selectedName) {
		this.props.changeSelectedName(selectedName);
	}

	toImage() {
		return this.stageRef.getStage().toDataURL();
	}

	printImage(image, index) {
		return (
			<Image
				key={index}
				image={image.image}
				x={image.x}
				y={image.y}
				width={image.width}
				height={image.height}
				rotation={image.rotation}
				name={image.name}
				onTransform={this.updateImagePosition}
			/>
		);
	}

	render() {
		const { width, height, images } = this.props;
		//const images = [];
		console.log('!!!!!!!!!!!!!', images);
		console.log('!!!!!!!!!!!!!', images.map);
		return (
			<Stage width={width} height={height} ref={node => (this.stageRef = node)} onMouseDown={this.handleStageMouseDown}>
				<Layer>
					{/* {images ? images.map(this.printImage) : null} */}
					<TransformerComponent selectedShapeName={this.state.selectedName} />
				</Layer>
			</Stage>
		);
	}
}

ReactCanvas.propTypes = {
	images: PropTypes.element.array,
	width: PropTypes.element.number,
	height: PropTypes.element.number
};

ReactCanvas.defaultProps = {
	images: [],
	width: 500,
	height: 500
};
