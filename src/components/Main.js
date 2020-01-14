import React, { Component } from "react";
import Identicon from "identicon.js";

class Main extends Component {
  render() {
    return (
      <div>
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "500px" }}
            >
              <div className="content mr-auto ml-auto">
                <p>&nbsp;</p>
                <form
                  onSubmit={event => {
                    event.preventDefault();
                    const name = this.name.value;
                    const price = this.price.value;
                    this.props.createProduct(
                      name,
                      window.web3.utils.toWei(price.toString(), "Ether")
                    );
                  }}
                >
                  <div className="form-group mr-sm-2">
                    <input
                      id="name"
                      type="text"
                      ref={input => {
                        this.name = input;
                      }}
                      className="form-control"
                      placeholder="Name of the product..."
                      required
                    />
                    <input
                      id="name"
                      type="text"
                      ref={input => {
                        this.price = input;
                      }}
                      className="form-control"
                      placeholder="price of the product"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    create product
                  </button>
                </form>
                <p>&nbsp;</p>
                {this.props.products.map((product, key) => {
                  return product.purchased ? (
                    void 0
                  ) : (
                    <div className="card mb-4" key={key}>
                      <div className="card-header">
                        <img
                          className="mr-2"
                          width="30"
                          height="30"
                          src={`data:image/png;base64,${new Identicon(
                            product.owner,
                            30
                          ).toString()}`}
                        />
                        <small className="text-muted">{product.owner}</small>
                      </div>
                      <ul
                        id="productList"
                        className="list-group list-group-flush"
                      >
                        <li className="list-group-item">
                          <p>{product.name}</p>
                        </li>
                        <li className="list-group-item">
                          <p>
                            {window.web3.utils.fromWei(
                              product.price.toString(),
                              "Ether"
                            )}
                          </p>
                        </li>
                        <li key={key} className="list-group-item py-2">
                          <button
                            name={product.id}
                            className="btn btn-link btn-sm float-right pt-0"
                            onClick={event => {
                              this.props.purchaseProduct(event.target.name);
                            }}
                          >
                            purchase
                          </button>
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
