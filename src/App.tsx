import React from 'react';
import './App.css';
import ThreeScene from './components/ThreeScene'

type ControlProps = {
  onSpeedChange: Function
}

function Controls({onSpeedChange}: ControlProps){


  return (
    <div>
      <label>Change Speed: <input onChange={
        (e)=>onSpeedChange(parseFloat(e.target.value) || 0)}>
          </input></label>
    </div>
  )
}

function App() {
  const [speed, setSpeed] = React.useState(0.01);
  function changeSpeed(val:number){
    setSpeed(val);
  }
  return (
    <>
    <Controls onSpeedChange={changeSpeed}/> 
    <ThreeScene speed={speed}/>
    </>
  );
}

export default App;
