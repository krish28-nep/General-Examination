"use client";
import React from "react";

export const Spinner = () => {
  return (
    <div className="eye">
      <svg className="sharingan" viewBox="0 0 100 100">
        <g id="full_pupil">
          <circle id="iris" r="30" cx="50%" cy="50%" />
          <circle id="pupil" r="10" cx="50%" cy="50%" />

          <text
            id="iris_anomaly"
            className="iris_anomaly"
            transform="rotate(180 30,8)"
          >
            ,
          </text>
          <use
            href="#iris_anomaly"
            transform="rotate(120 50,50)"
            fill="black"
          />
          <use
            href="#iris_anomaly"
            transform="rotate(240 50,50)"
            fill="black"
          />
        </g>
      </svg>
    </div>
  );
};
