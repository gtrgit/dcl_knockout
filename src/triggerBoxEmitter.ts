import utils from "../node_modules/decentraland-ecs-utils/index"
import { ToggleState } from "../node_modules/decentraland-ecs-utils/toggle/toggleComponent"
import { TriggerBoxShape } from "../node_modules/decentraland-ecs-utils/triggers/triggerSystem"
import { movePlayerTo } from '@decentraland/RestrictedActions'
import * as matic from '../node_modules/@dcl/l2-utils/matic/index'

const sceneMessageBus = new MessageBus()

export class TriggeredPlatform extends Entity {
  

  constructor(
    model: GLTFShape,
    transform: Transform,
    triggerShape: TriggerBoxShape,
    name: any,
    identifier:String,
    polyGraphWallet = '0xC156C57182AE48CF32933A581D5Bed9A457e32cD',
    manaPrice = 5
    ) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(transform)

    // Create trigger for entity
    this.addComponent(
      new utils.TriggerComponent(
        triggerShape, null, null, null, null,
        () => { 
          //Enter Trigger
          if (identifier=='enterRaceFree'){
            movePlayerTo({ x: 3, y: 0, z: 23 })
            sceneMessageBus.emit('enterRaceFree', { stageXTrigger: name})
          }
          if (identifier=='spectator'){
            movePlayerTo({ x: 11, y: 28, z: 36.7 })
            
            //sceneMessageBus.emit('spectator', { stageXTrigger: name})
          }
          if (identifier=='finish'){
            sceneMessageBus.emit('finish', { stageXTrigger: name})
          }
        },
        () => { 
          //Exit Trigger
          if (identifier=='enterRace'){
            sceneMessageBus.emit('enterRace', { stageXTrigger: name})
          }
          if (identifier=='start'){
            sceneMessageBus.emit('start', { stageXTrigger: name})
          }
          if (identifier=='stage1'){
            sceneMessageBus.emit('stage1', { stageXTrigger: name})
          }
          if (identifier=='stage2'){
            sceneMessageBus.emit('stage2', { stageXTrigger: name})
          }
          if (identifier=='stage3'){
            sceneMessageBus.emit('stage3', { stageXTrigger: name})
          }
          if (identifier=='stage4'){
            sceneMessageBus.emit('stage4', { stageXTrigger: name})
          }
          if (identifier=='stage5'){
            sceneMessageBus.emit('stage5', { stageXTrigger: name})
          }
          if (identifier=='stage6'){
            sceneMessageBus.emit('stage6', { stageXTrigger: name})
          }
          
        }
      )
    )

    /*
    this.addComponent(
      sceneMessageBus.on('trigger', (e) => {
        log(' ---- '+e.stageXTrigger)
      })
    )
    */
      
    /*
    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, (value: ToggleState) => {
        // Move the platform to the end position once the player steps onto the platform
        if (value == utils.ToggleState.On) {
          this.addComponentOrReplace(new utils.MoveTransformComponent(new Vector3(14, 4, 12), new Vector3(14, 4, 4), 3))
        } else {
          // Move the platform to the start position once the player falls off or leaves the platform
          this.addComponentOrReplace(new utils.MoveTransformComponent(this.getComponent(Transform).position, new Vector3(14, 4, 12), 1.5))
        }
      })
    )
    */

  }
}
