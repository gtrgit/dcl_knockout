import { PathedPlatform } from "./pathedPlatform"
import { RotatingPlatform } from "./rotatingPlatform"
import { Sound } from "./sound"
import { Ring } from "./ring"
import { MovingPlatform } from "./movingPlatform"
import * as matic from '../node_modules/@dcl/l2-utils/matic/index'
import { getUserData } from "@decentraland/Identity"
import { Emitter } from "./msgBus"
import resources from "./resources"
import { TriggeredPlatform } from"./triggerBoxEmitter"
import { TriggerBoxShape } from "../node_modules/decentraland-ecs-utils/triggers/triggerSystem"
import { spawnBoxX } from './SpawnerFunctions'
import { delay } from "../node_modules/@dcl/l2-utils/utils/index"
import { LockConstraint, Utils } from "cannon"
import { Delay } from "../node_modules/decentraland-ecs-utils/timer/component/delay"
import {BuilderHUD} from './BuilderHUD'
import utils from "../node_modules/decentraland-ecs-utils/index"
import { movePlayerTo } from '@decentraland/RestrictedActions'
    

///////////////
//Variables
let polyGraphWallet = '0xC156C57182AE48CF32933A581D5Bed9A457e32cD'
let currentPlayerName:any
let playerEthAdr:string
//let playerAtStartCount:number
// stageArrays
let startGateArr = []
let raceStarted = []
let stage1Arr = []
let stage2Arr = []
let stage3Arr = []
let stage4Arr = []
let stage5Arr = []
let stage6Arr = []
let finishArr = []

//Payment Matic/Mana
let l1_l2Balance:any
let depositValue:number

//stageElimination 
let stage1EliminationNumber:number = 0
let stage2EliminationNumber:number = 0
let stage3EliminationNumber:number = 0
let stage4EliminationNumber:number = 0
let stage5EliminationNumber:number = 0
let stage6EliminationNumber:number = 2

//RACE WINNER
let raceWinner:string = ''

////////////////
//UI Variables
let playersInGate:number = 0
let playersRacing:number = 0

let raceTierOff:number = .05
let raceTierOn:number = 1
let goldRaceTierOpacity:number = raceTierOff
let silverRaceTierOpacity = raceTierOff
let bronzeRaceTierOpacity = raceTierOn

let stage01ColorOff:string = '#66fa39' 
let stage01ColorOn:string = '#66fa39' 
let stage01Color:string = '#fffefc'

let stage02ColorOff:string = '#35342FFF' 
let stage02ColorOn:string = '#7BE329FF' 
let stage02Color:string = '#35342FFF'

let stage03ColorOff:string = '#35342FFF' 
let stage03ColorOn:string = '#7BE329FF' 
let stage03Color:string = '#35342FFF'

let stage04ColorOff:string = '#35342FFF' 
let stage04ColorOn:string = '#7BE329FF' 
let stage04Color:string = '#35342FFF'

let stage05ColorOff:string = '#35342FFF' 
let stage05ColorOn:string = '#7BE329FF' 
let stage05Color:string = '#35342FFF'


let stage06ColorOff:string = '#35342FFF' 
let stage06ColorOn:string = '#7BE329FF' 
let stage06Color:string = '35342FFF'


//////////////////////////////////////////////
//Timer vars TODO add tick
let startTime:number = 0
let timer: number = 1
let minuteTimer:number = 0
let secondsTimer:number
let minSecTimer:string
let timeMinSec:string
let dt:number = 1

/////////////////////////////////////////////////////
let start_sound:AudioSource = new AudioSource(resources.sounds.airhorn)

/////////////////////////////////////////////////////////////////////////
//TELEPORT locations
let enterRacePos = { x: 3, y: 0, z: 19 }
let eliminateFromRacePos = { x: 2, y: 3, z: 30 } //new Vector3(2,3,30),new Vector3(4,3,4)
let testPos = { x: 12, y: 3, z: 19 } //new Vector3(2,3,30),new Vector3(4,3,4)



//////////////////////////////////
//GAME LOOP
let raceRunning:boolean = false

let restartTimer:boolean = false

let start_pos:Vector3
let end_pos:Vector3 

// identifier is passed to the triggerBoxEmitter class to send the player names to different stageArrays
let identifier:string

/////////////////////////////////////
//game UI
let manaPrice:number = 5


//
const sceneMessageBus = new MessageBus()

//spawnCube is just to put test boxes down
function spawnCube(x: number, y: number, z: number) {
  // create the entity
  const cube = new Entity()
  // add a transform to the entity
  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))
  // add a shape to the entity
  cube.addComponent(new BoxShape())
  // add the entity to the engine
  engine.addEntity(cube)
  return cube
}

// Get player name 
const userData = executeTask(async () => {
  const data = await getUserData()
  return data.displayName
})

// Get player eth address 
const getPlayerEthAdr = executeTask(async () => {
  const data = await getUserData()
  return data.publicKey
})

//Assign this players name and assign => currentPlayerName
executeTask(async () => {await userData.then((value)=> {currentPlayerName= value})})

//Assign this players Eth adderss and assign => playerEthAdr
executeTask(async () => {await getPlayerEthAdr.then((value)=> {playerEthAdr= value})})

//TODO Fix this
//add the player name to the startGate array
sceneMessageBus.on('startGamePlayerName', (e) => {
  startGateArr.push(e.playerName.result)
  log('players entered: '+startGateArr.length)

  stage1EliminationNumber = Math.round(startGateArr.length-(startGateArr.length*.2))
  stage2EliminationNumber = Math.round(stage1EliminationNumber-(stage1EliminationNumber*.2))
  stage3EliminationNumber = Math.round(stage2EliminationNumber-(stage2EliminationNumber*.2))
  stage4EliminationNumber = Math.round(stage3EliminationNumber-(stage3EliminationNumber*.2))
  stage5EliminationNumber = Math.round(stage4EliminationNumber-(stage4EliminationNumber*.2))
  stage6EliminationNumber = 2
  
})

//Get count of 
sceneMessageBus.on('player', (e) => {
  log(' plr length '+userData.result)
})

////////////////////////////////////////////////////////////////////////////////////////
//Trigger Box to fit on each gate
const trigBox = new TriggerBoxShape(new Vector3(1,2,7), new Vector3(0,3,0))  //size, position  //NOTE CHANGE THE size if the position is changed
const winnerTriggerBox = new TriggerBoxShape(new Vector3(3,2,3), new Vector3(0,2,0))  //size, position  //NOTE CHANGE THE size if the position is changed
const freeTrigger = new TriggerBoxShape(new Vector3(1,2,1), new Vector3(0,1,0))  //size, position  //NOTE CHANGE THE size if the position is changed


//FreeStart
const freeStartTrigger = new TriggeredPlatform(
  resources.stadium.ring, 
  new Transform({
    position: new Vector3(5,.1,36.7),
    scale: new Vector3(2, .2, 2),
    rotation: Quaternion.Euler(0, 0, 180),
  }),
  freeTrigger,
  userData,
  identifier = 'enterRaceFree'
)

let freeStartText = new Entity()
freeStartText.addComponent(new TextShape("Free Play"))
freeStartText.addComponent(new Transform({
  position: new Vector3(0, -4, 0),
  //rotation: new Quaternion(0.7071,0.7071 ,0,0), // vert (0.7071,0.7071 ,0,0 ) //flat (0.7071, 0, 0, 0.7071)
  scale: new Vector3(.1, 1 , .1)
}))
freeStartText.getComponent(TextShape).color = Color3.Black()
freeStartText.getComponent(TextShape).shadowColor = Color3.White()
freeStartText.getComponent(TextShape).shadowOffsetY = 1
freeStartText.getComponent(TextShape).shadowOffsetX = -1
freeStartText.getComponent(TextShape).billboard = true
freeStartText.setParent(freeStartTrigger)   




//FreeStart
const donateStartTrigger = new TriggeredPlatform(
  resources.stadium.ring, 
  new Transform({
    position: new Vector3(5,.1,38.5),
    scale: new Vector3(2, .2, 2),
    rotation: Quaternion.Euler(0, 0, 180),
  }),
  freeTrigger,
  userData,
  identifier = 'enterRacePay'
  
)






//FreeStart
const spectateTrigger = new TriggeredPlatform(
  resources.stadium.ring, 
  new Transform({
    position: new Vector3(6.7,.1,41.3),
    scale: new Vector3(2, .2, 2),
    rotation: Quaternion.Euler(0, 0, 180),
  }),
  freeTrigger,
  userData,
  identifier = 'spectator'
)

let spectateText = new Entity()
spectateText.addComponent(new TextShape("Spectator Area"))
spectateText.addComponent(new Transform({
  position: new Vector3(0, -4, 0),
  //rotation: new Quaternion(0.7071,0.7071 ,0,0), // vert (0.7071,0.7071 ,0,0 ) //flat (0.7071, 0, 0, 0.7071)
  scale: new Vector3(.1, 1 , .1)
}))
spectateText.getComponent(TextShape).color = Color3.Black()
spectateText.getComponent(TextShape).shadowColor = Color3.White()
spectateText.getComponent(TextShape).shadowOffsetY = 1
spectateText.getComponent(TextShape).shadowOffsetX = -1
spectateText.getComponent(TextShape).billboard = true
spectateText.setParent(spectateTrigger)   






