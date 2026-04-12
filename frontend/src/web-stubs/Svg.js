import React from 'react';

export const Svg = ({ children, width, height, ...props }) => (
  <svg width={width} height={height} {...props}>{children}</svg>
);
export const Rect = (props) => <rect {...props} />;
export const G = (props) => <g {...props} />;
export const Path = (props) => <path {...props} />;
export const Text = (props) => <text {...props} />;
export const Line = (props) => <line {...props} />;
export const Circle = (props) => <circle {...props} />;
export const Polygon = (props) => <polygon {...props} />;
export const Defs = (props) => <defs {...props} />;
export const LinearGradient = (props) => <linearGradient {...props} />;
export const Stop = (props) => <stop {...props} />;
export default Svg;
