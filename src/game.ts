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
import { LockConstraint } from "cannon"
import { Delay } from "../node_modules/decentraland-ecs-utils/timer/component/delay"

///////////////
//Variables
let testWallet = '0xC156C57182AE48CF32933A581D5Bed9A457e32cD'
let currentPlayerName:string
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





// identifier is passed to the triggerBoxEmitter class to send the player names to different stageArrays
let identifier:string
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
const trigBox = new TriggerBoxShape(new Vector3(4,1.5,1.5), new Vector3(0,1,0))  //size, position
//
//Stage 1 trigger area
const postStartGateTrigger = new TriggeredPlatform(
  resources.stadium.stage_gate, 
  new Transform({
    position: new Vector3(3,.1,2),
    scale: new Vector3(.5, .5, .2),
    rotation: Quaternion.Euler(180, 0, 0),
  }),
  trigBox,
  userData,
  identifier = 'start'
)
//
//Stage 1 trigger area
const stage1GateTrigger = new TriggeredPlatform(
  resources.stadium.stage_gate, 
  new Transform({
    position: new Vector3(3,.1,4),
    scale: new Vector3(.5, .5, .2),
    rotation: Quaternion.Euler(180, 0, 0),
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
    position: new Vector3(3,.1,6),
    scale: new Vector3(.5, .5, .2),
    rotation: Quaternion.Euler(180, 0, 0),
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
    position: new Vector3(3,.1,8),
    scale: new Vector3(.5, .5, .2),
    rotation: Quaternion.Euler(180, 0, 0),
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
    position: new Vector3(3,.1,10),
    scale: new Vector3(.5, .5, .2),
    rotation: Quaternion.Euler(180, 0, 0),
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
    position: new Vector3(3,.1,12),
    scale: new Vector3(.5, .5, .2),
    rotation: Quaternion.Euler(180, 0, 0),
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
    position: new Vector3(3,.1,14),
    scale: new Vector3(.5, .5, .2),
    rotation: Quaternion.Euler(180, 0, 0),
  }),
  trigBox,
  userData,
  identifier = 'stage6'
)

//
//finishLineTrigger 
const finishLineTrigger = new TriggeredPlatform(
  resources.stadium.stage_gate, 
  new Transform({
    position: new Vector3(6,4,14),
    scale: new Vector3(.2, .2, .2),
    rotation: Quaternion.Euler(180, 0, 0),
  }),
  trigBox,
  userData,
  identifier = 'finish'
)

/////////////////////////////////////////////////////////////
//Stage gate barriers
//
//stage 1 barrier
/*
let stage_gate_barrier_01 = new Entity()
stage_gate_barrier_01.addComponent(resources.stadium.stage_gate_barrier)
stage_gate_barrier_01.addComponent(new Transform({position: new Vector3(0,-3,0)}))
stage_gate_barrier_01.getComponent(GLTFShape).visible = false
stage_gate_barrier_01.getComponent(GLTFShape).withCollisions = false
stage_gate_barrier_01.getComponent(GLTFShape).isPointerBlocker = false
stage_gate_barrier_01.setParent(stage1GateTrigger)

//stage 1 barrier
let stage_gate_barrier_02 = new Entity()
stage_gate_barrier_02.addComponent(resources.stadium.stage_gate_barrier)
stage_gate_barrier_02.addComponent(new Transform({position: new Vector3(0,-3,0)}))
stage_gate_barrier_02.getComponent(GLTFShape).visible = false
stage_gate_barrier_02.setParent(stage2GateTrigger)
*/

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

//if the trigger count > elimination fromula move players still in the stage1 array to spectator stand

//TODO if players are still in the starting gate when the elimination is triggered the door will shut 
//and they can wait for the next race.

