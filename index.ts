import express from "express";
import cors from "cors";
import {Octokit} from "@octokit/rest";

const octokit = new Octokit();
const app = express();

app.use(cors())

app.get('/', async (_,res) => {
    try {
        let modpacks = (await octokit.repos.listForOrg({
            org: "MRS-modpack",
            type: "public"
        })).data.map(x => x.full_name)

        res.send(modpacks);
    } catch (e) {
        console.log(e);
    }
})

app.listen(5000, '127.0.0.1', () => console.log("Server Started on 127.0.0.1:5000"))
