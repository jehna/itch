import React, { useState } from "react"
import styled from "styled-components"

export type DraggableProps = {
  position: [number, number]
  onChangePosition: (newPosition: [number, number]) => void
}

const DragArea = styled.g<{ isDragging: boolean }>`
  cursor: ${({ isDragging }) => (isDragging ? "grabbing" : "grab")};
`

const Draggable: React.FC<DraggableProps> = ({
  position,
  onChangePosition,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState([0, 0])
  const onMouseMove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChangePosition([position[0] + e.movementX, position[1] + e.movementY])
  }
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChangePosition([
      e.touches[0].pageX - startPos[0],
      e.touches[0].pageY - startPos[1]
    ])
  }

  return (
    <DragArea
      style={{ transform: `translate(${position[0]}px, ${position[1]}px)` }}
      isDragging={isDragging}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onBlur={() => setIsDragging(false)}
      onMouseOut={() => setIsDragging(false)}
      onTouchStart={e => {
        setStartPos([
          e.touches[0].pageX - position[0],
          e.touches[0].pageY - position[1]
        ])
        setIsDragging(true)
      }}
      onTouchEnd={() => setIsDragging(false)}
      onMouseMove={isDragging ? onMouseMove : undefined}
      onTouchMove={isDragging ? onTouchMove : undefined}
    >
      {children}
    </DragArea>
  )
}

export default Draggable