//IMPORTANT the 'start' Trigger is directly outside the 'staring gates' so that the subsequent gates elimination calculations
//do not include players who start but do not leave the gates for this race. 
//listen for 'start' msg
sceneMessageBus.on('start', (e) => {
  let nameIndex = startGateArr.indexOf(e.stageXTrigger.result)
  stage1Arr.push(startGateArr[nameIndex])
  
  // remove the player from previous stage array
  startGateArr.splice(nameIndex,1)


  log('(starting gate: '+startGateArr.length+')->(stage 1: '+stage1Arr.length+')')

  //The elimination counts appear on the 
  if (stage1Arr.length > 0) {
  stage1EliminationNumber = Math.round(stage1Arr.length-(stage1Arr.length*.2))
  stage2EliminationNumber = Math.round(stage1EliminationNumber-(stage1EliminationNumber*.2))
  stage3EliminationNumber = Math.round(stage2EliminationNumber-(stage2EliminationNumber*.2))
  stage4EliminationNumber = Math.round(stage3EliminationNumber-(stage3EliminationNumber*.2))
  stage5EliminationNumber = Math.round(stage4EliminationNumber-(stage4EliminationNumber*.2))
  stage6EliminationNumber =  Math.round(stage5EliminationNumber-(stage5EliminationNumber*.2))
   } 

    if (stage1Arr.length > 0) {

    //eliminateFromRace(startGateArr)
    }

})

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//TRIGGER BROADCASTS:
// STAGE 1 complete
sceneMessageBus.on('stage1', (e) => {

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

    log('(s4: '+stage4Arr.length+')->(s5: '+stage5Arr.length+')->(s6: '+stage6Arr.length+')')
      
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

  if (stage6Arr.length == stage6EliminationNumber) {

    log('(s4: '+stage4Arr.length+')->(s5: '+stage5Arr.length+')->(s6: '+stage6Arr.length+')')
      
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
  if (currentPlayerName == e.stageXTrigger.result) {
    //Display Winning Message
    
    //get eth address and transferr nft if eligible
    //sent to -> playerEthAdr
    log('You are the Winner!!')
    

  }
})
//TODO create a WINNER event + trigger

//
function eliminateFromRace(stageArray: any[]){

      stageArray.forEach(function (value){
        log('in startArr: '+value)

        if (currentPlayerName == value) {
          log('match Currrent Player:  '+value)
          movePlayerTo(new Vector3(0,20,0),new Vector3(4,3,4))
        }
      })
    }


    const listLog = spawnCube(4, 2.5, 1)
    listLog.addComponent(new OnPointerDown((e) => {

      stage1Arr.forEach(function (value){
        log('stage1 test '+value)
        if (currentPlayerName == value) {
        
        }
      })
    }

  ))


  
const nameBox = spawnCube(2, 2.5, 1)
nameBox.addComponent(new OnPointerDown((e) => {
 
    }
  ))


const cube2 = spawnCube(6, 2.5, 4)

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//MATIC

//Get Player Balance
let l1_l2Balance:any
executeTask(async () => {await await matic.balance(playerEthAdr).then((value)=> {l1_l2Balance = value})})

log('balance '+l1_l2Balance)
const sendGtr2HB = new Entity()
                sendGtr2HB.addComponent(new TextShape("send Gtr 2 HB"))
                sendGtr2HB.addComponent(new Transform({
                  position: new Vector3(0, 1, 0),
                  rotation: Quaternion.Euler(0,0,0), 
                  scale: new Vector3(.2, .2 , .2)
                }))
                sendGtr2HB.getComponent(TextShape).color = Color3.Red()
                sendGtr2HB.getComponent(TextShape).shadowColor = Color3.Gray()
                sendGtr2HB.getComponent(TextShape).shadowOffsetY = 1
                sendGtr2HB.getComponent(TextShape).shadowOffsetX = -1
                sendGtr2HB.getComponent(TextShape).isPickable = true
                sendGtr2HB.getComponent(TextShape).billboard = false
                sendGtr2HB.setParent(cube2)


cube2.addComponent(new OnPointerDown(async e => {
try {
      await matic.sendMana(testWallet,1,true,'mainnet')
      movePlayerTo({ x: 3, y: 0, z: 19 })
      //broadcast that payment has been made
    //  sceneMessageBus.emit("spawn", {greet: 'test'})

      } catch (error) {
        log(error.toString());
    }
   }
))



const HBcube = spawnCube(8, 2.5, 8)

const hbBal = new Entity()
                hbBal.addComponent(new TextShape("HB Balance"))
                hbBal.addComponent(new Transform({
                  position: new Vector3(0, 1, 0),
                  rotation: Quaternion.Euler(0,0,0), 
                  scale: new Vector3(.5, .5 , .5)
                }))
                hbBal.getComponent(TextShape).color = Color3.Red()
                hbBal.getComponent(TextShape).shadowColor = Color3.Gray()
                hbBal.getComponent(TextShape).shadowOffsetY = 1
                hbBal.getComponent(TextShape).shadowOffsetX = -1
                hbBal.getComponent(TextShape).isPickable = true
                hbBal.getComponent(TextShape).billboard = false
                hbBal.setParent(HBcube)



HBcube.addComponent(new OnPointerDown(async e => {
	const balance = await matic.balance(playerEthAdr)
  log('bal:',balance)
  
})
)



//
// Static assets

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
c2_marker.addComponent(new Transform({position: new Vector3(78.5,12.5,31.5),rotation: Quaternion.Euler(0,180,0)}))
engine.addEntity(c2_marker)


const c3_marker = new Entity()
c3_marker.addComponent(resources.stadium.course_marker)
c3_marker.addComponent(new Transform({position: new Vector3(63,12.5,31.5),rotation: Quaternion.Euler(0,180,0)}))
engine.addEntity(c3_marker)

const c4_marker = new Entity()
c4_marker.addComponent(resources.stadium.course_marker)
c4_marker.addComponent(new Transform({position: new Vector3(45,12.5,31.5),rotation: Quaternion.Euler(0,180,0)}))
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
  new Vector3(9,11.9,20.5),
  new Vector3(6,11.9,20.5),
  3
)

