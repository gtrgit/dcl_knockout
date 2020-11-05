import { ScaleTransformComponent } from "../node_modules/decentraland-ecs-utils/transform/component/scale"

export const sceneMessageBus = new MessageBus()

//let playerArr:number[] 

// reusable stone class
export class Emitter extends Entity {
 
  constructor(
    shape: GLTFShape,
    transform: Transform,
    name: any
  ) {
    super()
    engine.addEntity(this)
    this.addComponent(shape)
    this.addComponent(transform)


    //let thisStone = this

    this.addComponent(
      new OnPointerDown(
        (e) => {
         //log(name)
            sceneMessageBus.emit('startGamePlayerName', { playerName: name })
        },
        {
          button: ActionButton.POINTER,
          hoverText: 'Enter a Race.',
        }
      )
    )

    
  }
}

/*
sceneMessageBus.on('testEmit', (e) => {
  log(e.stone.result)
  playerArr.push(e.stone.result)
  
  log('arr length'+playerArr.length)

})
*/
