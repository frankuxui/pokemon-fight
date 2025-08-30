import { cn } from 'src/lib/utils'
import React from 'react'

interface SvgSuccessAnimationProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  foreground?: string
  background?: string
}

export default function SvgSuccessAnimation (props: SvgSuccessAnimationProps) {
  const { size, width, height, className, style, foreground, background, ...rest } = props
  return (
    <svg
      width={width ?? size ?? 115}
      height={height ?? size ?? 115}
      viewBox='0 0 133 133'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      className={cn(className)}
      style={style}
      {...rest}
    >
      <g className='w-full h-full' id='check-group' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' >
        <circle className='fill-circle' id='filled-circle' fill={background ?? '#1b0bff'} cx='66.5' cy='66.5' r='60' />
        <circle id='white-circle' fill={foreground ?? '#FFFFFF'} cx='66.5' cy='66.5' r='55.5' />
        <circle className='circle-outline' id='outline' stroke={background ?? '#1b0bff'} strokeWidth='4' cx='66.5' cy='66.5' r='54.5' />
        <polyline id='check' className='check' stroke={foreground ?? '#FFFFFF'} strokeWidth='5' points='41 70 56 85 92 49' />
      </g>
    </svg>
  )
}