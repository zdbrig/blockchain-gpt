import React, { Component } from "react";
import { Tabs, Tab } from "material-ui/Tabs";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import "./css/TerminalAccess.css";
import Terminal from "react-bash";
import request from "superagent";
var apiBaseUrl = "http://localhost:5050/api";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import Iframe from "react-iframe";

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from "material-ui/Table";


async function getData(input) {
    return new Promise((resolve, reject) => {
        request
          .post(apiBaseUrl + "/execute-command")
          .send({ command: input })
          .set("Accept", "application/json")
          .set("Access-Control-Allow-Origin", "*")
          .end((err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
      });
};
async function _getCryptoCurrencyPrice(cryptoName, date) {
    cryptoName = cryptoName.toLowerCase();
   // If no date is specified, use today's date
   if (!date) {
     date = new Date().toISOString().slice(0, 10);
   }
 
   // Construct the API URL
   const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoName}/history?date=${date}`;
 
   // Fetch the data from the API
   const response = await fetch(apiUrl);
   const data = await response.json();
 
   // If the API returns an error, throw an error
   if (data.error) {
     throw new Error(data.error);
   }
 
   // Return the price in USD
   return data.market_data.current_price.usd;
 }
 
 async function _getCurrentCryptoCurrencyPrice(cryptoName) {
   cryptoName = cryptoName.toLowerCase();
   // Construct the API URL
   const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoName}`;
 
   // Fetch the data from the API
   const response = await fetch(apiUrl);
   const data = await response.json();
 
   // If the API returns an error, throw an error
   if (data.error) {
     throw new Error(data.error);
   }
 
   // Return the current price in USD
   return data.market_data.current_price.usd;
 }
async function  processServerResponse (data , commandWriter) {
    const codeRegex = /```(?:javascript)?\s*([\s\S]*?)\s*```/g;
    const codeMatch = codeRegex.exec(data);
  
    if (codeMatch) {
      const scriptContent = codeMatch[1].trim();
      const wrappedScript = `(async () => { ${scriptContent} })();`;
  
      try {
        let capturedOutput;
        const originalConsoleLog = console.log;
        console.log = commandWriter;
        const result = await eval(wrappedScript);
        return capturedOutput;
    } catch (error) {
        return `Error: ${error.message} \n script ${scriptContent}`;
      }
    } else {
      return `${data}\n`;
    }
  }


export default class TerminalAccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commandData: "",
      dialogOpen: false,
      applicationState: [],
      history: [{ value: "Welcome to the terminal!\n" }],
      structure: {
        public: {
          file1: {
            content: "The is the content for file1 in the <public> directory.",
          },
          file2: {
            content: "The is the content for file2 in the <public> directory.",
          },
          file3: {
            content: "The is the content for file3 in the <public> directory.",
          },
        },
        "README.md": { content: "Some readme" },
      },
    };
    this.extensions = {
        gpt: {
          exec:async ({ structure, history, cwd }, command) => {
            let result;
            try {
              await this.handleCommand(command.input)
              const res = await getData(command.input);
              await this.handleCommand("Execution in progress...")
              result= await processServerResponse(res.text , this.handleCommand);
            } catch (error) {
              await this.handleCommand(`Error: ${error.message}\n`)
            }
            return { structure, cwd, history };
          },
        }
      };
    this.actions = [
        <FlatButton
          label="Close"
          primary={true}
          keyboardFocused={true}
          onTouchTap={(event) => this.handleClose(event)}
        />,
      ];
    this.handleCommand = this.handleCommand.bind(this);

  }
  async handleCommand(input) {
    // Update the history state by concatenating a new object with the user's command to the end of the history array.
    this.setState((prevState) => ({
      history: prevState.history.concat({ value: `$ ${input}\n` }),
    }));

    // Call the Terminal's execCommand method to execute the command.
    // The result will be added to the history array in the extension's exec function.
  }
  handleClose(event) {
    this.setState({ dialogOpen: false });
  }
  render() {
    const { history, structure } = this.state;


    return (
      <MuiThemeProvider>
        <Tabs>
          <Tab label="GPT Terminal">
            <div className="parentContainer">
              <center>
                <h4>Run commands here</h4>
                <div style={{ flex: 1 }}>
                  <Terminal
                    history={history}
                    structure={structure}
                    extensions={this.extensions}
                    prefix={"$"}
                    //onCommand={this.handleCommand}
                  />
                </div>
              </center>
              <div>
                {this.state.commandData}
                <MuiThemeProvider>
                  <Dialog
                    title="Application Launcher"
                    actions={this.actions}
                    modal={true}
                    contentClassName="customDialog2"
                    open={this.state.dialogOpen}
                    onRequestClose={(event) => this.handleClose(event)}
                  >
                    {this.state.applicationState}
                  </Dialog>
                </MuiThemeProvider>
              </div>
            </div>
          </Tab>
        </Tabs>
      </MuiThemeProvider>
    );
  }
}
