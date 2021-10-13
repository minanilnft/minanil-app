import React, { Component } from 'react';
import '../App.css';
import web3 from '../web3';
import minanil from '../Minanil';
import {
  Button,
  Container,
  Icon,
  Menu,
  Segment,
  Label,
  Grid,
  List,
  Header

} from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';

class CustomLayout extends React.Component {

  state = {
    web3Connected: false,
    // polygonNetwork:false
  };


  componentDidMount() {
    // const { pathname } = this.props.location;
    // console.log(pathname);
    // this.setCurrentMenuItemActive();

    this.initPageData();

  }

  initPageData = async () => {

    let accounts;
    let w3Available = false;

    if (web3 !== null && minanil !== null) {
      // console.log(web3.version);
      // get network
      const networkId = await window.ethereum.request({
        method: "net_version",
      });
      console.log("Connected to network", networkId, typeof (networkId));
      if (networkId === "137") {
        console.log("Connected to network inside", networkId);

        // make sure connected to polygon
        accounts = await web3.eth.getAccounts();
        // console.log(accounts);
        if (accounts.length > 0) {
          w3Available = true;
        }
        else {
          w3Available = false;

        }
      }
      // console.log("Got3");

    }
    else {
      w3Available = false;

    }
    this.setState({ web3Connected: w3Available });




  };



  handleConnectWeb3Click = (event, data) => {
    // console.log("web3 connect clicked");
    // console.log(event);
    // console.log(data);
    try {
      // Request account access if needed
      window.ethereum.enable();
      // Acccounts now exposed

      // this.setState({ web3Connected: true });
      this.initPageData();
    } catch (error) {
      // User denied account access...
      console.log("Unable to enable web3");
      this.setState({ web3Connected: false });

    }
  }




  render() {
    // const { children } = this.props
    const fixed = this.state.fixed;
    let userLayout = null;

    var authMenuItems = null;

    let userWeb3Comp = null;

    if (this.state.web3Connected === true) {
      userWeb3Comp = (
        <Label as='a'>
          <Icon name='circle' /> connected
        </Label>
      );
    }
    else {
      userWeb3Comp = (
        <Label as='a' onClick={this.handleConnectWeb3Click}>
          <Icon name='circle outline' /> connect
        </Label>
      );
    }

    userLayout = (
      <div>
        <Segment
          inverted
          textAlign='center'
          vertical
        >
          <Menu
            inverted
            pointing
            secondary
            stackable
          >
            <Container>

              <Menu.Item name="Home" link >
                <Link to={{ pathname: "/" }} >
                  home
                </Link>
              </Menu.Item>


              <Menu.Item name="About" link>
                <Link to={{ pathname: "/about" }} >
                  about
                </Link>
              </Menu.Item>

              <Menu.Item position='right'>
                {userWeb3Comp}

              </Menu.Item>
            </Container>
          </Menu>
        </Segment>
        {this.props.children}
        <Segment inverted vertical style={{ padding: '5em 0em' }}>
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Header inverted as='h4' content='Opensea' />
                  <List link inverted>
                    <List.Item as='a' target="_blank" href="https://opensea.io/collection/minanil">view collection</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Header inverted as='h4' content='Polygon' />
                  <List link inverted>
                    <List.Item as='a' target="_blank" href="https://polygonscan.com/address/0x28e354b665f06c602d34420f166e0afba877f1cc">view contract</List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </div>



    );


    return (
      <div>
        {userLayout}
      </div>
    );
  }

}

export default withRouter(CustomLayout);

