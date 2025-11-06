import { HassUpdateMixin } from '@cards/mixins/hass-update-mixin';
import { fireEvent } from '@hass/common/dom/fire_event';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import type { EntityInformation } from '@type/room';
import { CSSResult, LitElement, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styles } from './styles';

/**
 * Brightness Slider Component
 *
 * A custom Lit element that renders a vertical brightness slider for controlling
 * light entities. This component:
 *
 * - Displays a vertical slider on the right side of the card
 * - Controls brightness of the main room light entity
 * - Only appears when add_brightness_slider feature is enabled and entity is a light
 * - Matches the card's styling and theme
 *
 * @version See package.json
 */
export class BrightnessSlider extends HassUpdateMixin(LitElement) {
  /**
   * Home Assistant instance
   */
  @state()
  private _hass!: HomeAssistant;

  /**
   * Card configuration object
   */
  @property({ type: Object }) config!: Config;

  /**
   * Room entity information (should be a light)
   */
  @property({ type: Object }) entity!: EntityInformation;

  /**
   * Current brightness value (0-255)
   */
  @state()
  private _brightness: number = 0;

  /**
   * Whether the light is currently on
   */
  @state()
  private _isOn: boolean = false;

  /**
   * Returns the component's styles
   */
  static override get styles(): CSSResult {
    return styles;
  }

  /**
   * Updates the card's state when Home Assistant state changes
   * @param {HomeAssistant} hass - The Home Assistant instance
   */
  // @ts-ignore - HassUpdateMixin provides the hass setter, but TypeScript sees this as an override conflict
  override set hass(hass: HomeAssistant) {
    this._hass = hass;
    this._updateBrightness();
  }

  /**
   * Updates brightness from entity state
   */
  private _updateBrightness() {
    if (!this.entity?.state) return;

    const state = this.entity.state;
    this._isOn = state.state === 'on';
    this._brightness = state.attributes?.brightness || 0;
  }

  /**
   * Handles slider input change
   */
  private _handleSliderChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value);
    
    // Update local state immediately for responsiveness
    this._brightness = value;

    // Fire hass-action event to change brightness
    if (this.entity?.config?.entity_id) {
      // @ts-ignore - 'hass-action' is a custom event not in the HASSDomEvents type definition
      fireEvent(this, 'hass-action', {
        config: {
          entity: this.entity.config.entity_id,
          tap_action: {
            action: 'call-service',
            service: 'light.turn_on',
            data: {
              entity_id: this.entity.config.entity_id,
              brightness: value,
            },
          },
        },
        action: 'tap',
      });
    }
  }

  /**
   * Handles slider container click to toggle light on/off
   */
  private _handleContainerClick(e: MouseEvent) {
    // Only toggle if clicking the container background, not the slider itself
    const target = e.target as HTMLElement;
    if (target.classList.contains('slider-track')) {
      if (this.entity?.config?.entity_id) {
        // @ts-ignore - 'hass-action' is a custom event not in the HASSDomEvents type definition
        fireEvent(this, 'hass-action', {
          config: {
            entity: this.entity.config.entity_id,
            tap_action: {
              action: 'call-service',
              service: 'light.toggle',
              data: {
                entity_id: this.entity.config.entity_id,
              },
            },
          },
          action: 'tap',
        });
      }
    }
  }

  public override render(): TemplateResult | typeof nothing {
    if (!this.entity?.state) return nothing;

    // Only show for light entities
    if (!this.entity.state.entity_id.startsWith('light.')) {
      return nothing;
    }

    // Calculate percentage for display
    const percentage = Math.round((this._brightness / 255) * 100);

    return html`
      <div class="slider-container" @click=${this._handleContainerClick}>
        <div class="slider-track">
          <div 
            class="slider-fill" 
            style="height: ${percentage}%"
          ></div>
        </div>
        <input
          type="range"
          min="0"
          max="255"
          .value=${this._brightness.toString()}
          @input=${this._handleSliderChange}
          ?disabled=${!this._isOn}
          orient="vertical"
          class="brightness-slider"
        />
      </div>
    `;
  }
}
