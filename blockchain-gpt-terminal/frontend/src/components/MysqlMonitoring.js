import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import request from'superagent';
// import PieTooltip from 'react-d3-tooltip';
var PieTooltip = require('react-d3-tooltip').PieTooltip;

const apiBaseUrl="http://localhost:5050/api/";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
export default class MysqlMonitoring extends Component {
constructor(props){
    super(props);
    this.state={
        mysqlTables:[],
        toolTip:[]
    }
}
componentDidMount(){
request
  .get(apiBaseUrl+'getAllRecords')
  .set('Accept', 'application/json')
  .end((err, res)=>{
    // Calling the end function will send the request
    if(err){
        console.log("error occured");
    } 
    else{
        // console.log("res",JSON.stringify(res.body.result));
        let mysqlTables=[],tableHeader=[],tableHeaderColumn=[];
        let tableBody=[],tableRow=[],tableRowColumn=[]
        var mysqlResults = res.body.result;
        var teachersCount=0,studentCount=0;
        mysqlResults.map((item,index)=>{
            tableRowColumn=[];
            // console.log("items",item,index)
            if(index==0){
                for(var key in item){
                    if(item.hasOwnProperty(key)){
                        // console.log(key)
                        tableHeaderColumn.push(
                            <TableHeaderColumn>
                                {key}
                            </TableHeaderColumn>
                        )   
                    }
                }  
            }
            for(var key in item){
                    if(item.hasOwnProperty(key)){
                        // console.log(key)
                        if(key=="role" && item[key]=="student"){
                            studentCount++;
                        }
                        else if(key=="role" && item[key]=="teacher"){
                            teachersCount++;
                        }
                        tableRowColumn.push(
                            <TableRowColumn>
                                {item[key]}
                            </TableRowColumn>
                        )   
                    }
                }
            tableRow.push(
                    <TableRow>
                        {tableRowColumn}
                    </TableRow>
                )
        return item;
        })
        tableBody.push(
            <TableBody>
                {tableRow}
            </TableBody>
        )
        tableHeader.push(
             <TableHeader>
                <TableRow>
                    {tableHeaderColumn}
                </TableRow>
             </TableHeader>   
        )
        mysqlTables.push(
            <Table>
                {tableHeader}
                {tableBody}
            </Table>
        )
        var toolTip=[];
        
        // console.log("counts",studentCount,teachersCount)
        let data = [{
            name:"teacher",
            count:teachersCount
        },{
            name:"student",
            count:studentCount
        }]
        let value = function(d){
            // console.log("value",d);
            return d.count;
        }
        let fieldname = function(d){
            return d.name
        }
        let chartSeries = [
            {
                "field": "teacher",
                "name": "Teachers"
            },
            {
                "field":"student",
                "name":"Students"
            }
            ]
        toolTip.push(
            <div>
            <PieTooltip 
             title={"Teacher Student Ratio"}
             data={data}
             width={1000}
             name={fieldname}
             value={value}
             height={400}
             chartSeries={chartSeries}
            />
            </div>
        )
        this.setState({mysqlTables,toolTip})
    }
  });
}
render(){
    // console.log(this.state.mysqlTables);
    return(
        <div>
            <MuiThemeProvider>
            <Tabs>
            <Tab label="MysqlMonitoring" >
            {this.state.mysqlTables}
            {this.state.toolTip}
            </Tab>
            </Tabs>
            </MuiThemeProvider> 
        </div>    
    )
}
}
