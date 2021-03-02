import 'source-map-support/register'
import {clone} from "isomorphic-git"
import * as fs from "fs"
import * as path from "path"
import http from "isomorphic-git/http/node"
import axios from "axios"
import {getVersionList, install, installForge} from "@xmcl/installer";


(async () => {
    const resp = (await axios.get("http://localhost:5000")).data[0]
    const dir = path.join(process.cwd(), "instances", resp.name)
    if (!fs.existsSync(dir)) {
        try {
            console.log("Start Cloning.")
            await clone({fs, http, dir, url: `https://github.com/MRS-modpack/${resp.name}`})
        } catch (e) {
            console.log(e)
        }
    }
    const mcver = (await getVersionList()).versions.filter((element) => element.id == resp.version.minecraft)[0]
    try {
        console.log("Start Installing Minecraft.")
        await install(mcver, dir)
        console.log("Start Installing Forge.")
        await installForge(resp.version.forge, dir)
    } catch (e) {
        console.log(e)
    }


})()
