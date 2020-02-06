import React, { useState } from "react"
import styled from "styled-components"

const Border = styled.rect<{ isDragging: boolean }>`
  stroke: #f00;
  fill: #fff;
  cursor: ${({ isDragging }) => isDragging ? 'grabbing' : 'grab'};
`

const Text = styled.text`
  font-size: 50px;
  transform: translate(50px, 50px);
  alignment-baseline: middle;
  dominant-baseline: middle;
  text-anchor: middle;
  pointer-events: none;
`

type Props = { position: [number, number], onChangePosition: (newPosition: [number, number]) => void }

const Symbol: React.FC<Props> = ({ position, onChangePosition, children }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState([0,0])
  const onMouseMove = (e: React.MouseEvent) => onChangePosition([position[0] + e.movementX, position[1] + e.movementY])
  const onTouchMove = (e: React.TouchEvent) => onChangePosition([e.touches[0].pageX - startPos[0], e.touches[0].pageY - startPos[1]])
  return (
    <g style={{transform: `translate(${position[0]}px, ${position[1]}px)`}}>
      <Border
        isDragging={isDragging}
        width="100"
        height="100"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onBlur={() => setIsDragging(false)}
        onMouseOut={() => setIsDragging(false)}
        onTouchStart={(e)=> { setStartPos([e.touches[0].pageX - position[0], e.touches[0].pageY - position[1]]); setIsDragging(true) }}
        onTouchEnd={() => setIsDragging(false)}
        onMouseMove={isDragging ? onMouseMove : undefined}
        onTouchMove={isDragging ? onTouchMove : undefined}
      />
      <Text>{children}</Text>
    </g>
  )
}

export default Symbol
