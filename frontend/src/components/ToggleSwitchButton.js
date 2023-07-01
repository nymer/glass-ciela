import React from 'react'
import styled from 'styled-components'
import '../index.css';

const StyledToggleSwitchButton = styled.div`
	& input {
		display: none;
		&:checked + label {
			background-color: #003366;
			&::before {
				left: 2em;
			}
		}
	}

	& label {
		background-color: #C0C0C0;
		border-radius: 2em;
		border: 2px solid var(--text-color);
		display: flex;
		align-items: center;
		justify-content: space-around;
		height: 1.5em;
		position: relative;
		transition: .5s;
		width: 3.75em;

		&::before {
			background: #fff;
			border-radius: 100%;
			content: '';
			display: inline-block;
			height: 1.5em;
			position: absolute;
			left: 0.25em;
			transition: .5s ease-out;
			width: 1.5em;
			z-index: 2;
		}
	}
`

const ToggleSwitchButton = ({ className, handleClick, isToggle }) => (
  <StyledToggleSwitchButton className={className}>
      <span className='std-mode-text' >Standard Mode</span>
      <button className='std-mode-btn' id="btn-mode" type="checkbox" onClick={handleClick} ref={null}>{isToggle ? "ON " : "OFF"}</button>
  </StyledToggleSwitchButton>
)

export default ToggleSwitchButton
