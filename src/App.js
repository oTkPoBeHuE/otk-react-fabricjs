import React, { Component } from 'react';
import img1 from './images/img1.png';
import img2 from './images/img2.jpeg';
import img3 from './images/img3.png';

import { Canvas, Circle, Image, Path, Text } from './react_fabric/react-fabric.js';

class App extends Component {
	render() {
		return (
			<div width={'100%'} height={'100%'} className="App" style={{ backgroundColor: 'red' }}>
				<div style={{ backgroundColor: 'white', width: '300px', height: '500px' }}>
					<Canvas ref="canvas" width={300} height={500} style={{ backgroundColor: 'white' }}>
						<Image src={img1} ref="mainImage1" width={200} height={200} />
						<Image src={img2} ref="mainImage2" width={150} height={150} />
						<Image src={img3} ref="mainImage3" width={100} height={100} />
					</Canvas>
				</div>
			</div>
		);
	}
}

export default App;
