let cmd=require('node-cmd');
const callOpenAi = require('../callOpenAi'); 

exports.chatgpt = async (req,res)=>{
    const command = req.body.command;
    try {
        const result = await callOpenAi(command);
        res.send(result);
    }

    catch (error) {
        res.status(500).send(error.message);
    }    

}
