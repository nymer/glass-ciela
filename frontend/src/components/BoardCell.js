import React from 'react';
import '../index.css';

const BoardCell = ({ value, onClick, className }) => {
  return (
    <div className={className} onClick={onClick}>
      {value}
    </div>
  );
};

export default BoardCell;
