import React, { Component } from 'react';
import '../App.css';
import web3 from '../web3';
import {
  Button,
  Container,
  Header,
  Icon,
  Segment,
  Dropdown,
  Modal,
  Form,
  Message,
  Loader,
  Label,
  Grid,
  List
} from 'semantic-ui-react';
import minanil from '../Minanil';
import { Link, withRouter } from 'react-router-dom';
import ani from '../animated.gif';
import _ from 'lodash';


const WEI_COST = 3000000000000000000;
const GAS_LIMIT = 285000;
const CONTRACT_ADDR = "0x28e354b665f06C602d34420F166E0AFba877F1Cc";

class HomeView extends Component {


  state = {
    curMsg: "",
    value: "",
    message: "",
    accountsAvailable: false,
    accountList: [],
    cRoundStartTime: null,
    userCanCallNext: false,
    loading: false,
    numMint: 1,
    contractOwner: "",
    totalSupply: -1,
    errorModalOpen: false,
    successModalOpen: false,
    polygonConected: false
  };



  componentDidMount() {
    document.title = "home";
    this.initPageData();

  }

  initPageData = async () => {

    let accounts = [];
    let accAvailable = false;
    let usrNxt = false;
    let owner = "";
    let totalSupply = -1;
    let polygonConected = false;
    let numRemaining;


    if (web3 !== null && minanil !== null) {
      const networkId = await window.ethereum.request({
        method: "net_version",
      });
      console.log("Connected to network", networkId);
      if (networkId === "137") {
        // make sure on poly

        accounts = await web3.eth.getAccounts();
        console.log(accounts);
        if (accounts.length > 0) {
          accAvailable = true;
          polygonConected = true;

          try {
            owner = await minanil.methods.owner().call();
            totalSupply = await minanil.methods.totalSupply().call();

            numRemaining = 1024 - parseInt(totalSupply);
            console.log("Contract owner & supply", owner, totalSupply, typeof (totalSupply), numRemaining);
          } catch (error) {
            console.log("Error, unable to get owner. Err:", error);
          }


        }
        else {
          accAvailable = false;
          usrNxt = false;
          polygonConected = false;


        }
      }
    }
    else {
      accAvailable = false;
      usrNxt = false;
      polygonConected = false;

    }
    this.setState({
      accountsAvailable: accAvailable,
      userCanCallNext: usrNxt,
      accountList: accounts,
      contractOwner: owner,
      totalSupply: totalSupply,
      polygonConected: polygonConected,
      numRemaining: numRemaining
    });

  };



  handleChangeNumMint = (e, { name, value }) => {
    console.log("User changed num mint", value, name);
    // now try call next round async
    // this.callNextRoundPickWinner();
    this.setState({ numMint: value });

  }



  getOptions = (number, prefix = '') =>
    _.times(number, (index) => ({
      key: index + 1,
      text: `${prefix}${index + 1}`,
      value: index + 1,
    }))

  handleClickMint = () => {
    const numMint = this.state.numMint;

    console.log("Minting ", numMint, "NFTs");
    this.mintOnChain(numMint);



  }

  mintOnChain = async (mintAmount) => {
    // event.preventDefault();

    let cost = WEI_COST;
    let gasLimit = GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);

