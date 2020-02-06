import React from 'react'
import styled from 'styled-components'

type Props = { from: [number, number], to: [number, number] }

const Line = styled.line`
  stroke: #F00;
  stroke-width: 5px;
`

export default ({ from, to }: Props) => <Line x1={from[0] + 50} y1={from[1] + 50} x2={to[0] + 50} y2={to[1] + 50} />