import 'source-map-support/register'
import {clone} from "isomorphic-git"
import * as fs from "fs"
import * as path from "path"
import http from "isomorphic-git/http/node"
import axios from "axios"
import {getVersionList, install, installDependencies, installForge} from "@xmcl/installer";
import {launch, Version} from "@xmcl/core";
import {offline} from "@xmcl/user";
import {findJavaHomePromise} from "./findjava";


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
        const java = await findJavaHomePromise({allowJre: true})
        console.log("Start Installing Minecraft.")
        const mc = await install(mcver, dir)
        console.log("Start Installing Forge.")
        const forge = await installForge({
            version: resp.version.forge,
            mcversion: resp.version.minecraft
        }, dir)
        await installDependencies(await Version.parse(dir, forge))
        if (java !== null) {
            const credential = offline("Test")
            const process = await launch({
                accessToken: credential.accessToken,
                gamePath: dir,
                javaPath: path.join(java, "bin"),
                version: forge,
                minMemory: 7168,
                maxMemory: 7168,
                gameProfile: credential.selectedProfile,
                extraExecOption: {detached: true}
            });
            // @ts-ignore
            process.stdout.on('data', (b) => {
                // print mc output
                console.log(b.toString());
            });
            // @ts-ignore
            process.stderr.on('data', (b) => {
                // print mc err output
                console.log(b.toString());
            });
        } else {
            console.log("Cannot find java.")
        }
    } catch (e) {
        console.log(e)
    }


})()
