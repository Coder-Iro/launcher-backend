import 'source-map-support/register'
import express from "express";
import cors from "cors";
import {Octokit} from "@octokit/rest";
import axios from "axios";

const octokit = new Octokit();
const app = express();

class Version {
    minecraft: string;
    forge: string

    constructor(mcver: string, forgever: string) {
        this.minecraft = mcver
        this.forge = forgever
    }
}

class Modpack {
    name: string;
    packname: string
    version: Version

    constructor(name: string, packname: string, mcver: string, forgever: string) {
        this.name = name
        this.packname = packname
        this.version = new Version(mcver, forgever)
    }
}

app.use(cors())

app.get('/', async (_, res) => {
    try {
        const modpacks = await Promise.all((await octokit.repos.listForOrg({
            org: "MRS-modpack",
            type: "public"
        })).data.map(x => x.name).map(async (element) => {
            const packdata = (await axios.get(`https://raw.githubusercontent.com/MRS-modpack/${element}/main/pack.json`)).data
            return new Modpack(element, packdata.name, packdata.mcversion, packdata.forgeversion)
        }))

        res.send(modpacks);
    } catch (e) {
        console.log(e);
    }
})

app.listen(5000, '127.0.0.1', () => console.log("Server Started on 127.0.0.1:5000"))
