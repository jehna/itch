import React, { useState } from "react"
import "./App.css"
import styled from "styled-components"
import readStr from "./compiler/reader"
import prStr from "./compiler/printer"
import Ast from "./Ast"
import RenderList from "./RenderList"

const Debug = styled.pre`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 300px;
  height: 150px;
  border: 3px double #000;
`

const INITIAL_STATE = "(? (+ 3 (- 2 1)))"

const App = () => {
  const [ast, setAst] = useState<Ast>(readStr(INITIAL_STATE))

  return (
    <>
      <svg>
        <RenderList ast={Array.isArray(ast) ? ast : []} />
      </svg>
      <Debug>{prStr(ast)}</Debug>
    </>
  )
}

export default App
