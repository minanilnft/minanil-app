import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
// import { createMedia } from '@artsy/fresnel';
// import PropTypes from 'prop-types';
// import web3 from './web3';
import {
  Container,
  Divider,
  List,
  Segment,
  Message,
  Item
} from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';

class AboutView extends Component {

  componentDidMount() {
    document.title = "about";

  }


  render() {
    let userLayout;
    userLayout = (
      <div>

        <Segment textAlign='left'>

          <Container text>
            minanil is a collection of 1024 universally unique pieces of decentrailzed artwork available on the Polygon network.
          </Container>

          <Container text>
            <b>how to mint</b>
            <Divider />
            <List as="ol">
              <List.Item as="li">
                connect your MetaMask wallet to the Polygon network.
                <br />
                <Message size='mini' floating>
                  <Message.Content>
                    <a rel="noopener noreferrer" target="_blank" href="https://docs.polygon.technology/docs/develop/metamask/hello"> how to download and setup MetaMask </a>
                    <br />
                    <br />
                    <a rel="noopener noreferrer" target="_blank" href="https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask"> how to add the Polygon main network to your MetaMask wallet </a>

                  </Message.Content>
                </Message>
              </List.Item>
              <List.Item as="li">
                click mint
                <br />
                <Message size='mini' floating>
                  <Message.Content>
                    each piece costs 3 MATIC. ensure you <a rel="noopener noreferrer" target="_blank" href="https://docs.polygon.technology/docs/develop/fiat-on-ramp">have enough MATIC</a> in your wallet before clicking mint
                  </Message.Content>
                </Message>
              </List.Item>
            </List>
          </Container>

          <Container text>
            <b>what are NFTs</b>
            <Divider />
            <div>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/VVDOCCKczCw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
              </iframe>
            </div>
          </Container>

          <Container text>
            <b>useful links</b>
            <Divider />
            <List as="ul">
              <List.Item as="li">
                <Item.Header href="https://polygon.technology/" target='_blank'>Polygon project
                </Item.Header>
              </List.Item>
            </List>
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

export default withRouter(AboutView);

