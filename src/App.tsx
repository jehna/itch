import React, { useState } from 'react';
import './App.css';
import Symbol from './Symbol';
import styled from 'styled-components';
import readStr from './compiler/reader'
import prStr from './compiler/printer'
import { getValue, isSymbol } from './compiler/symbol'
import Connector from './Connector'

const Debug = styled.pre`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 300px;
  height: 150px;
  border: 3px double #000;
`

type Ast = number | {} | Ast[]

const INITIAL_STATE = '(+ 1 1)'

const App = () => {
  const [ast, setAst] = useState<Ast>(readStr(INITIAL_STATE))

  return (
    <>
    <svg>
      <Renderer ast={Array.isArray(ast) ? ast : []} />
    </svg>
    <Debug>
      {prStr(ast)}
    </Debug>
    </>
  );
}

const Renderer: React.FC<{ ast: Ast[] }> = ({ ast }) => {
  const [positions, setPositions] = useState<[number, number][]>(ast.map((_,i) => [50 + Math.random() * (window.innerWidth - 100), Math.random() * (window.innerHeight - 300)]))

  return (
    <>
      {ast.length >= 2 && ast.slice(1).map((_, i) => <Connector key={i} from={positions[0]} to={positions[i+1]} />)}
      {ast.map((item, i) => <Symbol key={i} position={positions[i]} onChangePosition={pos => setPositions(nth(i, pos, positions))}>{isSymbol(item) ? getValue(item): item}</Symbol>)}
    </>
  )
}

const nth = <T,>(index: number, newItem: T, oldItems: T[]) => [...oldItems.slice(0,index), newItem, ...oldItems.slice(index+1)]

export default App;
