import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import ScoreCard from '../UI/ScoreCard';
import WebCanvas from '../PacmanGame/webcanvas';
import './game.css'

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: '100%',
  },
});

const GamePage = (props) => {
  const {
    render, classes, startGame, score, status,
  } = props;
  return (
    <React.Fragment>
      <Paper className={classes.root} elevation={1}>
        <Grid container spacing={14}>
          <Grid item xs={false} sm={false} md={3} lg={3} />
          <Grid item md={4} lg={3} xs={3} sm={4}>
            <Button variant="outlined" size="medium" color="primary" onClick={startGame}>
              Start
            </Button>
            <div>
              Score:
              {score}
            </div>
            <div>
              Status:
              {status === 2 ? 'GAME OVER' : status}
            </div>
            {render()}
          </Grid>
          <Grid container xs={6} sm={4} md={3} lg={3}>
            {/* <ScoreCard /> */}
          <div className="webcanvas">
          < WebCanvas />
          </div>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
};

GamePage.propTypes = {
  score: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired,
  render: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
  classes: PropTypes.shape().isRequired,
};

GamePage.defaultTypes = {
  classes: null,
};


export default withStyles(styles)(GamePage);
