import React from 'react';

const Tooltip = ({ text, tooltipText }) => {
    return (
        <div className="tooltip" data-direction="right">
            <div className="tooltip__initiator">
                <i className="fa fa-info-circle"></i>
            </div>
            <div className="tooltip__item">
                {tooltipText}
            </div>
        </div>
    );
};

export default Tooltip;