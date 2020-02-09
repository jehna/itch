import React from "react"
import styled from "styled-components"
import Draggable, {DraggableProps}  from './Draggable'

const Border = styled.rect`
  stroke: #f00;
  fill: #fff;
`

const Text = styled.text`
  font-size: 50px;
  transform: translate(50px, 50px);
  alignment-baseline: middle;
  dominant-baseline: middle;
  text-anchor: middle;
  pointer-events: none;
`

const Symbol: React.FC<DraggableProps> = ({ position, onChangePosition, children }) => {

  return (
    <Draggable position={position} onChangePosition={onChangePosition}>
      <Border
        width="100"
        height="100"
      />
      <Text>{children}</Text>
    </Draggable>
  )
}

export default Symbol
