import React, { Component } from "react";
import "./App.css";
import Marketplace from "../abis/Marketplace.json";
import Web3 from "web3";
import Navbar from "./Navbar";
import Main from "./Main";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-ethereum browser detected! Try install metamask!");
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    console.log(networkId);
    const networkData = Marketplace.networks[networkId];
    if (networkData) {
      const marketPlace = web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      console.log(marketPlace);
      this.setState({ marketPlace });
      const productCount = await marketPlace.methods.productCount().call();
      this.setState({ productCount });
      console.log(productCount);
      for (var i = 1; i <= productCount; ++i) {
        const product = await marketPlace.methods.products(i).call();
        this.setState({
          products: [...this.state.products, product]
        });
      }
      this.setState({ loading: false });
    }
  }

  createProduct = async (name, price) => {
    this.setState({ loading: true });
    await this.state.marketPlace.methods
      .createProduct(name, price)
      .send({ from: this.state.account });
    this.setState({ loading: false });
  };

  purchaseProduct = async id => {
    this.setState({ loading: true });
    let currproduct;
    this.state.products.map(product => {
      if (product.id.toString() === id.toString()) {
        currproduct = product;
      }
    });
    await this.state.marketPlace.methods.purchaseProduct(id).send({
      from: this.state.account,
      value: currproduct.price.toString()
    });
    this.setState({ loading: false });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      marketPlace: null,
      productCount: 0,
      products: [],
      loading: true
    };
  }

  render() {
    return (
      <div className="App">
        <Navbar account={this.state.account} />
        {this.state.loading ? (
          <div style={{ marginTop: 50, textAlign: "center" }}>Loading...</div>
        ) : (
          <Main
            createProduct={this.createProduct}
            purchaseProduct={this.purchaseProduct}
            products={this.state.products}
          />
        )}
      </div>
    );
  }
}

export default App;
