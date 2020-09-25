import React, {Component, useState, useEffect, useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import './Park.css';
import Dinosaur from './Dinosaur';
import food from './food.png';
import thermometer from './thermometer.png';
import crunch from './audio/crunch.mp3';
import sigh from './audio/heal.mp3';
import gameOver from './audio/game_over.mp3';
import clickSound from './audio/click.mp3';

class Park extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
      };

      constructor(props) {
        super(props);
        const {cookies} = props;

        this.state = {
                dinosaurs: [], 
                csrfToken: cookies.get('XSRF-TOKEN'), 
                isLoading: true,
                murderTimerId: null,
                isAlive: true,
                timer: null
        };
        this.handleFeed = this.handleFeed.bind(this);
        this.changeToHungry = this.changeToHungry.bind(this);
        this.changeToSick = this.changeToSick.bind(this);
        this.timeOutFunction = this.timeOutFunction.bind(this);
        this.handleCure = this.handleCure.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
        this.saveGame = this.saveGame.bind(this);
        this.crunch = this.crunch.bind(this);
        this.healingBeep = this.healingBeep.bind(this);
        this.gameOverSound = this.gameOverSound.bind(this);
        this.clickSoundEffect = this.clickSoundEffect.bind(this);
      }

      murderDinosaur() {
        this.gameOverSound();
        const murderedDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
          ...dinosaur, 
          fullness: false,
          happiness: false,
          health: false,
          photo: 'https://i.ibb.co/6gCgBWJ/rip.png'
      }))
      this.setState({dinosaurs: murderedDinosaurArray});
      this.setState({isAlive: false});
      }

      timeOutFunction() {
        const randomState = Math.floor(Math.random() * 2) + 1;
        const timer = setTimeout(() => {
          if (randomState === 1) {
            this.changeToHungry();
          } 
          if (randomState === 2) {
            this.changeToSick();
          }

          const murderTimer = setTimeout(() => {
            this.murderDinosaur();
          }, 3000); 
          this.setState({murderTimerId: murderTimer});
        }, 5000);
        this.setState({timer: timer});
      }

      async createNewDinosaur() {
        const newDinosaur = JSON.stringify({
          name: 'Tyrannosaurus Rex',
          photo: 'https://i.ibb.co/9wmRhFx/alive.png',
          happiness: true,
          fullness: true,
          health: true
        })

        await fetch('api/dinosaur', {
          method: 'POST',
                body: newDinosaur,
                headers: {
                  'X-XSRF-TOKEN': this.state.csrfToken,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                credentials: 'include'
        })
        .then(response => response.json())
        .then(dinosaur => this.setState({dinosaurs: [dinosaur], isLoading: false}))
      }

      async fetchData() {
        this.setState({isLoading: true});

        await fetch('api/dinosaur', {credentials: 'include'})
          .then((response) => {
           return response.json()
          })

          .then((dinosaurs) => {
            console.log('dinosaurs', dinosaurs)

            if (dinosaurs.length === 0) {
              this.createNewDinosaur();
            }
         
            return this.setState({dinosaurs, isLoading: false})
          })
          .catch(err => console.log(err));

          
          this.timeOutFunction();
      }

      async componentDidMount() {
        this.fetchData();
        
      }

      componentWillUnmount() {
        if (this.state.timer) {
          clearTimeout(this.state.timer);
          this.setState({timer: null});
        } if (this.state.murderTimerId) {
          clearTimeout(this.state.murderTimerId)
          this.setState({murderTimerId: null})
        }
      }

      changeToSick() {
          const sickDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
              ...dinosaur, 
              health: false,
              happiness: false,
              photo: 'https://i.ibb.co/NxCNWTN/sick.png'
          }))
          this.setState(prevState => {
            return {dinosaurs: sickDinosaurArray}
          });
        }

      changeToHungry() {
        const hungryDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
            ...dinosaur, 
            fullness: false,
            happiness: false,
            photo: 'https://i.ibb.co/9qsgQ7c/hungry.png'
        }))
        this.setState(prevState => {
          return {dinosaurs: hungryDinosaurArray}
        });
      }

      crunch() {
        const crunchSound = new Audio(crunch);
        crunchSound.play();
      }

      healingBeep() {
        const beep = new Audio(sigh);
        beep.play();
      }
      
      gameOverSound() {
        const gameOverBeep = new Audio(gameOver);
        gameOverBeep.play();
      }

      clickSoundEffect() {
        const click = new Audio(clickSound);
        click.play();
      }

      handleFeed() {
        if (!this.state.dinosaurs[0].fullness) {
          this.crunch();
          const fullDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
            ...dinosaur, 
            fullness: true,
            happiness: true,
            photo: 'https://i.ibb.co/9wmRhFx/alive.png'
          }));
          this.setState({dinosaurs: fullDinosaurArray}, this.timeOutFunction);
          clearTimeout(this.state.murderTimerId);
        }
      }
      
      handleCure() {
        if (!this.state.dinosaurs[0].health) {
          this.healingBeep();
          const healthyDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
            ...dinosaur, 
            health: true,
            happiness: true,
            photo: 'https://i.ibb.co/9wmRhFx/alive.png'
        }));
          this.setState({dinosaurs: healthyDinosaurArray}, this.timeOutFunction);
          clearTimeout(this.state.murderTimerId);
        }
      }
      
      startNewGame() {
        this.clickSoundEffect();
        fetch('/api/dinosaur', {
          method: 'DELETE',
          headers: {
            'X-XSRF-TOKEN': this.state.csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        .then(() => {
          this.setState({dinosaurs: [], isAlive: true}, this.fetchData);
        })
        clearTimeout(this.state.murderTimerId);
        clearTimeout(this.state.timer);
      }
      
      saveGame() {
        this.clickSoundEffect();
        const updatedDinosaur = this.state.dinosaurs[0];
        fetch('/api/dinosaur/' + (updatedDinosaur.id), {
          method: 'PUT',
          headers: {
            'X-XSRF-TOKEN': this.state.csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedDinosaur),
          credentials: 'include'
        });
        this.props.history.push('/');
      }

      render() {
        const dinosaurs = this.state.dinosaurs;

        const statusMessage = this.state.dinosaurs.map((dinosaur, index) => {
          if (!dinosaur.happiness && this.state.isAlive) {
            return <p className="status-message" key={index}> oh no, your dinosaur is unhappy. you should try to help him...</p>
          }
          else if (dinosaur.happiness && this.state.isAlive) {
            return <p className="status-message" key={index}>your dinosaur is happy.</p>
          }
        })

          return (
            <div id="wrapper">
                {statusMessage}
                { !this.state.isAlive ? (
                  <p className="status-message">your dinosaur is dead. rip.</p> ) : ( null )}
                <Dinosaur dinosaurs={dinosaurs}/>
                <div className="button-wrapper">
                  <Button className="game-button" disabled={!this.state.isAlive} onClick={this.handleFeed}>feed me <img id="food" src={food}/></Button>
                  <Button className="game-button" disabled={!this.state.isAlive} onClick={this.handleCure}>cure me <img id="thermometer" src={thermometer}/></Button>
                  <Button className="game-button" disabled={!this.state.isAlive} onClick={this.saveGame}>save and end the game</Button>
                  <Button className="game-button" onClick={this.startNewGame}>start new game</Button>
                </div>
            </div>
          )
      }

}

export default withCookies(withRouter(Park));
