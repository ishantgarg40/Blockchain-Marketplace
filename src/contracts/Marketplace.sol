pragma solidity ^0.5.0;

contract Marketplace {
  string public name;

  uint public productCount = 0;

  mapping(uint => Product) public products;
  
  struct Product {
    uint id;
    string name;
    uint price;
    address payable owner;
    bool purchased;                                             
  }

  event productCreated(
    uint id,
    string name,
    uint price,
    address payable owner,
    bool purchased
    );

    event productPurchased(
      uint id,
      string name,
      uint price,
      address payable owner,
      bool purchased
      );

  constructor() public{
    name = "My Marketplace";
  }

  function createProduct(string memory _name, uint _price) public {
      require(bytes(_name).length > 0, "Invalid product name");
      require(_price > 0, "Invalid Product Price");
      productCount ++;
      Product memory _product = Product(productCount, _name, _price, msg.sender, false);
      products[productCount] = _product;
      emit productCreated(productCount, _name, _price, msg.sender, false);

  }

  function purchaseProduct(uint _id) public payable{
    require(_id > 0 && _id <= productCount, "Invalid Id");
    Product memory _product = products[_id];
    require(msg.value >= _product.price, "Inadequate money");
    require(!_product.purchased,"product already purchased");
    address payable _seller = _product.owner;
    require(msg.sender != _seller, "seller can't be buyer");
    address(_seller).transfer(msg.value);
    _product.owner = msg.sender;
    _product.purchased = true;
    products[_id] = _product;
    emit productPurchased(productCount,_product.name, _product.price, _product.owner, true);
  }
}