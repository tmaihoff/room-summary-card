import { BrightnessSlider } from '@cards/components/brightness-slider/brightness-slider';
import { nothing } from 'lit';
import type { Config } from '@type/config';
import type { EntityInformation } from '@type/room';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { createStateEntity } from '../../test-helpers';

describe('BrightnessSlider', () => {
  let element: BrightnessSlider;

  beforeEach(() => {
    element = new BrightnessSlider();
  });

  describe('Rendering', () => {
    it('should return nothing when entity is undefined', () => {
      element.entity = undefined as any;
      const result = element.render();
      expect(result).to.equal(nothing);
    });

    it('should return nothing when entity state is undefined', () => {
      element.entity = { config: { entity_id: 'light.test' } } as EntityInformation;
      const result = element.render();
      expect(result).to.equal(nothing);
    });

    it('should return nothing when entity is not a light', () => {
      element.entity = {
        config: { entity_id: 'switch.test' },
        state: createStateEntity('switch', 'test', 'on'),
      } as EntityInformation;
      const result = element.render();
      expect(result).to.equal(nothing);
    });

    it('should render slider for light entity', () => {
      element.entity = {
        config: { entity_id: 'light.test' },
        state: createStateEntity('light', 'test', 'on', { brightness: 128 }),
      } as EntityInformation;
      const result = element.render();
      expect(result).to.not.equal(nothing);
    });

    it('should render for light with full brightness', () => {
      element.entity = {
        config: { entity_id: 'light.test' },
        state: createStateEntity('light', 'test', 'on', { brightness: 255 }),
      } as EntityInformation;
      const result = element.render();
      expect(result).to.not.equal(nothing);
    });

    it('should render for off light with zero brightness', () => {
      element.entity = {
        config: { entity_id: 'light.test' },
        state: createStateEntity('light', 'test', 'off', { brightness: 0 }),
      } as EntityInformation;
      const result = element.render();
      expect(result).to.not.equal(nothing);
    });

    it('should render for light with medium brightness', () => {
      element.entity = {
        config: { entity_id: 'light.test' },
        state: createStateEntity('light', 'test', 'on', { brightness: 128 }),
      } as EntityInformation;
      const result = element.render();
      expect(result).to.not.equal(nothing);
    });
  });

  describe('State Updates', () => {
    it('should render after hass is set', () => {
      element.entity = {
        config: { entity_id: 'light.test' },
        state: createStateEntity('light', 'test', 'on', { brightness: 128 }),
      } as EntityInformation;

      element.hass = {
        states: {},
        entities: {},
        devices: {},
        areas: {},
        themes: {} as any,
        localize: (() => '') as any,
        language: 'en',
        callWS: (() => Promise.resolve()) as any,
        formatEntityState: (() => '') as any,
      };

      const result = element.render();
      expect(result).to.not.equal(nothing);
    });

    it('should render for off light', () => {
      element.entity = {
        config: { entity_id: 'light.test' },
        state: createStateEntity('light', 'test', 'off', { brightness: 128 }),
      } as EntityInformation;

      element.hass = {
        states: {},
        entities: {},
        devices: {},
        areas: {},
        themes: {} as any,
        localize: (() => '') as any,
        language: 'en',
        callWS: (() => Promise.resolve()) as any,
        formatEntityState: (() => '') as any,
      };

      const result = element.render();
      expect(result).to.not.equal(nothing);
    });

    it('should handle missing brightness attribute', () => {
      element.entity = {
        config: { entity_id: 'light.test' },
        state: createStateEntity('light', 'test', 'on'),
      } as EntityInformation;

      element.hass = {
        states: {},
        entities: {},
        devices: {},
        areas: {},
        themes: {} as any,
        localize: (() => '') as any,
        language: 'en',
        callWS: (() => Promise.resolve()) as any,
        formatEntityState: (() => '') as any,
      };

      const result = element.render();
      expect(result).to.not.equal(nothing);
    });
  });

  describe('Feature Integration', () => {
    it('should work with config object', () => {
      const config: Config = {
        area: 'living_room',
        features: ['add_brightness_slider'],
      };

      element.config = config;
      element.entity = {
        config: { entity_id: 'light.living_room' },
        state: createStateEntity('light', 'living_room', 'on', { brightness: 200 }),
      } as EntityInformation;

      const result = element.render();
      expect(result).to.not.equal(nothing);
    });

    it('should work without add_brightness_slider feature', () => {
      const config: Config = {
        area: 'living_room',
      };

      element.config = config;
      element.entity = {
        config: { entity_id: 'light.living_room' },
        state: createStateEntity('light', 'living_room', 'on', { brightness: 200 }),
      } as EntityInformation;

      const result = element.render();
      // Component still renders, feature flag is checked at card level
      expect(result).to.not.equal(nothing);
    });
  });
});
