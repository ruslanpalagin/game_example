import style from "./style.module.css";
import PropTypes from "prop-types";
import React from "react";

const GameTime = ({ time }) => (
    <div
        className={style.timer}
    >
        {`${time.h}:${time.m}`}
    </div>
);

GameTime.propTypes = {
    time: PropTypes.object.isRequired,
};

export default GameTime;
