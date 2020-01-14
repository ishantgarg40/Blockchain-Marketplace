const Marketplace = artifacts.require("./Marketplace.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Marketplace", ([deployer, seller, buyer]) => {
  let marketplace;
  before(async () => {
    marketplace = await Marketplace.deployed();
  });

  describe("deployment", async () => {
    it("deployed succesfully", async () => {
      const address = await marketplace.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
    it("it has a name", async () => {
      const name = await marketplace.name();
      assert.equal(name, "My Marketplace");
    });
  });

  describe("products", async () => {
    let result, productCount;

    before(async () => {
      result = await marketplace.createProduct(
        "IphoneX",
        web3.utils.toWei("1", "Ether"),
        { from: seller }
      );
      productCount = await marketplace.productCount();
    });
    it("creates product", async () => {
      assert.equal(productCount, 1);
      const event = result.logs[0].args;
      assert.equal(
        event.id.toNumber(),
        productCount.toNumber(),
        "id is correct"
      );
      assert.equal(
        event.price.toString(),
        "1000000000000000000",
        "price is correct"
      );
      assert.equal(event.owner, seller, "owner is correct");
      assert.equal(event.purchased, false, "purchased is correct");

      await marketplace.createProduct("", web3.utils.toWei("1", "Ether"), {
        from: seller
      }).should.be.rejected;
    });
    it("lists products", async () => {
      let product = await marketplace.products(productCount);
      assert.equal(
        product.id.toNumber(),
        productCount.toNumber(),
        "id is correct"
      );
      assert.equal(product.name, "IphoneX", "name is correct");
      assert.equal(product.owner, seller, "owner is correct");
      assert.equal(product.price, "1000000000000000000", "price is correct");
      assert.equal(product.purchased, false, "purchased is correct");
    });
    it("selling product", async () => {
      let sellerOldBalance;
      sellerOldBalance = await web3.eth.getBalance(seller);
      sellerOldBalance = new web3.utils.BN(sellerOldBalance);
      let result = await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei("1", "Ether")
      });
      let event = result.logs[0].args;
      assert.equal(
        event.id.toNumber(),
        productCount.toNumber(),
        "id is correct"
      );
      assert.equal(
        event.price.toString(),
        "1000000000000000000",
        "price is correct"
      );
      assert.equal(event.owner, buyer, "owner is correct");
      assert.equal(event.purchased, true, "purchased is correct");

      await marketplace.purchaseProduct(productCount, {
        from: seller,
        value: web3.utils.toWei("1", "Ether")
      }).should.be.rejected;
      await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei("0.5", "Ether")
      }).should.be.rejected;
    });
  });
});