    try {
      const accounts = await web3.eth.getAccounts();

      this.setState({ message: "Pending", loading: true });
      console.log(accounts, accounts[0]);
      console.log("Contract owner", this.state.contractOwner);

      if (accounts[0] === this.state.contractOwner) {
        console.log("You are owner of contract, no charge");

        await minanil.methods
          .mint(mintAmount)
          .send({
            gasLimit: String(totalGasLimit),
            to: CONTRACT_ADDR,
            value: String("0"),
            from: accounts[0]
          })
          .once("error", (err) => {
            console.log(err);
            console.log("Sorry, something went wrong please try again later.");
            this.setState({ message: "Error", loading: false, errorModalOpen: true });

          })
          .then((receipt) => {
            console.log(receipt);
            console.log(
              `WOW, the minanil is yours! go visit Opensea.io to view it.`
            );
            this.setState({ message: "Done", loading: false, successModalOpen: true });

          });
      }
      else {
        console.log("Not contract owner, charging");
        await minanil.methods
          .mint(mintAmount)
          .send({
            gasLimit: String(totalGasLimit),
            to: CONTRACT_ADDR,
            value: totalCostWei,
            from: accounts[0]
          })
          .once("error", (err) => {
            console.log(err);
            console.log("Sorry, something went wrong please try again later.");
            this.setState({ message: "Error", loading: false, errorModalOpen: true });

          })
          .then((receipt) => {
            console.log(receipt);
            console.log(
              `WOW, the minanil is yours! go visit Opensea.io to view it.`
            );
            this.setState({ message: "Done", loading: false, successModalOpen: true });


          });
      }





    }
    catch (error) {
      console.log("Error submitting. Err:", error);
      this.setState({ message: "Error", loading: false });

    }



  };


  setOpenErrorModal = (isOpen) => {
    console.log("about to set error modal", isOpen);
    this.setState({ errorModalOpen: isOpen });

  }

  setOpenSuccessModal = (isOpen) => {
    console.log("about to set success modal", isOpen);
    this.setState({ successModalOpen: isOpen });

  }






  render() {
    let userLayout;
    let mintButton = null;


    if (this.state.accountsAvailable === true && this.state.polygonConected === true) {
      mintButton = (
        <div>
          <Form loading={this.state.loading}>
            <Dropdown

              scrolling
              defaultValue={1}
              options={this.getOptions(20)}
              style={{ marginRight: '15px' }}
              onChange={this.handleChangeNumMint}
            />
            <Button as='div' labelPosition='right'>
              <Button primary size='huge' onClick={this.handleClickMint}>
                mint
              </Button>
              <Label as='a' basic pointing='left'>
                (3 MATIC each)
              </Label>
            </Button>
          </Form>

        </div>
      );
    }
    else {
      mintButton = (
        <div>
          <Form disabled>
            <Dropdown
              disabled
              scrolling
              defaultValue={1}
              options={this.getOptions(20)}
              style={{ marginRight: '15px' }}
              onChange={this.handleChangeNumMint}
            />
            <Button disabled as='div' labelPosition='right'>
              <Button disabled primary size='huge' onClick={this.handleClickMint}>
                mint
              </Button>
              <Label disabled as='a' basic pointing='left'>
                (3 MATIC each)
              </Label>
            </Button>
          </Form>
          <p>(unable to connect to the Polygon network - Refresh the page OR try installing MetaMask to mint)</p>
        </div>
      );
    }





    userLayout = (
      <Segment
        textAlign='center'
        style={{ padding: '1em 0em', height: '100vh' }}
        vertical
      >
        <Container text>
          <div className="text">
            <span>m</span>
            <span>i</span>
            <span>n</span>
            <span>a</span>
            <span>n</span>
            <span>i</span>
            <span>l</span>

          </div>
          <Header
            as='h1'
            content='1024 uniquely produced pieces of artwork.'
            inverted
            style={{
              fontSize: '2em',
              fontWeight: 'normal',
              marginBottom: '1em',
              marginTop: '1em',
              color: '#000'
            }}
          />

          <Container>
            <div style={{ marginBottom: '1em' }}>
              <Message compact >
                <p>
                  each piece is hosted on IPFS and linked to a ERC721 (NFT) token stored on the Polygon blockchain
                </p>
              </Message>
            </div>
          </Container>

        </Container >
        <Container>
          <div>
            <div style={{ marginBottom: '2em' }}>
              {mintButton}
            </div>
            {this.state.curMsg}
          </div>



        </Container>
        <Container>
          <section id="container">

            <div class="thumbnail"
              data-title="minanil">
              <img src={ani} alt="minanilgif" width="200">
              </img>
            </div>
            <p>{this.state.numRemaining} pieces available</p>
          </section>

        </Container>


        <Modal
          onClose={() => this.setOpenSuccessModal(false)}
          onOpen={() => this.setOpenSuccessModal(true)}
          open={this.state.successModalOpen}
          size='small'
          centered
        >
          <Header icon>
            <Icon name='check' />
            success
          </Header>
          <Modal.Content>
            the minanil NFT is yours. visit Opensea.io to view it
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' onClick={() => this.setOpenSuccessModal(false)}>
              ok
            </Button>
          </Modal.Actions>
        </Modal>

        <Modal
          onClose={() => this.setOpenErrorModal(false)}
          onOpen={() => this.setOpenErrorModal(true)}
          open={this.state.errorModalOpen}
          size='small'
          centered
        >
          <Header icon>
            <Icon name='times' />
            error
          </Header>
          <Modal.Content>
            there was an issue minting the NFT. please try again
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={() => this.setOpenErrorModal(false)}>
              ok
            </Button>
          </Modal.Actions>
        </Modal>
      </Segment >

    );


    return (
      <div>
        {userLayout}

      </div>
    );
  }

}

export default withRouter(HomeView);