//
//Stage 1 trigger area
const postStartGateTrigger = new TriggeredPlatform(
  resources.stadium.stage_gate, 
  new Transform({
    position: new Vector3(6.7,.4,25),
    scale: new Vector3(2, 1, .5),
    rotation: Quaternion.Euler(180, 90, 0),
  }),
  trigBox,
  userData,
  identifier = 'start'
)

//    Add AudioSource component to entity
postStartGateTrigger.addComponentOrReplace(start_sound)
      

//
//Stage 1 trigger area
const stage1GateTrigger = new TriggeredPlatform(
  resources.stadium.stage_gate, 
  new Transform({
    position: new Vector3(97.1,13.2,43.2),
    scale: new Vector3(.6,1,.5),
    rotation: Quaternion.Euler(180, 90, 0),
  }),
  trigBox,
  userData,
  identifier = 'stage1'
)

//
//Stage 2 trigger area
const stage2GateTrigger = new TriggeredPlatform(
  resources.stadium.stage_gate, 
  new Transform({
    position: new Vector3(80.5,12.5,33.5),
    scale: new Vector3(.6,1,.5),
    rotation: Quaternion.Euler(180, 90, 0),
  }),
  trigBox,
  userData,
  identifier = 'stage2'
)


//
//Stage 3 trigger area
const stage3GateTrigger = new TriggeredPlatform(
  resources.stadium.stage_gate, 
  new Transform({
    position: new Vector3(64,12.5,34),
    scale: new Vector3(.6,1,.5),
    rotation: Quaternion.Euler(180, 90, 0),
  }),
  trigBox,
  userData,
  identifier = 'stage3'
)

//
//Stage 4 trigger area
const stage4GateTrigger = new TriggeredPlatform(
  resources.stadium.stage_gate, 
  new Transform({
    position: new Vector3(47,12.5,34),
    scale: new Vector3(.6,1,.5),
    rotation: Quaternion.Euler(180, 90, 0),
  }),
  trigBox,
  userData,
  identifier = 'stage4'
)

//
//Stage 5 trigger area
const stage5GateTrigger = new TriggeredPlatform(
  resources.stadium.stage_gate, 
  new Transform({
    position: new Vector3(29.9,12.5,34.1),
    scale: new Vector3(.6,1,.5),
    rotation: Quaternion.Euler(180, 90, 0),
  }),
  trigBox,
  userData,
  identifier = 'stage5'
)

//
//Stage 6 trigger area
const stage6GateTrigger = new TriggeredPlatform(
  resources.stadium.stage_gate, 
  new Transform({
    position: new Vector3(14.9,15.6,2.5),
    scale: new Vector3(.6,1,.5),
    rotation: Quaternion.Euler(180, 90, 0),
  }),
  trigBox,
  userData,
  identifier = 'stage6'
)

const finish_move = new MovingPlatform(
  resources.stadium.finish_plat,
  new Vector3(2.5,4.5,35),
  new Vector3(2.5,4.5,33),
  3
)



//
//finishLineTrigger 
const finishLineTrigger = new TriggeredPlatform(
  resources.stadium.stage_gate, 
  new Transform({
    position: new Vector3(0,0,0), //20,0.5,24
    scale: new Vector3(.38, .2, 1),
    rotation: Quaternion.Euler(180, 0, 0),
  }),
  winnerTriggerBox,
  userData,
  identifier = 'finish'
)
finishLineTrigger.setParent(finish_move)

/////////////////////////////////////////////////////////////
//Stage gate barriers
class Barrier extends Entity {
  constructor(
    model: GLTFShape,
    transform: Transform,
    parent: Entity
    ) {
      super()
      engine.addEntity(this)
      this.setParent(parent)
      this.addComponent(model)
      this.addComponent(transform)
    }
  }

  
  sceneMessageBus.on('open_close_start_gate', (e) => {
    log('start gate status: '+e.gate)
    if (e.gate=='open'){
      log('gate is open')
                  // Play sound
                  start_sound.playing = true
                  //hide ui
                  timerRect.visible = false

          start_pos = new Vector3(0,0,0)
          end_pos = new Vector3(0,-4,0)
          start_gate.addComponentOrReplace(new utils.MoveTransformComponent(start_pos,end_pos,2,() =>{}))
    } 
    if (e.gate=='close'){
      log('gate is closed')
              
          start_pos = new Vector3(0,-4,0)
          end_pos = new Vector3(0,0,0)
          start_gate.addComponentOrReplace(new utils.MoveTransformComponent(start_pos,end_pos,2,() =>{}))
    }
  })
  
sceneMessageBus.on('enterRace', (e) => {
  log('trigger name '+e)
  startGateArr.push(e)

  timerRect.visible = true

  log('(starting gate: '+startGateArr.length+')->(stage 1: '+stage1Arr.length+')')

  //The elimination counts appear on the 
  if (stage1Arr.length > 0) {
  stage1EliminationNumber = Math.round(stage1Arr.length-(stage1Arr.length*.2))
  stage2EliminationNumber = Math.round(stage1EliminationNumber-(stage1EliminationNumber*.2))
  stage3EliminationNumber = Math.round(stage2EliminationNumber-(stage2EliminationNumber*.2))
  stage4EliminationNumber = Math.round(stage3EliminationNumber-(stage3EliminationNumber*.2))
  stage5EliminationNumber = Math.round(stage4EliminationNumber-(stage4EliminationNumber*.2))
  stage6EliminationNumber = 2// Math.round(stage5EliminationNumber-(stage5EliminationNumber*.2))
   } 

    if (stage1Arr.length > 0) {

    //eliminateFromRace(startGateArr)
    }

})

sceneMessageBus.on('spectator', (e) => {
  movePlayerTo({ x: 11, y: 28, z: 36.7 })
}
)

sceneMessageBus.on('enterRaceFree', (e) => {
 // movePlayerTo({ x: 3, y: 0, z: 23 })
  
  log('free trigger name '+e.stageXTrigger.result)
  startGateArr.push(e.stageXTrigger.result)

  //timerRect.visible = true
  setTimerVis(true)
  //
  restartTimer = true
  //
  raceRunning = true
  winnerRect.visible = false


  log('(starting gate: '+startGateArr.length+')->(stage 1: '+stage1Arr.length+')')

  //The elimination counts appear on the 
  if (stage1Arr.length > 0) {
  stage1EliminationNumber = Math.round(stage1Arr.length-(stage1Arr.length*.2))
  stage2EliminationNumber = Math.round(stage1EliminationNumber-(stage1EliminationNumber*.2))
  stage3EliminationNumber = Math.round(stage2EliminationNumber-(stage2EliminationNumber*.2))
  stage4EliminationNumber = Math.round(stage3EliminationNumber-(stage3EliminationNumber*.2))
  stage5EliminationNumber = Math.round(stage4EliminationNumber-(stage4EliminationNumber*.2))
  stage6EliminationNumber = 2// Math.round(stage5EliminationNumber-(stage5EliminationNumber*.2))
   } 

    if (stage1Arr.length > 0) {

    //eliminateFromRace(startGateArr)
    }

})




//TODO FIX the order of the arrarys:   (startGateArr)->(stage1Arr)->()->()->()->(finish)
sceneMessageBus.on('start', (e) => {
  log('trigger name '+e.stageXTrigger.result)
  //startGateArr.push(e.stageXTrigger.result)

  let nameIndex = startGateArr.indexOf(e.stageXTrigger.result)
  stage1Arr.push(startGateArr[nameIndex])
  //Color?? Document what this does
  stage01Color = stage01ColorOn

  // remove the player from previous stage array
  startGateArr.splice(nameIndex,1)

//todo ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //timer = 1
  //tick = 0
  sceneMessageBus.emit('raceRunning',{running:'true'})

  log('(starting gate: '+startGateArr.length+')->(stage 1: '+stage1Arr.length+')')

  //The elimination counts appear on the 
  if (stage1Arr.length > 0) {
  stage1EliminationNumber = Math.round(stage1Arr.length-(stage1Arr.length*.2))
  stage2EliminationNumber = Math.round(stage1EliminationNumber-(stage1EliminationNumber*.2))
  stage3EliminationNumber = Math.round(stage2EliminationNumber-(stage2EliminationNumber*.2))
  stage4EliminationNumber = Math.round(stage3EliminationNumber-(stage3EliminationNumber*.2))
  stage5EliminationNumber = Math.round(stage4EliminationNumber-(stage4EliminationNumber*.2))
  stage6EliminationNumber =  2 //Math.round(stage5EliminationNumber-(stage5EliminationNumber*.2))
   } 

    if (stage1Arr.length > 0) {

    //eliminateFromRace(startGateArr)
    }
   
    /////////////////////////////////
    //add the star_gate back in.
    /*
    const start_gate = new Entity()
    start_gate.addComponent(resources.stadium.start_gate_01)
    start_gate.addComponent(new Transform({position: new Vector3(0,0,0)}))
    engine.addEntity(start_gate)
    */
})

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//TRIGGER BROADCASTS:
// STAGE 1 complete
sceneMessageBus.on('stage1', (e) => {
  //When the first player crosses stage1 close the start_gate
  sceneMessageBus.emit('open_close_start_gate',{gate: 'close'})

  //
  log('trigger name 1 '+e.stageXTrigger.result)
  stage01Color = stage01ColorOn
  if  (stage2Arr.length < stage1EliminationNumber) {
    
      let nameIndex = stage1Arr.indexOf(e.stageXTrigger.result)
      stage2Arr.push(stage1Arr[nameIndex])
      // If a player are gone through the first gate then close the start gate plrs inside will have to wait for the next race
      log('Stage 1: '+stage2Arr.length+' / '+stage1EliminationNumber)
      // remove the player from previous stage array
      startGateArr.splice(nameIndex,1)
        stage1Arr.splice(nameIndex,1)
  }

  if (stage2Arr.length == stage1EliminationNumber) {

    log('(Eliminated)->(s1:'+ stage1Arr.length+')->(s2: '+stage2Arr.length+')')
    //make barrier visible
    let barrerV3 = new Transform({position: new Vector3(0,-4,0),scale: new Vector3(1,1.5,1)})
    let barrier01 = new Barrier(resources.stadium.stage_gate_barrier,barrerV3,stage1GateTrigger)
  
    new Delay(100000, () => {
      let barrier01 = new Barrier(resources.stadium.stage_gate_barrier,barrerV3,stage1GateTrigger)
      //TODO create eliminated function.message and send elim.arr to function
    })
    //delay for 3 sec and then teleport
    eliminateFromRace(stage1Arr)
    //new Delay(200000, () => {eliminateFromRace(stage1Arr)})
  }
})

