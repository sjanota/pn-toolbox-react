const express = require('express');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const cors = require('cors');

const app = express();
app.use(cors({origin: '*'}));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/setpnconfig', async (req, res) => {
  console.log("/setpnconfig");
  console.log("req.query", req.query);
  
  const result = await setPnConfigProp(req.query);

  console.log("result", result);
  res.send(result);
}); 

app.put('/pnconfig', async (req, res) => {
  console.log("req", req);
  console.log("req.body", req.body);
  const result = await setPnConfigProp(req.body);

  console.log("result", result);
  res.send(result);
}); 


const setPnConfigProp = async (params) => {
  console.log("setPnConfigProp");
  // user, subkey, name, value
  try {
    // if (params.prop == null || params.prop === "") {
    //   console.log("prop not provided");
    //   // send error
    // }
    // else if (params.value == null && params.value === "") {
    //   console.log("value not provided");
    //   // send error

    // }

    
    let pnconfigcmd = `/Users/pubnubcvconover/Developer/pubnub/gits/pnconfig-cli/pnconfig-cli.py --email ${params.user}@pubnub.com ${params.subkey} ${params.prop} ${params.value}`;
    console.log("pnconfigcmd", pnconfigcmd);

    // pnconfigcmd = pnconfigcmd + ` ${params.prop}`;
    
    const { stdout, stderr } = await exec(pnconfigcmd, ["-i"]);

    if (stderr) {
      console.error("error");
      return stderr;
    }
    else {
      console.log("success");

      // if (params.prop !=null && params.prop !== "") {
      //   const data = {"properties": JSON.parse(stdout) };
      //   console.log("data", data);
      //   return data;
      // }
      // else if (params.filter !=null && params.filter !== "") {
      //   const data = JSON.parse('{"properties":{' + stdout.replace(/\s/g, "").slice(0, -1) + '}}');
      //   console.log("data", data);
      //   return data;
      // }

      return stdout;
    }
  }
  catch (error) {
    console.error("error");
    return error;
  }
}


app.get('/pnconfig', async (req, res) => {
  debugger;
  console.log("req.query", req.query);
  const result = await getPnConfigProps(req.query);

  console.log("result", result);
  res.send(result);
}); 

const getPnConfigProps = async (params) => {
  console.log("getPnConfigProps");

  try {
    let pnconfigcmd = `/Users/pubnubcvconover/Developer/pubnub/gits/pnconfig-cli/pnconfig-cli.py --email ${params.user}@pubnub.com ${params.subkey}`;

    if (params.prop != null && params.prop !== "") {
      console.log("prop query", params.prop);
      pnconfigcmd = pnconfigcmd + ` ${params.prop}`;
    }
    else if (params.filter !=null && params.filter !== "") {
      console.log("filter query", params.filter);
      pnconfigcmd = pnconfigcmd + ` | egrep '${params.filter}'`
    }

    const { stdout, stderr } = await exec(pnconfigcmd, ["-i"]);

    if (stderr) {
      console.error("error");
      return stderr;
    }
    else {
      console.log("success");
      if (params.prop !=null && params.prop !== "") {
        const data = {"properties": JSON.parse(stdout) };
        console.log("data", data);
        return data;
      }
      else if (params.filter !=null && params.filter !== "") {
        const data = JSON.parse('{"properties":{' + stdout.replace(/\s/g, "").slice(0, -1) + '}}');
        console.log("data", data);
        return data;
      }

      return stdout;
    }
  }
  catch (error) {
    console.error("error");
    return error;
  }
}