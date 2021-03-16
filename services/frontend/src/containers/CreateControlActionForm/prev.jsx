<TextField
              name="description"
              label="Description"
              value={this.state.description}
              onChange={this.handleInputChange}
              margin="normal"
              fullWidth
            />
            <FormControl margin="normal" fullWidth>
              <InputLabel htmlFor="target">Target</InputLabel>
              <Select
                value={this.state.target}
                onChange={this.handleInputChange}
                inputProps={{
                  name: 'target',
                  id  : 'target',
                }}
              >
                <MenuItem value="essentia">Essentia</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="object"
              label="Sources"
              value={this.state.object}
              onChange={this.handleInputChange}
              margin="normal"
              helperText={<span>Enter a source on each newline</span>}
              rows={5}
              required
              multiline
              fullWidth
            />
            {this.state.error ? (
              <Typography color="error">
                {this.state.error}
              </Typography>
            ) : null}
