import Vue, { VNode, CreateElement } from 'vue';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import props from './radio-group-props';
import { RadioOptionObj, RadioOption, RadioValue } from './type';
import { prefix } from '../config';
import Radio from './radio';
import { TNodeReturnValue } from '../common';

const name = `${prefix}-radio-group`;

export default Vue.extend({
  name,
  props: { ...props },

  components: {
    Radio,
  },

  provide() {
    return {
      radioGroup: this,
    };
  },

  render(h: CreateElement): VNode {
    const { $scopedSlots } = this;
    let children: TNodeReturnValue = $scopedSlots.default && $scopedSlots.default(null);

    if (this.options && this.options.length) {
      children = this.options.map((option: RadioOption, index) => {
        let opt = option as RadioOptionObj;
        if (isNumber(option) || isString(option)) {
          opt = { value: option, label: option.toString() };
        }
        return (
          <Radio
            key={`radio-group-options-${opt.value}-${index}`}
            name={this.name}
            checked={this.value === opt.value}
            disabled={'disabled' in opt ? opt.disabled : this.disabled}
            value={opt.value}
          >
            {typeof opt.label === 'function' ? opt.label(h) : opt.label}
          </Radio>
        );
      });
    }

    const groupClass = [`${name}`, `${name}-${this.buttonStyle}`, `${name}-${this.size}`];

    return <div class={groupClass}>{children}</div>;
  },

  methods: {
    handleRadioChange(value: RadioValue, context: { e: Event }) {
      this.$emit('change', value, context);
      typeof this.onChange === 'function' && this.onChange(value, context);
    },
  },
});
