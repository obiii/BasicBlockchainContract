const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface , bytecode} = require('../compile');

let accounts;
let inbox;
beforeEach( async() =>{
  // get a list of all accounts
  web3.eth.getAccounts()
  accounts = await web3.eth.getAccounts();

  // use of of those accounts to deploy the contarct
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode,arguments:['Hi There!']})
    .send({from:accounts[0], gas:'1000000'});

});

describe("Inbox",() => {
  it('deploys a contact', () => {

    assert.ok(inbox.options.address);

  });

  it('has a deafult msg',async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message,"Hi There!")
  });

  it('can change the msg',async () => {
    newMsg = "Bye There!"
    await inbox.methods.setMessage(newMsg).send({ from:accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message,newMsg)
  });
});
