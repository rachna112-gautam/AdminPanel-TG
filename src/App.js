import React from 'react';
import Particles from "react-particles-js";
import './App.css';
import Admin from './component/Admin';
import BlockchainProvider from './BlockchainProvider/index';
const App = () => {

	return (
		<div className="App">
			<BlockchainProvider />
			<Particles
				className="particles"
				params={{
					particles: {
						number: {
							value: 50,
						},
						size: {
							value: 3,
						},
					},
					interactivity: {
						events: {
							onhover: {
								enable: true,
								mode: "repulse",
							},
						},
					},
				}}
			/>
			<Admin />
		</div>
	);
}

export default App;
