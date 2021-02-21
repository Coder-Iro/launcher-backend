import express from "express";
import cors from "cors";
import {Octokit} from "@octokit/rest";

const octokit = new Octokit();
const app = express();

app.use(cors())

app.get('/', async (_,res) => {
    let modpacks = await octokit.repos.listForOrg({
        org: "MRS-modpacks",
        type: "public"
    })
    res.send(modpacks);
})

app.listen(5000, '127.0.0.1')
