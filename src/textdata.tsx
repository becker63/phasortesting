import { useState } from "react";
import { useListener } from "react-bus"

const TextData = () => {
    const [x, setx] = useState("nothing ere");
    const [y, sety] = useState("nothing ere");

    const updatedata = (payload:any) => {
        //ewie, gross one liner
        setx(payload.selectedAnnotation.xMax.toString().slice(0,-11) + "...");

        sety(payload.chartInstance.config.data.datasets[1].data[parseInt(payload.selectedAnnotation.xMax)].toString().slice(0,-13) + "...")
    }

    useListener("drag", (payload) => updatedata(payload))

    return(
        <div>
        <h1>x: {x}</h1>
        <h1>y: {y}</h1>
        </div>
    )
}

export default TextData