//STAGE 2
sceneMessageBus.on('stage2', (e) => {

  if  (stage3Arr.length < stage2EliminationNumber) {
    let nameIndex = stage2Arr.indexOf(e.stageXTrigger.result)
    stage3Arr.push(stage2Arr[nameIndex])
  
    log('Stage 2 '+stage3Arr.length+' / '+stage2EliminationNumber)
    // remove the player from previous stage array
    stage2Arr.splice(nameIndex,1)
  }

  if (stage3Arr.length == stage2EliminationNumber) {

    log('(Eliminated)->(s2: '+stage2Arr.length+')->(s3: '+stage3Arr.length+')')

    let barrerV3 = new Transform({position: new Vector3(0,-4,0),scale: new Vector3(1,1.5,1)})
    let barrier01 = new Barrier(resources.stadium.stage_gate_barrier,barrerV3,stage2GateTrigger)
  
    new Delay(100000, () => {
      let barrier01 = new Barrier(resources.stadium.stage_gate_barrier,barrerV3,stage2GateTrigger)
      //TODO create eliminated function.message and send elim.arr to function
    })

    //new Delay(200000, () => {eliminateFromRace(stage2Arr)})
    eliminateFromRace(stage2Arr)
  }
})

//
sceneMessageBus.on('stage3', (e) => {

  if (stage4Arr.length < stage3EliminationNumber) {
      
      let nameIndex = stage3Arr.indexOf(e.stageXTrigger.result)
      stage4Arr.push(stage3Arr[nameIndex])
      
      log('Stage 3 '+stage4Arr.length+' / '+stage3EliminationNumber)
      // remove the player from previous stage array
      stage3Arr.splice(nameIndex,1)
  }

  if (stage4Arr.length == stage3EliminationNumber) {
    log('(s2:'+ stage2Arr.length+')->(s3: '+stage3Arr.length+')->(s4: '+stage4Arr.length+')')
    
    let barrerV3 = new Transform({position: new Vector3(0,-4,0),scale: new Vector3(1,1.5,1)})
    let barrier01 = new Barrier(resources.stadium.stage_gate_barrier,barrerV3,stage3GateTrigger)
  
    new Delay(100000, () => {
      let barrier01 = new Barrier(resources.stadium.stage_gate_barrier,barrerV3,stage3GateTrigger)
      //TODO create eliminated function.message and send elim.arr to function
    })
    //new Delay(200000, () => {eliminateFromRace(stage3Arr)})
    eliminateFromRace(stage3Arr)
  }

})
//
sceneMessageBus.on('stage4', (e) => {

  if (stage5Arr.length < stage4EliminationNumber) {
      
    let nameIndex = stage4Arr.indexOf(e.stageXTrigger.result)
    stage5Arr.push(stage4Arr[nameIndex])
  
    log('Stage 4 '+stage5Arr.length+' / '+stage4EliminationNumber)
    // remove the player from previous stage array
    stage4Arr.splice(nameIndex,1)

  }

  if (stage5Arr.length == stage4EliminationNumber) {

    log('(s3:'+ stage3Arr.length+')->(s4: '+stage4Arr.length+')->(s5: '+stage5Arr.length+')')

    let barrerV3 = new Transform({position: new Vector3(0,-4,0),scale: new Vector3(1,1.5,1)})
    let barrier01 = new Barrier(resources.stadium.stage_gate_barrier,barrerV3,stage4GateTrigger)
  
    new Delay(100000, () => {
      let barrier01 = new Barrier(resources.stadium.stage_gate_barrier,barrerV3,stage4GateTrigger)
      //TODO create eliminated function.message and send elim.arr to function
    })
    //new Delay(200000, () => {eliminateFromRace(stage4Arr)})
    eliminateFromRace(stage4Arr)
  }
})

//
sceneMessageBus.on('stage5', (e) => {

  if (stage6Arr.length < stage5EliminationNumber) {

    let nameIndex = stage5Arr.indexOf(e.stageXTrigger.result)
    stage6Arr.push(stage5Arr[nameIndex])

    log('Stage 5 '+stage6Arr.length+' / '+stage5EliminationNumber)
    // remove the player from previous stage array
    stage5Arr.splice(nameIndex,1)
  }

  if (stage6Arr.length == stage5EliminationNumber) {

    log('(stage 5: s4: '+stage4Arr.length+')->(s5: '+stage5Arr.length+')->(s6: '+stage6Arr.length+')')
      
    let barrerV3 = new Transform({position: new Vector3(0,-4,0),scale: new Vector3(1,1.5,1)})
    let barrier01 = new Barrier(resources.stadium.stage_gate_barrier,barrerV3,stage5GateTrigger)
  
    new Delay(100000, () => {
      let barrier01 = new Barrier(resources.stadium.stage_gate_barrier,barrerV3,stage5GateTrigger)
      //TODO create eliminated function.message and send elim.arr to function
    })
    //new Delay(200000, () => {eliminateFromRace(stage5Arr)})
    eliminateFromRace(stage5Arr)
  }
})
//
sceneMessageBus.on('stage6', (e) => {

  if (stage6Arr.length < stage6EliminationNumber) {

    let nameIndex = stage6Arr.indexOf(e.stageXTrigger.result)
    finishArr.push(stage6Arr[nameIndex])
    
    log('Stage 6 '+stage6Arr.length+' / '+stage6EliminationNumber)
    // remove the player from previous stage array
    stage6Arr.splice(nameIndex,1)

  }

  if (finishArr.length == stage6EliminationNumber) {

    log('(s6: '+stage6Arr.length+')->(Final Knockout'+finishArr.length+')')
      
    let barrerV3 = new Transform({position: new Vector3(0,-4,0),scale: new Vector3(1,1.5,1)})
    let barrier01 = new Barrier(resources.stadium.stage_gate_barrier,barrerV3,stage6GateTrigger)

    new Delay(100000, () => {
      let barrier01 = new Barrier(resources.stadium.stage_gate_barrier,barrerV3,stage6GateTrigger)
      //TODO create eliminated function.message and send elim.arr to function
    })
    //new Delay(200000, () => {eliminateFromRace(stage6Arr)})
    eliminateFromRace(stage6Arr)
  }
})

//
sceneMessageBus.on('finish', (e) => {
  raceWinner = e.stageXTrigger.result
  log('race winner event racerunning '+raceRunning+' who: '+raceWinner+' curr plr'+currentPlayerName+' arr length '+stage6Arr.length)
  
  if (finishArr.length > 0) {
    log('curr Player '+currentPlayerName+' who '+e.stageXTrigger.result)
   // if (currentPlayerName == raceWinner) {
      //Display Winning Message
      
      //get eth address and transferr nft if eligible
      //sent to -> playerEthAdr
  
      winnerRect.visible = true
      winnerHeader.value = raceWinner+' is the winner!'
  
      log('You are the Winner!!>')
      
    sceneMessageBus.emit('raceRunning',{running:'false'})
  
   // }
  }
  
})
//TODO create a WINNER event + trigger

//
function eliminateFromRace(stageArray: any[]){

      stageArray.forEach(function (value){
        log('to be eliminated: '+value)

        if (currentPlayerName == value) {
          log('match Currrent Player:  '+value)
          movePlayerTo(eliminateFromRacePos) //eliminateFromRacePos
        }
      })
    }


  //   const listLog = spawnCube(5, 2.5, 24)

  //   listLog.addComponent(new OnPointerDown((e) => {
      
  //     startGateArr.forEach(function (value){
  //       log('stage1 test '+value)
  //       if (currentPlayerName == value) {
        
  //       }
  //     })
  //   }

  // ))


////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//Sounds
// Create entity


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//MATIC

