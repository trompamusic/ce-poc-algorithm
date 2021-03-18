export default ({ palette, spacing }) => ({
  root: {
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    flexDirection  : 'column',
    height         : '25vh',
    minHeight      : 200,
    backgroundColor: palette.primary.main,
    color          : palette.primary.contrastText,
  },
  logo: {
    marginBottom: spacing.unit * 2,
    maxWidth    : '100%',
  },
});
