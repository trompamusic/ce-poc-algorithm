const mixins = {
  placeholder: styles => ({
    '&::-webkit-input-placeholder': styles,
    '&::-moz-placeholder'         : styles, // Firefox 19+
    '&:-ms-input-placeholder'     : styles, // IE 11
    '&::-ms-input-placeholder'    : styles, // Edge
  }),
  appearance: value => ({
    '-webkit-appearance': value,
    '-moz-appearance'   : value,
    'appearance'        : value,
  }),
  button: (backgroundColor, backgroundColorHover, color) => ({
    '&:hover': {
      backgroundColor       : backgroundColorHover,
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    color,
    backgroundColor,
  }),
};

export default mixins;