//Get Player Balance
//error_test
executeTask(async () => {await matic.balance(playerEthAdr).then((value)=> {l1_l2Balance = value})})

//////////////////////////////////////
// Static assets
const donate = new Entity()
donate.addComponent(resources.stadium.donate)
donate.addComponent(new Transform({position: new Vector3(5.5,1,38.5),scale: new Vector3(.5,.5,.5)}))
donate.addComponent(
  new OnPointerDown(
    async e => {
      try {
        //error_test
            await matic.sendMana(polyGraphWallet,manaPrice,true,'mainnet')
            movePlayerTo({ x: 3, y: 0, z: 19 })
  
            log('Emitted to msg '+currentPlayerName)
            sceneMessageBus.emit('enterRace',currentPlayerName) //currentPlayerName
            //movePlayerTo({ x: 3, y: 0, z: 19 }) 
            //Make the countdown container visible
            setTimerVis(true)
            //
            restartTimer = true
            //
            raceRunning = true
          
          
          } catch (error) {
              log(error.toString());
              //TODO 
          }
  
         
  
         }
  
  )
)
engine.addEntity(donate)



const start_gate = new Entity()
start_gate.addComponent(resources.stadium.start_gate_01)
start_gate.addComponent(new Transform({position: new Vector3(0,0,0)}))
engine.addEntity(start_gate)



const floor3x7 = new Entity()
floor3x7.addComponent(resources.stadium.statium)
floor3x7.addComponent(new Transform({position: new Vector3(0,-.02,0)}))
engine.addEntity(floor3x7)

const c = new Entity()
c.addComponent(resources.stadium.sign_c)
c.addComponent(new Transform({position: new Vector3(9,12.4,20.5),rotation: Quaternion.Euler(0,0,0)}))
engine.addEntity(c)


const k = new Entity()
k.addComponent(resources.stadium.sign_k)
k.addComponent(new Transform({position: new Vector3(9,12.4,20.5),rotation: Quaternion.Euler(0,0,0)}))
engine.addEntity(k)

const o = new Entity()
o.addComponent(resources.stadium.sign_o1)
o.addComponent(new Transform({position: new Vector3(9,12.4,20.5),rotation: Quaternion.Euler(0,0,0)}))
engine.addEntity(o)

const k_lower = new Entity()
k_lower.addComponent(resources.stadium.sign_k_lower)
k_lower.addComponent(new Transform({position: new Vector3(9,12.4,20.5),rotation: Quaternion.Euler(0,0,0)}))
engine.addEntity(k_lower)

const u = new Entity()
u.addComponent(resources.stadium.sign_u)
u.addComponent(new Transform({position: new Vector3(9,12.4,20.5),rotation: Quaternion.Euler(0,0,0)}))
engine.addEntity(u)

const c1_marker = new Entity()
c1_marker.addComponent(resources.stadium.course_marker)
c1_marker.addComponent(new Transform({position: new Vector3(97.7,12.5,31.5),rotation: Quaternion.Euler(0,180,0)}))
engine.addEntity(c1_marker)


const c2_marker = new Entity()
c2_marker.addComponent(resources.stadium.course_marker)
c2_marker.addComponent(new Transform({position: new Vector3(79.7,12.2,29.5),rotation: Quaternion.Euler(0,180,0)}))
engine.addEntity(c2_marker)


const c3_marker = new Entity()
c3_marker.addComponent(resources.stadium.course_marker)
c3_marker.addComponent(new Transform({position: new Vector3(63,12.5,31.5),rotation: Quaternion.Euler(0,180,0)}))
engine.addEntity(c3_marker)

const c4_marker = new Entity()
c4_marker.addComponent(resources.stadium.course_marker)
c4_marker.addComponent(new Transform({position: new Vector3(45.8,12.5,32.4),rotation: Quaternion.Euler(0,180,0)}))
engine.addEntity(c4_marker)


const c5_marker = new Entity()
c5_marker.addComponent(resources.stadium.course_marker)
c5_marker.addComponent(new Transform({position: new Vector3(28,12.5,31.5),rotation: Quaternion.Euler(0,180,0)}))
engine.addEntity(c5_marker)



const start_gate_model = new Entity()
start_gate_model.addComponent(resources.stadium.start_gate)
start_gate_model.addComponent(new Transform({position: new Vector3(-1,0.1,16),rotation: Quaternion.Euler(0,270,0)}))
engine.addEntity(start_gate_model)



//
//
//
// Moving platform DCL Knockout sign
//TODO replace with move forward and back synced to heartBeat

const d_move = new MovingPlatform(
  resources.stadium.sign_d,
  new Vector3(9,12,20.5),
  new Vector3(6,12,20.5),
  3
)


const l_move = new MovingPlatform(
  resources.stadium.sign_l,
  new Vector3(9,11.4,20.5),
  new Vector3(7,11.4,20.5),
  3
)

const n_move = new MovingPlatform(
  resources.stadium.sign_n,
  new Vector3(9.1,11.5,20.5),
  new Vector3(6,11.5,20.5),
  3
)

const c_move = new MovingPlatform(
  resources.stadium.sign_c_lower,
  new Vector3(11,11.6,20.5),
  new Vector3(5,11.6,20.5),
  3
)

const o2_move = new MovingPlatform(
  resources.stadium.sign_o2,
  new Vector3(9.1,11.7,20.5),
  new Vector3(6,11.7,20.5),
  3
)

const t_move = new MovingPlatform(
  resources.stadium.sign_t,
  new Vector3(11,11.8,20.5),
  new Vector3(5,11.8,20.5),
  3
)
/*
const finish_move = new MovingPlatform(
  resources.stadium.finish_plat,
  new Vector3(2.5,4.5,35),
  new Vector3(2.5,4.5,33),
  3
)
*/
///////////////////////////////////////////////////////////////////////////////
//
//Bottom level obsticles
const roundaboutA1 = new RotatingPlatform(
  resources.stadium.roundaboutAShape,
  new Transform({ position: new Vector3(28, 3, 34),scale: new Vector3(2,1,2)}),
  Quaternion.Euler(0, 100, 0)
)
const roundaboutB1 = new RotatingPlatform(
  resources.stadium.roundaboutAShape,
  new Transform({ position: new Vector3(28, 3, 18),scale: new Vector3(2,1,2)}),
  Quaternion.Euler(0, 100, 0)
)

const roundabout2 = new RotatingPlatform(
  resources.stadium.roundaboutAShape,
  new Transform({ position: new Vector3(42, 3, 26),scale: new Vector3(2,1,2) }),
  Quaternion.Euler(0, 120, 0)
)

const roundabout3 = new RotatingPlatform(
  resources.stadium.roundaboutAShape,
  new Transform({ position: new Vector3(55, 3, 34),scale: new Vector3(2,1,2) }),
  Quaternion.Euler(0, 120, 0)
)

const roundabout4 = new RotatingPlatform(
  resources.stadium.roundaboutAShape,
  new Transform({ position: new Vector3(55, 3, 18),scale: new Vector3(2,1,2) }),
  Quaternion.Euler(0, 120, 0)
)

const roundabout5 = new RotatingPlatform(
  resources.stadium.roundaboutAShape,
  new Transform({ position: new Vector3(70, 3, 34),scale: new Vector3(2,1,2) }),
  Quaternion.Euler(0, 120, 0)
)

const roundabout6 = new RotatingPlatform(
  resources.stadium.roundaboutAShape,
  new Transform({ position: new Vector3(70, 3, 18),scale: new Vector3(2,1,2) }),
  Quaternion.Euler(0, 120, 0)
)

const roundabout7 = new RotatingPlatform(
  resources.stadium.roundaboutAShape,
  new Transform({ position: new Vector3(85, 3, 24),scale: new Vector3(2,1,2) }),
  Quaternion.Euler(0, 120, 0)
)


//TODO remove replace with bronze silver gold medals
const crown1 = new RotatingPlatform(
  resources.stadium.crown,
  new Transform({ position: new Vector3(0, 1,0) }),
  Quaternion.Euler(0, 10, 0)
)
crown1.setParent(finish_move)



//platform01 obsticles
const staticPlatform = new Entity()
staticPlatform.addComponent(resources.course01.platform)
staticPlatform.addComponent(new Transform({position: new Vector3(3,1,4),scale: new Vector3(1,.5,1)}))
staticPlatform.setParent(c1_marker)
engine.addEntity(staticPlatform)

let path = [new Vector3(0, -1, 1.5), new Vector3(0, 1, 1.5), new Vector3(0, 1, -1.5), new Vector3(0, -1, -1.5)]
const knocker01 = new PathedPlatform(resources.course01.knocker, path,2)
knocker01.setParent(staticPlatform)



const platform02 = new Entity()
platform02.addComponent(resources.course01.platform)
platform02.addComponent(new Transform({position: new Vector3(3,1.7,10),scale: new Vector3(1,.5,1.5)}))
platform02.setParent(c1_marker)
engine.addEntity(platform02)

const knocker02 = new PathedPlatform(resources.course01.knocker, path,2)
knocker02.setParent(platform02)

const platform03 = new Entity()
platform03.addComponent(resources.course01.platform)
platform03.addComponent(new Transform({position: new Vector3(3,2,16),scale: new Vector3(1,.5,1.5)}))
platform03.setParent(c1_marker)
engine.addEntity(platform03)

