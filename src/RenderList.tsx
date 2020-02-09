import React, { useState } from "react"
import Connector from "./Connector"
import { getValue, isSymbol } from "./compiler/symbol"
import Ast from "./Ast"
import Symbol from "./Symbol"

const RenderList: React.FC<{
  ast: Ast[]
  initialPosition?: [number, number]
  onChangeInitialPosition?: (newPosition: [number, number]) => void
}> = ({ ast, initialPosition, onChangeInitialPosition }) => {
  const [positions, setPositions] = useState<[number, number][]>(
    ast.map((_, i) => [
      50 + Math.random() * (window.innerWidth - 100),
      Math.random() * (window.innerHeight - 300)
    ])
  )

  return (
    <>
      {ast.length >= 2 &&
        ast
          .slice(1)
          .map((_, i) => (
            <Connector
              key={i}
              from={positionForInput(i, initialPosition ?? positions[0])}
              to={positionForOutput(positions[i + 1])}
            />
          ))}

      {ast.map((item, i) =>
        Array.isArray(item) ? (
          <RenderList
            key={i}
            ast={item}
            initialPosition={positions[i]}
            onChangeInitialPosition={pos =>
              setPositions(nth(i, pos, positions))
            }
          />
        ) : (
          <Symbol
            key={i}
            position={
              i === 0 && initialPosition ? initialPosition : positions[i]
            }
            onChangePosition={
              i === 0 && onChangeInitialPosition
                ? onChangeInitialPosition
                : pos => setPositions(nth(i, pos, positions))
            }
          >
            {isSymbol(item) ? getValue(item) : item}
          </Symbol>
        )
      )}
    </>
  )
}

const positionForInput = (
  index: number,
  center: [number, number]
): [number, number] => [center[0] - 50, center[1] - 50 + index * 20]

const positionForOutput = (center: [number, number]): [number, number] => [
  center[0] + 50,
  center[1]
]

const nth = <T,>(index: number, newItem: T, oldItems: T[]) => [
  ...oldItems.slice(0, index),
  newItem,
  ...oldItems.slice(index + 1)
]

export default RenderList
