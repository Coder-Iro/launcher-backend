import { clone } from "isomorphic-git"
import axios from "axios"

(async () => {
    const resp = (await axios.get("http://localhost")).data
})()