import { css } from 'lit';

/**
 * Brightness slider styles for vertical slider display
 * Includes slider track, fill indicator, and positioning
 */
export const styles = css`
  :host {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
  }

  .slider-container {
    position: relative;
    height: 100%;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slider-track {
    position: absolute;
    width: 6px;
    height: calc(100% - 16px);
    background-color: var(--primary-background-color, rgba(255, 255, 255, 0.1));
    border-radius: 3px;
    overflow: hidden;
    pointer-events: none;
  }

  .slider-fill {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: var(--primary-color, #03a9f4);
    border-radius: 3px;
    transition: height 0.1s ease;
    opacity: 0.8;
  }

  .brightness-slider {
    -webkit-appearance: slider-vertical;
    appearance: slider-vertical;
    width: 32px;
    height: calc(100% - 16px);
    background: transparent;
    outline: none;
    cursor: pointer;
    z-index: 1;
  }

  .brightness-slider:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  /* WebKit browsers (Chrome, Safari) */
  .brightness-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-color, #03a9f4);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: 2px solid var(--card-background-color, #fff);
  }

  .brightness-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  /* Firefox */
  .brightness-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-color, #03a9f4);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: 2px solid var(--card-background-color, #fff);
  }

  .brightness-slider::-moz-range-thumb:hover {
    transform: scale(1.1);
  }

  /* Remove default track styling */
  .brightness-slider::-webkit-slider-runnable-track {
    background: transparent;
  }

  .brightness-slider::-moz-range-track {
    background: transparent;
  }
`;
