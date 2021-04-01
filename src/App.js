import React, { Component } from 'react';
import Particles from "react-particles-js";
import './App.css';
import Admin from './component/Admin';

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
			(Utils.contract.methods.id2Address(id).call()).then((addr) => {
				(Utils.contract.methods.users(addr).call()).then((res) => {
					console.log("ress", res.prevHold.toNumber());
					this.setState({
						amount: res.prevHold.toNumber()
					})
				})
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

	async changePrice(newPrice) {
		try {
			await Utils.contract.methods.changePrice(newPrice).send({ from: this.state.account, callValue: 0 })
		}
		catch (e) {
			console.log("error", e)
		};
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
				<div className="container admin">
					<h1>Welcome to Admin Panel</h1>
					<div className=" row">
						<div className="col-lg-6 left">
							<h2>Withdrawable Amount</h2>
							<span className="withdraw-amnt">{this.state.withdrawableAmount}</span>
							<button type="button" className="btn btn-grad" onClick={() => {
								this.withdraw()
							}}>Withdraw</button>
						</div>

						<div className="col-lg-6 right">
							<h2>Release Amount Info</h2>
							<div class="input-group mb-3">
								<div class="input-group-prepend">
									<span class="input-group-text" id="basic-addon1">ID</span>
								</div>
								<input type="text" class="form-control" placeholder="Enter ID" aria-label="ID" aria-describedby="basic-addon1" onChange={(r) => {
									this.setState({
										checkId: r.target.value
									})
								}} />

							</div>
							<span className="withdraw-amnt">{this.state.amount}</span>
							<button type="button" className="btn btn-grad" onClick={() => {
								this.getReleaseAmount(this.state.checkId)

								// setAmount(amount)
							}}>check release amount</button>
							<hr />
							<div class="input-group mb-3">
								<div class="input-group-prepend">
									<span class="input-group-text" id="basic-addon2">ID</span>
								</div>
								<input type="text" class="form-control" placeholder="Enter ID" aria-label="ID" aria-describedby="basic-addon2" onChange={(r) => {
									this.setState({
										releaseId: r.target.value
									})
								}} />

							</div>
							<div class="input-group mb-3">
								<div class="input-group-prepend">
									<span class="input-group-text" id="basic-addon3">TRX</span>
								</div>
								<input type="text" class="form-control" placeholder="Enter Amount" aria-label="Amount" aria-describedby="basic-addon3" onChange={(r) => {

									this.setState({
										releaseAmount: r.target.value
									})
								}} />

							</div>
							<button type="button" className="btn btn-grad" onClick={() => {
								console.log("rek", this.state.releaseId, this.state.releaseAmount)
								this.releaseAmount(this.state.releaseId, this.state.releaseAmount)

							}}>Release Amount</button>

							<div class="input-group mb-3">
								<div class="input-group-prepend">
									<span class="input-group-text" id="basic-addon3">TRX</span>
								</div>
								<input type="text" class="form-control" placeholder="Enter Amount" aria-label="Amount" aria-describedby="basic-addon3" onChange={(r) => {

									this.setState({
										newPrice: r.target.value
									})
								}} />

							</div>
							<button type="button" className="btn btn-grad" onClick={() => {
								this.state.newPrice ?
									this.changePrice(this.state.newPrice) :
									<div>Loading..</div>
							}}>Change Price</button>
						</div>
					</div>
				</div>

			</div>
		);
	}
}

export default App;
