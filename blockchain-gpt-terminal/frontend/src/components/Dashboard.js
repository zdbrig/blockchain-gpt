import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Iframe from 'react-iframe';


export default class Dashboard extends Component {
render(){
    return(
        <div>
            <MuiThemeProvider>
            <Tabs>
    <Tab label="System & Database Monitoring" >
      <Iframe url="http://localhost:3000/dashboard/db/prometheus-stats-working?from=1489925695713&to=1489925995713" />
    </Tab>
    
  </Tabs>
            </MuiThemeProvider> 
        </div>    
    )
}
}