const l_move = new MovingPlatform(
  resources.stadium.sign_l,
  new Vector3(9,11.9,20.5),
  new Vector3(7,11.9,20.5),
  3
)

const n_move = new MovingPlatform(
  resources.stadium.sign_n,
  new Vector3(9.1,11.9,20.5),
  new Vector3(6,11.9,20.5),
  3
)

const c_move = new MovingPlatform(
  resources.stadium.sign_c_lower,
  new Vector3(11,11.9,20.5),
  new Vector3(5,11.9,20.5),
  3
)

const o2_move = new MovingPlatform(
  resources.stadium.sign_o2,
  new Vector3(9.1,11.9,20.5),
  new Vector3(6,11.9,20.5),
  3
)

const t_move = new MovingPlatform(
  resources.stadium.sign_t,
  new Vector3(11,11.9,20.5),
  new Vector3(5,11.9,20.5),
  3
)

const finish_move = new MovingPlatform(
  resources.stadium.finish_plat,
  new Vector3(2.5,4.5,35),
  new Vector3(2.5,4.5,33),
  3
)

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
platform02.addComponent(new Transform({position: new Vector3(3,1.7,10),scale: new Vector3(1,.5,1)}))
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
platform04.addComponent(new Transform({position: new Vector3(3,2,26),scale: new Vector3(2,.5,2.5)}))
platform04.setParent(c1_marker)
engine.addEntity(platform04)

const knocker04 = new PathedPlatform(resources.course01.knocker, path,2)
knocker04.setParent(platform04)