const knocker03 = new PathedPlatform(resources.course01.knocker, path,2)
knocker03.setParent(platform03)

const platform04 = new Entity()
platform04.addComponent(resources.course01.platform)
platform04.addComponent(new Transform({position: new Vector3(3,2,25),scale: new Vector3(2,.5,2.5)}))
platform04.setParent(c1_marker)
engine.addEntity(platform04)

const knocker04 = new PathedPlatform(resources.course01.knocker, path,2)
knocker04.setParent(platform04)


const platform05 = new Entity()
platform05.addComponent(resources.course01.platform)
platform05.addComponent(new Transform({position: new Vector3(12,3.8,25),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
platform05.setParent(c1_marker)
engine.addEntity(platform05)

const knocker05 = new PathedPlatform(resources.course01.knocker, path,2)
knocker05.setParent(platform05)

const platform06 = new Entity()
platform06.addComponent(resources.course01.platform)
platform06.addComponent(new Transform({position: new Vector3(12,5,17),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
platform06.setParent(c1_marker)
engine.addEntity(platform06)

const knocker06 = new PathedPlatform(resources.course01.knocker, path,2)
knocker06.setParent(platform06)

const platform07 = new Entity()
platform07.addComponent(resources.course01.platform)
platform07.addComponent(new Transform({position: new Vector3(12,5,8),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
platform07.setParent(c1_marker)
engine.addEntity(platform07)

const knocker07 = new PathedPlatform(resources.course01.knocker, path,2)
knocker07.setParent(platform07)


//course02 obsticles
const whacker01 = new RotatingPlatform(
 resources.course02.whacker,
  new Transform({ position: new Vector3(8, 3.2, 16) }),
  Quaternion.Euler(0, -120, 0)
)
whacker01.setParent(c2_marker)

const whacker02 = new RotatingPlatform(
  resources.course02.whacker,
  new Transform({ position: new Vector3(8, 7, 16) }),
  Quaternion.Euler(0, -110, 0)
)
whacker02.setParent(c2_marker)

const whacker03 = new RotatingPlatform(
  resources.course02.whacker,
  new Transform({ position: new Vector3(8, 11, 16) }),
  Quaternion.Euler(0, -120, 0)
)
 whacker03.setParent(c2_marker)

//course 03 obsticles
const turbine01 = new RotatingPlatform(
  resources.course03.turbine,
  new Transform({ position: new Vector3(12, 7, 17),rotation: Quaternion.Euler(90,0,0) }),
  Quaternion.Euler(0, -80, 0)
)
turbine01.setParent(c3_marker)

const lp_group_01_centre = new RotatingPlatform(
  resources.course03.lilypad_centre,
  new Transform({ position: new Vector3(5, 1.5, 12),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -10, 0)
)
lp_group_01_centre.setParent(c3_marker)

const lp_group_01_inner = new RotatingPlatform(
  resources.course03.lilypad_inner,
  new Transform({ position: new Vector3(0, 0, 0),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -10, 0)
)
lp_group_01_inner.setParent(lp_group_01_centre)

const lp_group_01_outer = new RotatingPlatform(
  resources.course03.lilypad_outer,
  new Transform({ position: new Vector3(0, 0, 0),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -10, 0)
)
lp_group_01_outer.setParent(lp_group_01_inner)



const lp_group_02_centre = new RotatingPlatform(
  resources.course03.lilypad_centre,
  new Transform({ position: new Vector3(5, 1.5, 18),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -7, 0)
)
lp_group_02_centre.setParent(c3_marker)

const lp_group_02_inner = new RotatingPlatform(
  resources.course03.lilypad_inner,
  new Transform({ position: new Vector3(0, 0, 0),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -7, 0)
)
lp_group_02_inner.setParent(lp_group_02_centre)

const lp_group_02_outer = new RotatingPlatform(
  resources.course03.lilypad_outer,
  new Transform({ position: new Vector3(0, 0, 0),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, 7, 0)
)
lp_group_02_outer.setParent(lp_group_02_inner)



const lp_group_03_centre = new RotatingPlatform(
  resources.course03.lilypad_centre,
  new Transform({ position: new Vector3(5, 1.5, 24),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -5, 0)
)
lp_group_03_centre.setParent(c3_marker)

const lp_group_03_inner = new RotatingPlatform(
  resources.course03.lilypad_inner,
  new Transform({ position: new Vector3(0, 0, 0),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -5, 0)
)
lp_group_03_inner.setParent(lp_group_03_centre)

const lp_group_03_outer = new RotatingPlatform(
  resources.course03.lilypad_outer,
  new Transform({ position: new Vector3(0, 0, 0),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -12, 0)
)
lp_group_03_outer.setParent(lp_group_03_inner)


//course 04

const door_row1 = new Entity()
door_row1.addComponent(resources.course04.door)
door_row1.addComponent(new Transform({position: new Vector3(1.47,0,0.1)}))
door_row1.setParent(c4_marker)

const door_row1_f1 = new Entity()
door_row1_f1.addComponent(resources.course04.door_fake)
door_row1_f1.addComponent(new Transform({position: new Vector3(4.35,0,0.1)}))
door_row1_f1.setParent(c4_marker)

const door_row1_f2 = new Entity()
door_row1_f2.addComponent(resources.course04.door_fake)
door_row1_f2.addComponent(new Transform({position: new Vector3(7.15,0,0.1)}))
door_row1_f2.setParent(c4_marker)


const door_row2 = new Entity()
door_row2.addComponent(resources.course04.door_fake)
door_row2.addComponent(new Transform({position: new Vector3(1.47,0,5.1)}))
door_row2.setParent(c4_marker)

const door_row2_f1 = new Entity()
door_row2_f1.addComponent(resources.course04.door)
door_row2_f1.addComponent(new Transform({position: new Vector3(4.35,0,5.1)}))
door_row2_f1.setParent(c4_marker)

const door_row2_f2 = new Entity()
door_row2_f2.addComponent(resources.course04.door_fake)
door_row2_f2.addComponent(new Transform({position: new Vector3(7.15,0,5.1)}))
door_row2_f2.setParent(c4_marker)


const door_row3 = new Entity()
door_row3.addComponent(resources.course04.door_fake)
door_row3.addComponent(new Transform({position: new Vector3(1.47,0,10.1)}))
door_row3.setParent(c4_marker)

const door_row3_f1 = new Entity()
door_row3_f1.addComponent(resources.course04.door)
door_row3_f1.addComponent(new Transform({position: new Vector3(4.35,0,10.1)}))
door_row3_f1.setParent(c4_marker)

const door_row3_f2 = new Entity()
door_row3_f2.addComponent(resources.course04.door_fake)
door_row3_f2.addComponent(new Transform({position: new Vector3(7.15,0,10.1)}))
door_row3_f2.setParent(c4_marker)




const door_row4 = new Entity()
door_row4.addComponent(resources.course04.door)
door_row4.addComponent(new Transform({position: new Vector3(1.47,0,15.1)}))
door_row4.setParent(c4_marker)

const door_row4_f1 = new Entity()
door_row4_f1.addComponent(resources.course04.door_fake)
door_row4_f1.addComponent(new Transform({position: new Vector3(4.35,0,15.1)}))
door_row4_f1.setParent(c4_marker)

const door_row4_f2 = new Entity()
door_row4_f2.addComponent(resources.course04.door_fake)
door_row4_f2.addComponent(new Transform({position: new Vector3(7.15,0,15.1)}))
door_row4_f2.setParent(c4_marker)



const door_row5 = new Entity()
door_row5.addComponent(resources.course04.door_fake)
door_row5.addComponent(new Transform({position: new Vector3(1.47,0,20.1)}))
door_row5.setParent(c4_marker)

const door_row5_f1 = new Entity()
door_row5_f1.addComponent(resources.course04.door_fake)
door_row5_f1.addComponent(new Transform({position: new Vector3(4.35,0,20.1)}))
door_row5_f1.setParent(c4_marker)

const door_row5_f2 = new Entity()
door_row5_f2.addComponent(resources.course04.door)
door_row5_f2.addComponent(new Transform({position: new Vector3(7.15,0,20.1)}))
door_row5_f2.setParent(c4_marker)


const door_row6 = new Entity()
door_row6.addComponent(resources.course04.door_fake)
door_row6.addComponent(new Transform({position: new Vector3(1.47,0,25.1)}))
door_row6.setParent(c4_marker)

const door_row6_f1 = new Entity()
door_row6_f1.addComponent(resources.course04.door_fake)
door_row6_f1.addComponent(new Transform({position: new Vector3(4.35,0,25.1)}))
door_row6_f1.setParent(c4_marker)

const door_row6_f2 = new Entity()
door_row6_f2.addComponent(resources.course04.door)
door_row6_f2.addComponent(new Transform({position: new Vector3(7.15,0,25.1)}))
door_row6_f2.setParent(c4_marker)

//upper level
const door_upper_row1 = new Entity()
door_upper_row1.addComponent(resources.course04.door)
door_upper_row1.addComponent(new Transform({position: new Vector3(10.7,3,25.1),scale: new Vector3(1.2,1,1)}))
door_upper_row1.setParent(c4_marker)

const door_upper_row1_f1 = new Entity()
door_upper_row1_f1.addComponent(resources.course04.door_fake)
door_upper_row1_f1.addComponent(new Transform({position: new Vector3(13.35,3,25.1),scale: new Vector3(1.2,1,1)}))
door_upper_row1_f1.setParent(c4_marker)


const door_upper_row2 = new Entity()
door_upper_row2.addComponent(resources.course04.door_fake)
door_upper_row2.addComponent(new Transform({position: new Vector3(10.7,3,20.1),scale: new Vector3(1.2,1,1)}))
door_upper_row2.setParent(c4_marker)

const door_upper_row2_f1 = new Entity()
door_upper_row2_f1.addComponent(resources.course04.door)
door_upper_row2_f1.addComponent(new Transform({position: new Vector3(13.35,3,20.1),scale: new Vector3(1.2,1,1)}))
door_upper_row2_f1.setParent(c4_marker)


const door_upper_row3 = new Entity()
door_upper_row3.addComponent(resources.course04.door)
door_upper_row3.addComponent(new Transform({position: new Vector3(10.7,3,15.1),scale: new Vector3(1.2,1,1)}))
door_upper_row3.setParent(c4_marker)

const door_upper_row3_f1 = new Entity()
door_upper_row3_f1.addComponent(resources.course04.door_fake)
door_upper_row3_f1.addComponent(new Transform({position: new Vector3(13.35,3,15.1),scale: new Vector3(1.2,1,1)}))
door_upper_row3_f1.setParent(c4_marker)


const door_upper_row4 = new Entity()
door_upper_row4.addComponent(resources.course04.door_fake)
door_upper_row4.addComponent(new Transform({position: new Vector3(10.7,3,10.1),scale: new Vector3(1.2,1,1)}))
door_upper_row4.setParent(c4_marker)

const door_upper_row4_f1 = new Entity()
door_upper_row4_f1.addComponent(resources.course04.door)
door_upper_row4_f1.addComponent(new Transform({position: new Vector3(13.35,3,10.1),scale: new Vector3(1.2,1,1)}))
door_upper_row4_f1.setParent(c4_marker)


//course05

//rotating_platform


const right_rotating_platform = new RotatingPlatform(
 resources.course05.rotating_platform_2x,
  new Transform({ position: new Vector3(6, 6, 16),rotation: Quaternion.Euler(0,90,0),scale: new Vector3(1.3,1,1) }),
  Quaternion.Euler(-12, 0, 0)
)
right_rotating_platform.setParent(c5_marker)
engine.addEntity(right_rotating_platform);



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//BUILDER HUD
//
// const hud:BuilderHUD =  new BuilderHUD()
//  // hud.setDefaultParent(stage01)
//  hud.attachToEntity(listLog)
//
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////
//UI


const gameUICanvas = new UICanvas()


const gameUI = new UIImage(gameUICanvas, resources.textureImages.gameUI)
gameUI.name = "clickable-image"
gameUI.width = "200"
gameUI.height = "470"
gameUI.sourceWidth = 574
gameUI.sourceHeight = 778
gameUI.isPointerBlocker = true
gameUI.hAlign = 'right'
gameUI.vAlign = 'center'
gameUI.positionY = 20
gameUI.positionX = 0
gameUI.opacity = .85
gameUI.sourceLeft = 1
gameUI.sourceTop = 1
gameUI.sourceWidth = 315
gameUI.sourceHeight = 790



//////////////////////////////////////////////////
//ENTER GAME
const enterGameBtn = new UIImage(gameUICanvas, resources.textureImages.gameUI)
enterGameBtn.name = "clickable-image"
enterGameBtn.width = "164" //164
enterGameBtn.height = "20"
enterGameBtn.sourceWidth = 574
enterGameBtn.sourceHeight = 805
enterGameBtn.isPointerBlocker = true
enterGameBtn.hAlign = 'right'
enterGameBtn.vAlign = 'bottom'
enterGameBtn.positionY = 185
enterGameBtn.positionX = -12
enterGameBtn.opacity = 1
enterGameBtn.sourceLeft = 320
enterGameBtn.sourceTop = 600
enterGameBtn.sourceWidth = 255
enterGameBtn.sourceHeight = 35
enterGameBtn.visible = true
enterGameBtn.onClick = new OnPointerDown(
  async e => {
    try {
      //error_test
          await matic.sendMana(polyGraphWallet,manaPrice,true,'mainnet')
          movePlayerTo({ x: 3, y: 0, z: 19 })

          log('Emitted to msg '+currentPlayerName)
          sceneMessageBus.emit('enterRace',currentPlayerName) //currentPlayerName
          //movePlayerTo({ x: 3, y: 0, z: 19 }) 
          //Make the countdown container visible
          setTimerVis(true)
          //
          restartTimer = true
          //
          raceRunning = true
        
        
        } catch (error) {
            log(error.toString());
            //TODO 
        }

       

       }

)


/////////////////////////////////////
//

const mana2EnterTxt = new UIText(gameUICanvas)
mana2EnterTxt.value = String(manaPrice)
mana2EnterTxt.fontSize = 13
mana2EnterTxt.hAlign = 'right'
mana2EnterTxt.vAlign = 'bottom'
mana2EnterTxt.color = Color4.Black()
mana2EnterTxt.positionY = 186
mana2EnterTxt.positionX = -64
mana2EnterTxt.opacity = 1
mana2EnterTxt.isPointerBlocker = false

  
const gameUI_gold = new UIImage(gameUI, resources.textureImages.gameUI)
gameUI_gold.name = "clickable-image"
gameUI_gold.width = "55"
gameUI_gold.height = "18"
gameUI_gold.sourceWidth = 574
gameUI_gold.sourceHeight = 790
gameUI_gold.isPointerBlocker = false
gameUI_gold.hAlign = 'left'
gameUI_gold.vAlign = 'top'
gameUI_gold.positionY = -94
gameUI_gold.positionX = 25
gameUI_gold.opacity = 1
gameUI_gold.sourceLeft = 320
gameUI_gold.sourceTop = 160
gameUI_gold.sourceWidth = 83
gameUI_gold.sourceHeight = 30
gameUI_gold.visible = true



const gameUI_silver = new UIImage(gameUI, resources.textureImages.gameUI)
gameUI_silver.name = "clickable-image"
gameUI_silver.width = "55"
gameUI_silver.height = "18"
gameUI_silver.sourceWidth = 574
gameUI_silver.sourceHeight = 790
gameUI_silver.isPointerBlocker = false
gameUI_silver.hAlign = 'left'
gameUI_silver.vAlign = 'top'
gameUI_silver.positionY = -94
gameUI_silver.positionX = 81
gameUI_silver.opacity = 1
gameUI_silver.sourceLeft = 405
gameUI_silver.sourceTop = 160
gameUI_silver.sourceWidth = 83
gameUI_silver.sourceHeight = 30
gameUI_silver.visible = true



const gameUI_bronze = new UIImage(gameUI, resources.textureImages.gameUI)
gameUI_bronze.name = "clickable-image"
gameUI_bronze.width = "55"
gameUI_bronze.height = "18"
gameUI_bronze.sourceWidth = 574
gameUI_bronze.sourceHeight = 790
gameUI_bronze.isPointerBlocker = false
gameUI_bronze.hAlign = 'left'
gameUI_bronze.vAlign = 'top'
gameUI_bronze.positionY = -94
gameUI_bronze.positionX = 135
gameUI_bronze.opacity = 1
gameUI_bronze.sourceLeft = 490
gameUI_bronze.sourceTop = 160
gameUI_bronze.sourceWidth = 83
gameUI_bronze.sourceHeight = 30
gameUI_bronze.visible = true


const goldNftText = new UIText(gameUI)
goldNftText.value = 'Gold: 00'
goldNftText.fontSize = 9
goldNftText.hAlign = 'left'
goldNftText.vAlign = 'top'
goldNftText.color = Color4.Black()
goldNftText.positionY = -99
goldNftText.positionX = 33


//////////////////////////////////////////////////
//DEPOSIT 10
const deposit10Btn = new UIImage(gameUICanvas, resources.textureImages.gameUI)
deposit10Btn.name = "clickable-image"
deposit10Btn.width = "30"
deposit10Btn.height = "25"
deposit10Btn.sourceWidth = 574
deposit10Btn.sourceHeight = 805
deposit10Btn.isPointerBlocker = true
deposit10Btn.hAlign = 'right'
deposit10Btn.vAlign = 'bottom'
deposit10Btn.positionY = 127
deposit10Btn.positionX = -140
deposit10Btn.opacity = 1
deposit10Btn.sourceLeft = 320
deposit10Btn.sourceTop = 680
deposit10Btn.sourceWidth = 50
deposit10Btn.sourceHeight = 50
deposit10Btn.visible = true
deposit10Btn.onClick = new OnPointerDown(
  async ()=>{
    log('DEPOSIT 10')
    try {
      //error_test
      await matic.depositMana(10,'mainnet')
    } catch {log('failed to deposit')}
  }
)


//////////////////////////////////////////////////
//DEPOSIT 50
const deposit50Btn = new UIImage(gameUICanvas, resources.textureImages.gameUI)
deposit50Btn.name = "clickable-image"
deposit50Btn.width = "30"
deposit50Btn.height = "25"
deposit50Btn.sourceWidth = 574
deposit50Btn.sourceHeight = 805
deposit50Btn.isPointerBlocker = true
deposit50Btn.hAlign = 'right'
deposit50Btn.vAlign = 'bottom'
deposit50Btn.positionY = 127
deposit50Btn.positionX = -107
deposit50Btn.opacity = 1
deposit50Btn.sourceLeft = 373
deposit50Btn.sourceTop = 680
deposit50Btn.sourceWidth = 50
deposit50Btn.sourceHeight = 50
deposit50Btn.visible = true
deposit50Btn.onClick = new OnPointerDown(
  async ()=>{
    log('DEPOSIT 50')
    try {
      //error_test
      await matic.depositMana(50,'mainnet')
    } catch {log('failed to deposit')}
  }
)

//////////////////////////////////////////////////
//DEPOSIT 100
const deposit100Btn = new UIImage(gameUICanvas, resources.textureImages.gameUI)
deposit100Btn.name = "clickable-image"
deposit100Btn.width = "30"
deposit100Btn.height = "25"
deposit100Btn.sourceWidth = 574
deposit100Btn.sourceHeight = 805
deposit100Btn.isPointerBlocker = true
deposit100Btn.hAlign = 'right'
deposit100Btn.vAlign = 'bottom'
deposit100Btn.positionY = 127
deposit100Btn.positionX = -73
deposit100Btn.opacity = 1
deposit100Btn.sourceLeft = 425
deposit100Btn.sourceTop = 680
deposit100Btn.sourceWidth = 50
deposit100Btn.sourceHeight = 50
deposit100Btn.visible = true
deposit100Btn.onClick = new OnPointerDown(
  async ()=>{
    log('DEPOSIT 100')
    try {
      //error_test
      await matic.depositMana(100,'mainnet')
    } catch {log('failed to deposit')}
  }
)


// //////////////////////////////////////////////////
// //DEPOSIT 1000
// const deposit1000Btn = new UIImage(gameUICanvas, resources.textureImages.gameUI)
// deposit1000Btn.name = "clickable-image"
// deposit1000Btn.width = "30"
// deposit1000Btn.height = "25"
// deposit1000Btn.sourceWidth = 574
// deposit1000Btn.sourceHeight = 805
// deposit1000Btn.isPointerBlocker = true
// deposit1000Btn.hAlign = 'right'
// deposit1000Btn.vAlign = 'bottom'
// deposit1000Btn.positionY = 127
// deposit1000Btn.positionX = -40
// deposit1000Btn.opacity = 1
// deposit1000Btn.sourceLeft = 477
// deposit1000Btn.sourceTop = 680
// deposit1000Btn.sourceWidth = 50
// deposit1000Btn.sourceHeight = 50
// deposit1000Btn.visible = true
// deposit1000Btn.onClick = new OnPointerDown(
//   async ()=>{
//     log('DEPOSIT 1000')
//     try {
//       //error_test
//       await matic.depositMana(1000,'mainnet')
//     } catch {log('failed to deposit')}
//   }
// )

//////////////////////////////////////////////////
//DEPOSIT Info
const depositInfoBtn = new UIImage(gameUICanvas, resources.textureImages.gameUI)
depositInfoBtn.name = "clickable-image"
depositInfoBtn.width = "20"
depositInfoBtn.height = "25"
depositInfoBtn.sourceWidth = 574
depositInfoBtn.sourceHeight = 805
depositInfoBtn.isPointerBlocker = true
depositInfoBtn.hAlign = 'right'
depositInfoBtn.vAlign = 'bottom'
depositInfoBtn.positionY = 127
depositInfoBtn.positionX = -15
depositInfoBtn.opacity = 1
depositInfoBtn.sourceLeft = 530
depositInfoBtn.sourceTop = 680
depositInfoBtn.sourceWidth = 30
depositInfoBtn.sourceHeight = 50
depositInfoBtn.visible = true
depositInfoBtn.onClick = new OnPointerDown(
  (e)=>{
    log('DEPOSIT info')
   
  }
)

//////////////////////////////////////////////////
//Race TIER Info
const tierInfoBtn = new UIImage(gameUICanvas, resources.textureImages.gameUI)
tierInfoBtn.name = "clickable-image"
tierInfoBtn.width = "20"
tierInfoBtn.height = "25"
tierInfoBtn.sourceWidth = 574
tierInfoBtn.sourceHeight = 805
tierInfoBtn.isPointerBlocker = true
tierInfoBtn.hAlign = 'right'
tierInfoBtn.vAlign = 'top'
tierInfoBtn.positionY = -119
tierInfoBtn.positionX = -12
tierInfoBtn.opacity = 1
tierInfoBtn.sourceLeft = 530
tierInfoBtn.sourceTop = 680
tierInfoBtn.sourceWidth = 30
tierInfoBtn.sourceHeight = 50
tierInfoBtn.visible = true
tierInfoBtn.onClick = new OnPointerDown(
  (e)=>{
    log('DEPOSIT tier info')
   
  }
)


const silverNftText = new UIText(gameUI)
silverNftText.value = 'Silver: 00'
silverNftText.fontSize = 9
silverNftText.hAlign = 'left'
silverNftText.vAlign = 'top'
silverNftText.color = Color4.Black()
silverNftText.positionY = -99
silverNftText.positionX = 85

const bronzeNftText = new UIText(gameUI)
bronzeNftText.value = 'Bronze: 00'
bronzeNftText.fontSize = 9
bronzeNftText.hAlign = 'left'
bronzeNftText.vAlign = 'top'
bronzeNftText.color = Color4.Black()
bronzeNftText.positionY = -99
bronzeNftText.positionX = 137

//
const startTextMsg = new UIText(gameUI)
startTextMsg.value = 'Players in Race: '+playersInGate
startTextMsg.fontSize = 13
startTextMsg.hAlign = 'center'
startTextMsg.vAlign = 'bottom'
startTextMsg.color = Color4.Black()
startTextMsg.positionY = 132
startTextMsg.positionX = 0

//L2
const maticBalanceTxt = new UIText(gameUI)
maticBalanceTxt.value = '(L2) Matic/Mana Balance:'+playersInGate
maticBalanceTxt.fontSize = 9
maticBalanceTxt.hAlign = 'center'
maticBalanceTxt.vAlign = 'bottom'
maticBalanceTxt.color = Color4.Black()
maticBalanceTxt.positionY = 79
maticBalanceTxt.positionX = -20

//L1
const manaBalanceTxt = new UIText(gameUI)
manaBalanceTxt.value = '(L1) Mana Balance:'+playersInGate
manaBalanceTxt.fontSize = 9
manaBalanceTxt.hAlign = 'center'
manaBalanceTxt.vAlign = 'bottom'
manaBalanceTxt.color = Color4.Black()
manaBalanceTxt.positionY = 7
manaBalanceTxt.positionX = -20


//////////////////////////////
//STAGE 1 UI

const stage01Container = new UIContainerRect(gameUI)
stage01Container.adaptWidth = true
stage01Container.width = '80%'
stage01Container.height = '3.5%'
stage01Container.color = Color4.White()
stage01Container.hAlign = 'center'
stage01Container.vAlign = 'bottom'
stage01Container.opacity = 
stage01Container.positionY = 168
stage01Container.positionX = 7
stage01Container.opacity = 1


const stage01Msg = new UIText(stage01Container)
stage01Msg.value = 'Stage 1: '+playersInGate
stage01Msg.fontSize = 13
stage01Msg.hAlign = 'center'
stage01Msg.vAlign = 'bottom'
stage01Msg.color = Color4.Black()
stage01Msg.positionY = 0
stage01Msg.positionX = 5

///////////////////////
//STAGE 2 UI

const stage02Container = new UIContainerRect(gameUI)
stage02Container.adaptWidth = true
stage02Container.width = '80%'
stage02Container.height = '3.5%'
stage02Container.color = Color4.White()
stage02Container.hAlign = 'center'
stage02Container.vAlign = 'bottom'
stage02Container.opacity = 
stage02Container.positionY = 188
stage02Container.positionX = 7


const stage02Msg = new UIText(stage02Container)
stage02Msg.value = 'Stage 2: '+playersInGate
stage02Msg.fontSize = 13
stage02Msg.hAlign = 'center'
stage02Msg.vAlign = 'bottom'
stage02Msg.color = Color4.Black()
stage02Msg.positionY = 0
stage02Msg.positionX = 5


///////////////////////
//STAGE 3 UI

const stage03Container = new UIContainerRect(gameUI)
stage03Container.adaptWidth = true
stage03Container.width = '80%'
stage03Container.height = '3.5%'
stage03Container.color = Color4.White()
stage03Container.hAlign = 'center'
stage03Container.vAlign = 'bottom'
stage03Container.opacity = 
stage03Container.positionY = 208
stage03Container.positionX = 7


const stage03Msg = new UIText(stage03Container)
stage03Msg.value = 'Stage 3: '+playersInGate
stage03Msg.fontSize = 13
stage03Msg.hAlign = 'center'
stage03Msg.vAlign = 'bottom'
stage03Msg.color = Color4.Black()
stage03Msg.positionY = 0
stage03Msg.positionX = 5

///////////////////////
//STAGE 4 UI

const stage04Container = new UIContainerRect(gameUI)
stage04Container.adaptWidth = true
stage04Container.width = '80%'
stage04Container.height = '3.5%'
stage04Container.color = Color4.White()
stage04Container.hAlign = 'center'
stage04Container.vAlign = 'bottom'
stage04Container.opacity = 
stage04Container.positionY = 228
stage04Container.positionX = 7


const stage04Msg = new UIText(stage04Container)
stage04Msg.value = 'Stage 4: '+playersInGate
stage04Msg.fontSize = 13
stage04Msg.hAlign = 'center'
stage04Msg.vAlign = 'bottom'
stage04Msg.color = Color4.Black()
stage04Msg.positionY = 0
stage04Msg.positionX = 5

///////////////////////
//STAGE 5 UI

const stage05Container = new UIContainerRect(gameUI)
stage05Container.adaptWidth = true
stage05Container.width = '80%'
stage05Container.height = '3.5%'
stage05Container.color = Color4.White()
stage05Container.hAlign = 'center'
stage05Container.vAlign = 'bottom'
stage05Container.opacity = 
stage05Container.positionY = 248
stage05Container.positionX = 7


const stage05Msg = new UIText(stage05Container)
stage05Msg.value = 'Stage 5: '+playersInGate
stage05Msg.fontSize = 13
stage05Msg.hAlign = 'center'
stage05Msg.vAlign = 'bottom'
stage05Msg.color = Color4.Black()
stage05Msg.positionY = 0
stage05Msg.positionX = 5


///////////////////////
//STAGE 6 UI

const stage06Container = new UIContainerRect(gameUI)
stage06Container.adaptWidth = true
stage06Container.width = '80%'
stage06Container.height = '3.5%'
stage06Container.color = Color4.White()
stage06Container.hAlign = 'center'
stage06Container.vAlign = 'bottom'
stage06Container.opacity = 
stage06Container.positionY = 268
stage06Container.positionX = 7


const stage06Msg = new UIText(stage06Container)
stage06Msg.value = 'Stage 6: '+playersInGate
stage06Msg.fontSize = 13
stage06Msg.hAlign = 'center'
stage06Msg.vAlign = 'bottom'
stage06Msg.color = Color4.Black()
stage06Msg.positionY = 0
stage06Msg.positionX = 5

///////////////////////////////////////////////
///////////////////////////////////////////////
//Timer UI


const timerContainer = new UICanvas()

const timerRect = new UIContainerRect(timerContainer)
timerRect.adaptWidth = true
timerRect.width = '30%'
timerRect.height = '6%'
timerRect.positionY = 140
timerRect.positionX = -4
timerRect.color = Color4.Black()
timerRect.hAlign = 'center'
timerRect.vAlign = 'bottom'
timerRect.opacity = 0.9
timerRect.visible = false


const timerHeader = new UIText(timerRect)
timerHeader.fontSize = 16
timerHeader.value = '``: '
timerHeader.hAlign = 'center'
timerHeader.vAlign = 'bottom'
timerHeader.color = Color4.White()
timerHeader.positionY = 8
timerHeader.positionX = -40


//Winner

const winnerContainer = new UICanvas()

const winnerRect = new UIContainerRect(winnerContainer)
winnerRect.adaptWidth = true
winnerRect.width = '30%'
winnerRect.height = '6%'
winnerRect.positionY = 40
winnerRect.positionX = 0
winnerRect.color = Color4.Black()
winnerRect.hAlign = 'center'
winnerRect.vAlign = 'bottom'
winnerRect.opacity = 0.9
winnerRect.visible = false


const winnerHeader = new UIText(winnerRect)
winnerHeader.fontSize = 16
winnerHeader.value = 'You are the winner'
winnerHeader.hAlign = 'center'
winnerHeader.vAlign = 'bottom'
winnerHeader.color = Color4.White()
winnerHeader.positionY = 0
winnerHeader.positionX = -40

////////////////////////////////////////////
//TIMER Ticks

let timerCountDown:number 
let countDown:number 

sceneMessageBus.on('timerTick', (e) => {
   log('timer: '+e.tick)
 
  timerCountDown =  e.tick
  timerHeader.value = 'Next Race starting in : '+timerCountDown
  // log('timer: '+timerCountDown)
  //sceneMessageBus.emit('raceRunning',{running:'true'})

        if (timerCountDown==0) {

          //msg gate is open
          sceneMessageBus.emit('open_close_start_gate',{gate: 'open'})
          timerRect.visible = false
         
          //
          //sceneMessageBus.emit('nextRaceStartingTimer',{tick: tick, timerVisible: false,currentPlayerName: currentPlayerName})
          
            sceneMessageBus.emit('raceRunning',{running:'true'}) 
        }
  })  


  sceneMessageBus.on('raceRunning', (e) => {
    raceRunning = e.running
    log('running?: '+e.running)
  
    })
  
function setTimerVis(VisYN:boolean){
  log('function worked')
  timerRect.visible = VisYN
}

/////////////////////////////////////////////
//

let countDownDelay:number = 25 
//the prevSecond is used to ensure mgs are only sent every second
let prevSecond = -50
let tick:number


//Update the UI with the player qualification results
export class LoopSystem implements ISystem {
  update(dt){

   // raceRunning=false

   // log(':-:::- '+raceRunning)
   // if (tick>0) {
  if (raceRunning) {
      //log(':-- '+raceRunning)
          
        if (restartTimer){
          log('restart')
          //dt = 0
          tick = 0
          timer = 0
          prevSecond = 1
          countDown = 0
          timerRect.visible = true
          
        }

        //Turn off the restart timer
        restartTimer= false

        timer += dt
        
        tick = Math.ceil(timer)

        countDown = countDownDelay - tick
log('timer stuff tick '+ tick  +'countDown ' + countDown )
//        sceneMessageBus.emit('nextRaceStartingTimer',{tick: tick, timerVisible: true, currentPlayerName: currentPlayerName})
        /*
        var mind = timer % (60 * 60)
        minuteTimer = Math.floor(mind/60)
        var minStr:String = String(minuteTimer)

        var secd = mind % 60
        secondsTimer = Math.ceil(secd) - 10
        //countDown30 = countDown30 - secondsTimer

        if (secondsTimer < 10) {
          var secondStr:String = '0' + String(secondsTimer)

        } else {
          var secondStr:String = String(secondsTimer)
        }

        minSecTimer = minStr + ":" + secondStr

        //let tickTock = timerMinSec(timer)
        // timeMinSec.value = minSecTimer
          //log('minute second: '+minSecTimer)
          */
         if (timerHeader.value!=undefined){
           // timerHeader.value = '``: '+countDown
         }
          //Determine if client is the game host
          if(startGateArr[0] == currentPlayerName){
              
            
           
            //Execute once per second
            if(tick>prevSecond){
             
              prevSecond = tick
            //log ('prevSecond '+ prevSecond)
            
                sceneMessageBus.emit('timerTick', {tick: countDown}) //tick
              
              
              
            }
          
          }      

  } 
  


    ///////////
    playersInGate = startGateArr.length
    playersRacing = stage1Arr.length
   // log('color'+Color4.FromHexString(stage01Color))
    /////////////////////
    //STAGE COLOR
    //stage01Container.color = Color4.FromHexString('#66fa39')
    //log('color'+stage01Container.color)

    //
    if(l1_l2Balance!=undefined){
        manaBalanceTxt.value = '(L1) Mana Balance: ' + l1_l2Balance.l1.toFixed(2)
        maticBalanceTxt.value ='(L2) Matic/Mana Balance: ' +l1_l2Balance.l2.toFixed(2)
    }

    let knockoutNumber:number

    if (playersRacing == 0) {

      startTextMsg.value = 'Players waiting: '+ playersInGate
      
    }

    if (playersRacing > 0) {

      startTextMsg.value = 'Players Racing: '+ playersRacing
  
    }

    let s1_2b_elim =  (knockoutNumber - stage1EliminationNumber)
    stage01Msg.value = 'Stage 1: '+stage2Arr.length +' / '+stage1EliminationNumber
    
    
//todo add already eliminated and pass var for correct elimn numbers in subsequent stages

    let s2_2b_elim =  (stage1EliminationNumber - stage2EliminationNumber) 
    stage02Msg.value = 'Stage 2: '+stage3Arr.length+' / '+stage2EliminationNumber
  
    
    let s3_2b_elim =  (stage2EliminationNumber - stage3EliminationNumber) 
    stage03Msg.value = 'Stage 3: '+stage4Arr.length+' / '+stage3EliminationNumber
  
    
    let s4_2b_elim =  (stage3EliminationNumber - stage4EliminationNumber) 
    stage04Msg.value = 'Stage 4: '+stage5Arr.length+' / '+stage4EliminationNumber
 
    
    let s5_2b_elim =  (stage4EliminationNumber - stage5EliminationNumber) 
    stage05Msg.value = 'Stage 5: '+stage6Arr.length+' / '+stage5EliminationNumber
  
    
    stage06Msg.value = 'Stage 6: '+finishArr.length+' / 2'
  
    
  }
}

engine.addSystem(new LoopSystem())

