export default ({ spacing }) => ({
  root: {
    height        : '100vh',
    display       : 'flex',
    alignItems    : 'center',
    justifyContent: 'center',
    flexDirection : 'column',
  },
  buttonRow: {
    display       : 'flex',
    justifyContent: 'center',
    marginTop     : spacing.unit * 3,
  },
});
