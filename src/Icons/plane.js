/*jshint esversion: 6 */
import React from 'react';
import planepath from './planepath.js';
const SVG = ({
    style = {},
    fill = '#fff',
    className = '',
    height = '64px',
    width = ''
  }) =>
    <svg 
    style={style}
    className={className}
    fill={fill}
    width={width}
    height={height}
    viewBox="0 0 1325.3333 545.33331">
      {planepath}
    </svg>
;

export default SVG;