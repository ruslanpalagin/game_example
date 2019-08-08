import style from "./style.module.css";
import PropTypes from "prop-types";
import React from "react";

const HpBarBig = ({ className, width, theme, label }) => (
    <div
        className={`${style.hpBarBig} ${style[theme]} ${className}`}
    >
        {label}
        <div className={style.value} style={{ width: width + "%" }} />
    </div>
);

HpBarBig.propTypes = {
    className: PropTypes.string,
    theme: PropTypes.oneOf(["", "target"]),
    width: PropTypes.number.isRequired,
    label: PropTypes.string,
};

HpBarBig.defaultProps = {
    className: "",
    theme: "",
    label: "",
};

export default HpBarBig;