const platform05 = new Entity()
platform05.addComponent(resources.course01.platform)
platform05.addComponent(new Transform({position: new Vector3(12,4,17),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
platform05.setParent(c1_marker)
engine.addEntity(platform05)

const knocker05 = new PathedPlatform(resources.course01.knocker, path,2)
knocker05.setParent(platform05)

const platform06 = new Entity()
platform06.addComponent(resources.course01.platform)
platform06.addComponent(new Transform({position: new Vector3(12,5,25),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
platform06.setParent(c1_marker)
engine.addEntity(platform06)

const knocker06 = new PathedPlatform(resources.course01.knocker, path,2)
knocker06.setParent(platform06)

const platform07 = new Entity()
platform07.addComponent(resources.course01.platform)
platform07.addComponent(new Transform({position: new Vector3(12,5,12),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
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



//////////////////////////////////////////////////////////
//UI

const progressCanvas = new UICanvas()

const progressContainer = new UIContainerRect(progressCanvas)
progressContainer.adaptWidth = true
progressContainer.width = '10%'
progressContainer.height = '43%'
progressContainer.positionY = 70
progressContainer.positionX = -10
progressContainer.color = Color4.Black()
progressContainer.hAlign = 'right'
progressContainer.vAlign = 'center'
progressContainer.opacity = 0.8
    

const progressBackground = new UIContainerRect(progressContainer)
progressBackground.adaptWidth = true
progressBackground.width = '90%'
progressBackground.height = '85%'
progressBackground.positionX = 0
progressBackground.positionY = -10
progressBackground.color = Color4.Black()
progressBackground.hAlign = 'center'
progressBackground.opacity = 0.7

const title = new UIText(progressContainer)
title.fontSize = 13
title.value = 'DCL Knockout'
title.hAlign = 'center'
title.vAlign = 'top'
title.positionY = 26
title.positionX = 0
    

const start = new UIContainerRect(progressBackground)
start.adaptWidth = true
start.width = '100%'
start.height = '12%'
//start.positionX = 2
start.color = Color4.Purple()
start.hAlign = 'center'
start.vAlign = 'bottom'
start.opacity = 1
start.positionY = 0


// Create a textShape component, setting the progressCanvas as parent
const startTextMsg = new UIText(start)
startTextMsg.value = 'Players in Race: '+playersInGate
startTextMsg.fontSize = 10
startTextMsg.hAlign = 'center'
startTextMsg.vAlign = 'center'
startTextMsg.color = Color4.White()
startTextMsg.positionY = 18
startTextMsg.positionX = 0

//////////////////////////////
//STAGE 1
const stage01 = new UIContainerRect(progressBackground)
stage01.adaptWidth = true
stage01.width = '100%'
stage01.height = '12%'
stage01.color = Color4.Black()
stage01.hAlign = 'center'
stage01.vAlign = 'bottom'
stage01.opacity = 0.8
stage01.positionY = 32


const stage01Msg = new UIText(stage01)
stage01Msg.value = 'Stage 1: '+playersInGate
stage01Msg.fontSize = 13
stage01Msg.hAlign = 'center'
stage01Msg.vAlign = 'center'
stage01Msg.color = Color4.White()
stage01Msg.positionY = 23
stage01Msg.positionX = 0

const s1Elimination = new UIText(stage01)
s1Elimination.value = 'To be eliminated:'+playersInGate
s1Elimination.fontSize = 10
s1Elimination.hAlign = 'center'
s1Elimination.vAlign = 'center'
s1Elimination.color = Color4.White()
s1Elimination.positionY = 12
s1Elimination.positionX = 0

//////////////////////////////
//STAGE 2
const stage02 = new UIContainerRect(progressBackground)
stage02.adaptWidth = true
stage02.width = '100%'
stage02.height = '12%'
stage02.color = Color4.Black()
stage02.hAlign = 'center'
stage02.vAlign = 'bottom'
stage02.opacity = 0.8
stage02.positionY = 63

const stage02Msg = new UIText(stage02)
stage02Msg.value = 'Stage 2: '+playersInGate
stage02Msg.fontSize = 13
stage02Msg.hAlign = 'center'
stage02Msg.vAlign = 'center'
stage02Msg.color = Color4.White()
stage02Msg.positionY = 23
stage02Msg.positionX = 0

const s2Elimination = new UIText(stage02)
s2Elimination.value = 'To be eliminated:'+playersInGate
s2Elimination.fontSize = 10
s2Elimination.hAlign = 'center'
s2Elimination.vAlign = 'center'
s2Elimination.color = Color4.White()
s2Elimination.positionY = 12
s2Elimination.positionX = 0

//////////////////////////////
//STAGE 3
const stage03 = new UIContainerRect(progressBackground)
stage03.adaptWidth = true
stage03.width = '100%'
stage03.height = '12%'
stage03.color = Color4.Black()
stage03.hAlign = 'center'
stage03.vAlign = 'bottom'
stage03.opacity = 0.8
stage03.positionY = 93

const stage03Msg = new UIText(stage03)
stage03Msg.value = 'Stage 3: '+playersInGate
stage03Msg.fontSize = 13
stage03Msg.hAlign = 'center'
stage03Msg.vAlign = 'center'
stage03Msg.color = Color4.White()
stage03Msg.positionY = 23
stage03Msg.positionX = 0

const s3Elimination = new UIText(stage03)
s3Elimination.value = 'To be eliminated:'+playersInGate
s3Elimination.fontSize = 10
s3Elimination.hAlign = 'center'
s3Elimination.vAlign = 'center'
s3Elimination.color = Color4.White()
s3Elimination.positionY = 12
s3Elimination.positionX = 0

//////////////////////////////
//STAGE 4
const stage04 = new UIContainerRect(progressBackground)
stage04.adaptWidth = true
stage04.width = '100%'
stage04.height = '12%'
stage04.color = Color4.Black()
stage04.hAlign = 'center'
stage04.vAlign = 'bottom'
stage04.opacity = 0.8
stage04.positionY = 123

const stage04Msg = new UIText(stage04)
stage04Msg.value = 'Stage 4: '+playersInGate
stage04Msg.fontSize = 13
stage04Msg.hAlign = 'center'
stage04Msg.vAlign = 'center'
stage04Msg.color = Color4.White()
stage04Msg.positionY = 23
stage04Msg.positionX = 0

const s4Elimination = new UIText(stage04)
s4Elimination.value = 'To be eliminated:'+playersInGate
s4Elimination.fontSize = 10
s4Elimination.hAlign = 'center'
s4Elimination.vAlign = 'center'
s4Elimination.color = Color4.White()
s4Elimination.positionY = 12
s4Elimination.positionX = 0

//////////////////////////////
//STAGE 5
const stage05 = new UIContainerRect(progressBackground)
stage05.adaptWidth = true
stage05.width = '100%'
stage05.height = '12%'
stage05.color = Color4.Black()
stage05.hAlign = 'center'
stage05.vAlign = 'bottom'
stage05.opacity = 0.8
stage05.positionY = 153

const stage05Msg = new UIText(stage05)
stage05Msg.value = 'Stage 5: '+playersInGate
stage05Msg.fontSize = 13
stage05Msg.hAlign = 'center'
stage05Msg.vAlign = 'center'
stage05Msg.color = Color4.White()
stage05Msg.positionY = 23
stage05Msg.positionX = 0

const s5Elimination = new UIText(stage05)
s5Elimination.value = 'To be eliminated:'+playersInGate
s5Elimination.fontSize = 10
s5Elimination.hAlign = 'center'
s5Elimination.vAlign = 'center'
s5Elimination.color = Color4.White()
s5Elimination.positionY = 12
s5Elimination.positionX = 0

//////////////////////////////
//STAGE 6
const stage06 = new UIContainerRect(progressBackground)
stage06.adaptWidth = true
stage06.width = '100%'
stage06.height = '12%'
stage06.color = Color4.Black()
stage06.hAlign = 'center'
stage06.vAlign = 'bottom'
stage06.opacity = 0.8
stage06.positionY = 183

const stage06Msg = new UIText(stage06)
stage06Msg.value = 'Stage 6: '+playersInGate
stage06Msg.fontSize = 13
stage06Msg.hAlign = 'center'
stage06Msg.vAlign = 'center'
stage06Msg.color = Color4.White()
stage06Msg.positionY = 23
stage06Msg.positionX = 0

const s6Elimination = new UIText(stage06)
s6Elimination.value = 'To be eliminated:'+playersInGate
s6Elimination.fontSize = 10
s6Elimination.hAlign = 'center'
s6Elimination.vAlign = 'center'
s6Elimination.color = Color4.White()
s6Elimination.positionY = 12
s6Elimination.positionX = 0


const end = new UIContainerRect(progressBackground)
end.adaptWidth = true
end.width = '100%'
end.height = '10%'
//end.positionX = 2
end.color = Color4.Purple()
end.hAlign = 'center'
end.vAlign = 'top'
end.opacity = 1
//sprogressa.positionY = 42

const endText = new UIText(end)
endText.value = 'Finish'
endText.fontSize = 15
endText.hAlign = 'center'
endText.vAlign = 'center'
endText.color = Color4.White()
endText.positionY = 16
endText.positionX = 25

//////////////////////////////////////////////////////
//gameMenu
const gameMenuContainer = new UICanvas()

const gameMenu = new UIContainerRect(gameMenuContainer)
gameMenu.adaptWidth = true
gameMenu.width = '15%'
gameMenu.height = '17%'
gameMenu.positionY = 140
gameMenu.positionX = -4
gameMenu.color = Color4.Black()
gameMenu.hAlign = 'right'
gameMenu.vAlign = 'bottom'
gameMenu.opacity = 0.9

const joinButtonUp = new UIImage(gameMenu, resources.textureImages.gameUI)
joinButtonUp.name = "clickable-image"
joinButtonUp.width = "80"
joinButtonUp.height = "30"
joinButtonUp.sourceWidth = 236
joinButtonUp.sourceHeight = 140
joinButtonUp.isPointerBlocker = true
joinButtonUp.hAlign = 'left'
joinButtonUp.vAlign = 'bottom'
joinButtonUp.positionY = 5
joinButtonUp.positionX = 5
joinButtonUp.sourceLeft = 1
joinButtonUp.sourceTop = 70
joinButtonUp.sourceWidth = 104
joinButtonUp.sourceHeight = 37
joinButtonUp.onClick = new OnClick(() => {
  // DO SOMETHING
  log('click')
})

const exitButtonUp = new UIImage(gameMenu, resources.textureImages.gameUI)
exitButtonUp.name = "clickable-image2"
exitButtonUp.width = "80"
exitButtonUp.height = "30"
exitButtonUp.sourceWidth = 236
exitButtonUp.sourceHeight = 140
exitButtonUp.isPointerBlocker = true
exitButtonUp.hAlign = 'right'
exitButtonUp.vAlign = 'bottom'
exitButtonUp.positionY = 4
exitButtonUp.positionX = -32
exitButtonUp.sourceLeft = 105
exitButtonUp.sourceTop = 71
exitButtonUp.sourceWidth = 95
exitButtonUp.sourceHeight = 36
exitButtonUp.onClick = new OnClick(() => {
  // DO SOMETHING
  log('click')
})
    

const faqButtonUp = new UIImage(gameMenu, resources.textureImages.gameUI)
faqButtonUp.name = "clickable-image2"
faqButtonUp.width = "28"
faqButtonUp.height = "30"
faqButtonUp.sourceWidth = 236
faqButtonUp.sourceHeight = 140
faqButtonUp.isPointerBlocker = true
faqButtonUp.hAlign = 'right'
faqButtonUp.vAlign = 'bottom'
faqButtonUp.positionY = 4
faqButtonUp.positionX = -4
faqButtonUp.sourceLeft = 200
faqButtonUp.sourceTop = 71
faqButtonUp.sourceWidth = 36
faqButtonUp.sourceHeight = 36
faqButtonUp.onClick = new OnClick(() => {
  // DO SOMETHING
  log('click')
})
    

///////////////////////////////////////////
const medalsContainer = new UIContainerRect(gameMenu)
medalsContainer.adaptWidth = true
medalsContainer.width = '95%'
medalsContainer.height = '12%'
medalsContainer.color = Color4.Purple()
medalsContainer.hAlign = 'center'
medalsContainer.vAlign = 'top'
medalsContainer.opacity = 1
medalsContainer.positionY = -5
medalsContainer.positionX = 0

const gameMenuHeader = new UIText(medalsContainer)
gameMenuHeader.fontSize = 8
gameMenuHeader.value = 'Medals: '
gameMenuHeader.hAlign = 'left'
gameMenuHeader.vAlign = 'center'
gameMenuHeader.color = Color4.White()
gameMenuHeader.positionY = 20
gameMenuHeader.positionX = 4



const goldMedalsContainer = new UIContainerRect(medalsContainer)
goldMedalsContainer.adaptWidth = true
goldMedalsContainer.width = '20%'
goldMedalsContainer.height = '75%'
goldMedalsContainer.color = Color4.FromHexString('#F7C644FF')
goldMedalsContainer.hAlign = 'center'
goldMedalsContainer.vAlign = 'center'
goldMedalsContainer.opacity = 1
goldMedalsContainer.positionY = 0
goldMedalsContainer.positionX = -19


const goldMedalsHeader = new UIText(goldMedalsContainer)
goldMedalsHeader.fontSize = 8
goldMedalsHeader.value = 'Gold: 00 '
goldMedalsHeader.hAlign = 'center'
goldMedalsHeader.vAlign = 'center'
goldMedalsHeader.color = Color4.Black()
goldMedalsHeader.positionY = 20
goldMedalsHeader.positionX = 2



const silverMedalsContainer = new UIContainerRect(medalsContainer)
silverMedalsContainer.adaptWidth = true
silverMedalsContainer.width = '22%'
silverMedalsContainer.height = '75%'
silverMedalsContainer.color = Color4.FromHexString('#9EC6C6FF')
silverMedalsContainer.hAlign = 'center'
silverMedalsContainer.vAlign = 'center'
silverMedalsContainer.opacity = 1
silverMedalsContainer.positionY = 0
silverMedalsContainer.positionX = 22


const silverMedalsHeader = new UIText(silverMedalsContainer)
silverMedalsHeader.fontSize = 8
silverMedalsHeader.value = 'Silver: 00'
silverMedalsHeader.hAlign = 'center'
silverMedalsHeader.vAlign = 'center'
silverMedalsHeader.color = Color4.Black()
silverMedalsHeader.positionY = 20
silverMedalsHeader.positionX = 2



const bronzeMedalsContainer = new UIContainerRect(medalsContainer)
bronzeMedalsContainer.adaptWidth = true
bronzeMedalsContainer.width = '25%'
bronzeMedalsContainer.height = '75%'
bronzeMedalsContainer.color = Color4.FromHexString('#F57D12FF')
bronzeMedalsContainer.hAlign = 'center'
bronzeMedalsContainer.vAlign = 'center'
bronzeMedalsContainer.opacity = 1
bronzeMedalsContainer.positionY = 0
bronzeMedalsContainer.positionX = 68


const bronzeMedalsHeader = new UIText(bronzeMedalsContainer)
bronzeMedalsHeader.fontSize = 8
bronzeMedalsHeader.value = 'Bronze: 00'
bronzeMedalsHeader.hAlign = 'center'
bronzeMedalsHeader.vAlign = 'center'
bronzeMedalsHeader.color = Color4.Black()
bronzeMedalsHeader.positionY = 20
bronzeMedalsHeader.positionX = 2



/////////////////////////////////////////
//
const tierContainer = new UIContainerRect(gameMenu)
tierContainer.adaptWidth = true
tierContainer.width = '95%'
tierContainer.height = '12%'
tierContainer.color = Color4.Blue()
tierContainer.hAlign = 'center'
tierContainer.vAlign = 'top'
tierContainer.opacity = 1
tierContainer.positionY = -20
tierContainer.positionX = 0

const tierHeader = new UIText(tierContainer)
tierHeader.fontSize = 8
tierHeader.value = 'Race Tier: '
tierHeader.hAlign = 'left'
tierHeader.vAlign = 'center'
tierHeader.positionY = 20
tierHeader.positionX = 4



const goldTierContainer = new UIContainerRect(tierContainer)
goldTierContainer.adaptWidth = true
goldTierContainer.width = '20%'
goldTierContainer.height = '80%'
goldTierContainer.color = Color4.FromHexString('#F7C644FF')
goldTierContainer.hAlign = 'center'
goldTierContainer.vAlign = 'center'
goldTierContainer.opacity = goldRaceTierOpacity
goldTierContainer.positionY = 0
goldTierContainer.positionX = -20


const goldTierHeader = new UIText(goldTierContainer)
goldTierHeader.fontSize = 8
goldTierHeader.value = 'Gold'
goldTierHeader.hAlign = 'center'
goldTierHeader.vAlign = 'center'
goldTierHeader.color = Color4.Black()
goldTierHeader.positionY = 20
goldTierHeader.positionX = 10


const silverTierContainer = new UIContainerRect(tierContainer)
silverTierContainer.adaptWidth = true
silverTierContainer.width = '22%'
silverTierContainer.height = '80%'
silverTierContainer.color = Color4.FromHexString('#9EC6C6FF')
silverTierContainer.hAlign = 'center'
silverTierContainer.vAlign = 'center'
silverTierContainer.opacity = silverRaceTierOpacity
silverTierContainer.positionY = 0
silverTierContainer.positionX = 22


const silverTierHeader = new UIText(silverTierContainer)
silverTierHeader.fontSize = 8
silverTierHeader.value = 'Silver '
silverTierHeader.hAlign = 'center'
silverTierHeader.vAlign = 'center'
silverTierHeader.color = Color4.Black()
silverTierHeader.positionY = 20
silverTierHeader.positionX = 10



const bronzeTierContainer = new UIContainerRect(tierContainer)
bronzeTierContainer.adaptWidth = true
bronzeTierContainer.width = '25%'
bronzeTierContainer.height = '80%'
bronzeTierContainer.color = Color4.FromHexString('#F57D12FF')
bronzeTierContainer.hAlign = 'center'
bronzeTierContainer.vAlign = 'center'
bronzeTierContainer.opacity = bronzeRaceTierOpacity
bronzeTierContainer.positionY = 0
bronzeTierContainer.positionX = 68


const bronzeTierHeader = new UIText(bronzeTierContainer)
bronzeTierHeader.fontSize = 8
bronzeTierHeader.value = 'Bronze'
bronzeTierHeader.hAlign = 'center'
bronzeTierHeader.vAlign = 'center'
bronzeTierHeader.color = Color4.Black()
bronzeTierHeader.positionY = 20
bronzeTierHeader.positionX = 10


/////////////////////////////////////////
//
const balanceContainer = new UIContainerRect(gameMenu)
balanceContainer.adaptWidth = true
balanceContainer.width = '95%'
balanceContainer.height = '35%'
balanceContainer.color = Color4.Purple()
balanceContainer.hAlign = 'center'
balanceContainer.vAlign = 'top'
balanceContainer.opacity = 1
balanceContainer.positionY = -35
balanceContainer.positionX = 0

const balanceHeader = new UIText(balanceContainer)
balanceHeader.fontSize = 8
balanceHeader.value = 'Balance:'
balanceHeader.hAlign = 'left'
balanceHeader.vAlign = 'top'
balanceHeader.positionY = 40
balanceHeader.positionX = 6



const manaBalanceContainer = new UIContainerRect(balanceContainer)
manaBalanceContainer.adaptWidth = true
manaBalanceContainer.width = '35%'
manaBalanceContainer.height = '60%'
manaBalanceContainer.color = Color4.Blue()
manaBalanceContainer.hAlign = 'left'
manaBalanceContainer.vAlign = 'bottom'
manaBalanceContainer.opacity = 1
manaBalanceContainer.positionY = 5
manaBalanceContainer.positionX = 5

const manaBalanceHeader = new UIText(manaBalanceContainer)
manaBalanceHeader.fontSize = 8
manaBalanceHeader.value = 'MANA:'
manaBalanceHeader.hAlign = 'left'
manaBalanceHeader.vAlign = 'center'
manaBalanceHeader.positionY = 15
manaBalanceHeader.positionX = 4


const maticManaBalanceContainer = new UIContainerRect(balanceContainer)
maticManaBalanceContainer.adaptWidth = true
maticManaBalanceContainer.width = '35%'
maticManaBalanceContainer.height = '60%'
maticManaBalanceContainer.color = Color4.Blue()
maticManaBalanceContainer.hAlign = 'right'
maticManaBalanceContainer.vAlign = 'bottom'
maticManaBalanceContainer.opacity = 1
maticManaBalanceContainer.positionY = 5
maticManaBalanceContainer.positionX = -5


const maticManaBalanceHeader = new UIText(maticManaBalanceContainer)
maticManaBalanceHeader.fontSize = 8
maticManaBalanceHeader.value = 'Matic/MANA:'
maticManaBalanceHeader.hAlign = 'left'
maticManaBalanceHeader.vAlign = 'center'
maticManaBalanceHeader.positionY = 15
maticManaBalanceHeader.positionX = 4


const depositButtonUp = new UIImage(maticManaBalanceContainer, resources.textureImages.gameUI)
depositButtonUp.name = "clickable-image"
depositButtonUp.width = "44"
depositButtonUp.height = "24"
depositButtonUp.sourceWidth = 236
depositButtonUp.sourceHeight = 140
depositButtonUp.isPointerBlocker = true
depositButtonUp.hAlign = 'center'
depositButtonUp.vAlign = 'center'
depositButtonUp.positionY = -1
depositButtonUp.positionX = -55
depositButtonUp.sourceLeft = 92
depositButtonUp.sourceTop = 32
depositButtonUp.sourceWidth = 54
depositButtonUp.sourceHeight = 32
depositButtonUp.onClick = new OnClick(() => {
  // DO SOMETHING
  log('click')
  depositInputContainer.visible = true
  depositButtonUp.sourceTop = 0
})
    


const depositCanvas = new UICanvas()

const depositInputContainer = new UIContainerRect(depositCanvas)
depositInputContainer.adaptWidth = true
depositInputContainer.width = '35%'
depositInputContainer.height = '45%'
depositInputContainer.color = Color4.Blue()
depositInputContainer.hAlign = 'center'
depositInputContainer.vAlign = 'center'
depositInputContainer.visible = false
depositInputContainer.opacity = 1
depositInputContainer.positionY = 5
depositInputContainer.positionX = 5


const close = new UIImage(depositInputContainer, resources.textureImages.buttonBlue)
close.name = "clickable-image"
close.width = "12px"
close.height = "12px"
close.sourceWidth = 92
close.sourceHeight = 91
close.vAlign = "top"
close.hAlign = "right"
close.isPointerBlocker = true
close.onClick = new OnClick(() => {
  log("clicked on the close image")
  depositInputContainer.visible = false
  depositInputContainer.isPointerBlocker = false
  depositButtonUp.sourceTop = 32
})

const depositInput = new UIInputText(depositInputContainer)
depositInput.width = "80%"
depositInput.height = "10px"
depositInput.vAlign = "center"
depositInput.hAlign = "right"
depositInput.fontSize = 8
depositInput.placeholder = "000"
depositInput.placeholderColor = Color4.White()
depositInput.positionY = 0
depositInput.positionX = -10
depositInput.opacity = 1
depositInput.isPointerBlocker = true

depositInput.onTextSubmit = new OnTextSubmit((x) => {
  const text = new UIText(depositInput)
  text.value = x.text
  text.width = "100%"
  text.height = "20px"
  text.vAlign = "top"
  text.hAlign = "left"
})



/////////////////////////////////////////////
//

//Update the UI with the player qualification results
export class LoopSystem implements ISystem {
  update(){
    playersInGate = startGateArr.length
    playersRacing = stage1Arr.length
    manaBalanceHeader.value = 'Mana:\n' + l1_l2Balance.l1.toFixed(2)
    maticManaBalanceHeader.value = "Matic/Mana:\n" +l1_l2Balance.l2.toFixed(2)

    let knockoutNumber:number

    if (playersRacing == 0) {

      startTextMsg.value = 'Started racing: '+playersRacing+'\nPlayers in Gate: '+ playersInGate
      knockoutNumber = playersInGate
    }

    if (playersRacing > 0) {

      startTextMsg.value = 'Started racing: '+playersRacing+'\nPlayers in Gate: '+ playersInGate
      knockoutNumber = playersRacing
    }

    let s1_2b_elim =  (knockoutNumber - stage1EliminationNumber)
    stage01Msg.value = 'Stage 1: '+stage2Arr.length +' / '+stage1EliminationNumber
    s1Elimination.value = 'Knockout x '+ s1_2b_elim
    
//todo add already eliminated and pass var for correct elimn numbers in subsequent stages

    let s2_2b_elim =  (stage1EliminationNumber - stage2EliminationNumber) 
    stage02Msg.value = 'Stage 2: '+stage3Arr.length+' / '+stage2EliminationNumber
    s2Elimination.value = 'Knockout x '+ s2_2b_elim
    
    let s3_2b_elim =  (stage2EliminationNumber - stage3EliminationNumber) 
    stage03Msg.value = 'Stage 3: '+stage4Arr.length+' / '+stage3EliminationNumber
    s3Elimination.value = 'Knockout x '+ s3_2b_elim
    
    let s4_2b_elim =  (stage3EliminationNumber - stage4EliminationNumber) 
    stage04Msg.value = 'Stage 4: '+stage5Arr.length+' / '+stage4EliminationNumber
    s4Elimination.value = 'Knockout x '+ s4_2b_elim
    
    let s5_2b_elim =  (stage4EliminationNumber - stage5EliminationNumber) 
    stage05Msg.value = 'Stage 5: '+stage6Arr.length+' / '+stage5EliminationNumber
    s5Elimination.value = 'Knockout x '+ s5_2b_elim
    
    stage06Msg.value = 'Stage 6: '+stage6Arr.length
    s6Elimination.value = 'Race winner:  '+ raceWinner
    
  }
}

engine.addSystem(new LoopSystem())

