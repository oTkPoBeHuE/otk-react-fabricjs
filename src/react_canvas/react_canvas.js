import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer } from 'react-konva';
import Image from './image.js';
import {
	printImageData,
	// getImageByName,
	changeImageByName
} from '../utils/utils';
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
		console.log('data', data);
		const newImagePositions = changeImageByName({
			images: this.props.images,
			name: data.name,
			func: image => ({ ...image, ...data })
		});

		this.props.updateImagePosition(newImagePositions);
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
		console.log('##image', image);

		return image ? (
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
		) : null;
	}

	render() {
		const { width, height, images } = this.props;
		return (
			<Stage width={width} height={height} ref={node => (this.stageRef = node)} onMouseDown={this.handleStageMouseDown}>
				<Layer>
					{images
						? Object.keys(images)
								.map(imageName => images[imageName])
								.map(this.printImage)
						: null}
					<TransformerComponent selectedShapeName={this.state.selectedName} />
				</Layer>
			</Stage>
		);
	}
}

ReactCanvas.propTypes = {
	images: PropTypes.object.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired
};

ReactCanvas.defaultProps = {
	// images: [],
	// width: 500,
	// height: 500
};
