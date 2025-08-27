import React from 'react';
export function CheckboxIcon({ className, indeterminate }) {
    return (React.createElement("svg", { className: className, focusable: false, role: "presentation", viewBox: "0 0 24 24" }, indeterminate ? (React.createElement("rect", { fill: "currentColor", height: "4", width: "16", x: "4", y: "10" })) : (React.createElement("polygon", { fill: "currentColor", points: "9.3,19 3,12.8 5.3,10.4 9.3,14.3 18.7,5 21,7.3 " }))));
}
