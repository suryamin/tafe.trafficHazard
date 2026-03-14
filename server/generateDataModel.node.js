//---------------------------------------------------//
// created: 25/02/2026                               //
// updated: 25/02/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: generateDataModel.node.js                //
// guide  : npm install -g ts-node typescript        //
//        : npm install quicktype-core               //
// how    : <Bash>ts-node generateDataModel.node.ts  //
// use    : to generate model automatically from API //
//---------------------------------------------------//

import axios from "axios";
import fs from "fs";
import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
} from "quicktype-core";

const API_URL = "https://api.transport.nsw.gov.au/v1/live/hazards/flood/all";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJOT1lKRHJEclZfcjk5OEFCTkQwMVJKRWRnRWFtZzhDSG4tTk1wWjZxNXFJIiwiaWF0IjoxNzcxOTA3ODM0fQ.xBhYXhSBalHQE4CGuKpOo9c8QRdKfVWcjPmd2dcWed4";

async function main() {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `apikey ${API_KEY}`,
      Accept: "application/json",
    },
  });

  const data = response.data;

  const jsonInput = jsonInputForTargetLanguage("typescript");
  await jsonInput.addSource({
    name: "TrafficHazardAll",
    samples: [JSON.stringify(data)],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const result = await quicktype({ inputData, lang: "typescript" });

  fs.writeFileSync("../models/TrafficHazardModel.ts", result.lines.join("\n"));
  console.log("-----> TrafficHazardModel.ts generated!!!");
}

main();
