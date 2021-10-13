import React from 'react';
import { Route } from 'react-router-dom';


import HomeView from './containers/HomeView';
import AboutView from './containers/AboutView';

const BaseRouter = () => (
    <div>
        <Route exact path="/" component={HomeView} />
        <Route exact path="/about" component={AboutView} />
    </div>
);

export default BaseRouter;