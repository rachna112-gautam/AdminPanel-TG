import React, { Component } from 'react';
import Particles from "react-particles-js";
import './App.css';
import Admin from './component/Admin';
import BlockchainProvider from './BlockchainProvider/index';
import TronWeb from "tronweb";
import Utils from "./BlockchainProvider/config";


const FOUNDATION_ADDRESS = "TWiWt5SEDzaEqS6kE5gandWMNfxR2B5xzg";
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {

			loading: false,
			account: "0x",
			tronWeb: {
				installed: false,
				loggedIn: false,
			},
		};
		this.withdraw = this.withdraw.bind(this);
		this.getReleaseAmount = this.getReleaseAmount.bind(this);
		this.releaseAmount = this.releaseAmount.bind(this);
	}

	async componentDidMount() {
		this.setState({ loading: true });
		await new Promise((resolve) => {
			const tronWebState = {
				installed: !!window.tronWeb,
				loggedIn: window.tronWeb && window.tronWeb.ready,
			};

			if (tronWebState.installed) {
				this.setState({
					tronWeb: tronWebState,
				});

				return resolve();
			}

			let tries = 0;

			const timer = setInterval(() => {
				if (tries >= 10) {
					const TRONGRID_API = "https://api.trongrid.io";

					window.tronWeb = new TronWeb(
						TRONGRID_API,
						TRONGRID_API,
						TRONGRID_API
					);

					this.setState({
						tronWeb: {
							installed: false,
							loggedIn: false,
						},
					});

					clearInterval(timer);
					return resolve();
				}

				tronWebState.installed = !!window.tronWeb;
				tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

				if (!tronWebState.installed) return tries++;

				this.setState({
					tronWeb: tronWebState,
				});

				resolve();
			}, 100);
		});

		if (!this.state.tronWeb.loggedIn) {
			// Set default address (foundation address) used for contract calls
			// Directly overwrites the address object as TronLink disabled the
			// function call
			window.tronWeb.defaultAddress = {
				hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
				base58: FOUNDATION_ADDRESS,
			};

			window.tronWeb.on("addressChanged", () => {
				if (this.state.tronWeb.loggedIn) {
					return;
				}
				this.setState({
					tronWeb: {
						installed: true,
						loggedIn: true,
					},
				});
			});
		}
		await Utils.setTronWeb(window.tronWeb);
		console.log("contract", Utils.contract)
		this.setState({ account: window.tronWeb.defaultAddress.base58 })
		await this.initContractData()
	}

	async initContractData() {
		let withdrawableAmount = (await Utils.contract.methods.getAdminWithdrawableAmount(this.state.account).call()).toNumber() / 10 ** 6;
		console.log("withdrawable", withdrawableAmount)
		this.setState({ withdrawableAmount })
	}
	async withdraw() {
		let res;
		try {
			res = (await Utils.contract.methods.withdrawAdminAmount().send({ from: this.state.account, callValue: 0 }))
			if (res) {
				window.location.reload()
			}
		}
		catch (e) {
			console.log("error", e)
		}
	}
	async getReleaseAmount(id) {

		try {
			(Utils.contract.methods.getPrevHoldById(id).call()).then((res) => {
				console.log("ress", res.toNumber());
				return res.toNumber()
			})

		}
		catch (e) {
			console.log("error", e)
		}
	}
	async releaseAmount(id, amount) {
		let res;
		try {
			(Utils.contract.methods.id2Address(id).call()).then((addr) => {
				Utils.contract.methods.releaseHoldAmount(addr, amount).send({ from: this.state.account, callValue: 0 }).then((res) => {
					console.log("res", res);
				})

			})

		}
		catch (e) {
			console.log("error", e)
		}
	}
	render() {
		return (
			<div className="App">
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
				<Admin withdrawableAmount={this.state.withdrawableAmount}
					withdraw={this.withdraw}
					getReleaseAmount={this.getReleaseAmount}
					releaseAmount={this.releaseAmount} />
			</div>
		);
	}
}

export default App;
