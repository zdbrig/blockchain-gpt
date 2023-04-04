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
            <Tab label="VNCaccess" >
                 <Iframe url="http://172.17.0.3:6901/vnc_auto.html?password=vncpassword" />
            </Tab>
            </Tabs>
            </MuiThemeProvider> 
        </div>    
    )
}
}
