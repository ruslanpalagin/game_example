import "./style.css";
import React from "react";
import PropTypes from "prop-types";

const Login = ({ className, onChangeOption, options, onInitGameClick }) => (
    <div
        className={className}
    >
        <h1>Time Lancer</h1>
        <div>
            <label>
                Account ID:
                <input
                    type="text"
                    onChange={(event) => onChangeOption("accountId", parseInt(event.target.value, 10)) }
                    value={options.accountId}
                />
            </label>
        </div>
        <div>
            <label>
                Server Name:
                <select
                    value={options.serverName}
                    onChange={(event) => onChangeOption("serverName", event.target.value) }
                >
                    <option value="production">production</option>
                    <option value="local">local</option>
                </select>
            </label>
        </div>
        <div>
            <label>
                Add ping for slow connection emulation:
                <input
                    type="text"
                    onChange={(event) => onChangeOption("addPing", parseInt(event.target.value, 10)) }
                    value={options.addPing}
                />
            </label>
        </div>
        <div>
            <button onClick={onInitGameClick}>Start free trial now</button>
        </div>
    </div>
);

Login.propTypes = {
    className: PropTypes.string,
    options: PropTypes.object.isRequired,
    onChangeOption: PropTypes.func.isRequired,
    onInitGameClick: PropTypes.func.isRequired,
};

Login.defaultProps = {
    className: "",
};

export default Login;
