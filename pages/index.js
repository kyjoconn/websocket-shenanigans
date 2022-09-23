import dynamic from 'next/dynamic'
import {draw, setup, mouseDragged} from "../p5";

const Sketch = dynamic(import('react-p5'), {ssr: false});
import React from "react";


const Home = () => {
    return (
        <Sketch setup={setup} draw={draw} mouseDragged={mouseDragged} />
    )
}

export default Home;