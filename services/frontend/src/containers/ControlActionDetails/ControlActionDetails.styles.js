export default ({ spacing }) => ({
  root: {
    padding: spacing.unit * 2,
  },
  paragraph: {
    marginBottom: spacing.unit * 2,
  },
  status: {
    display   : 'flex',
    alignItems: 'center',
  },
  propertyValue: {
    marginBottom: spacing.unit,
    padding     : spacing.unit,
    border      : '1px solid #ccc',
  },
});
