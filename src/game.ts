import { PathedPlatform } from "./pathedPlatform"
//
const course = new GLTFShape("models/course01/course01.glb")
const platform = new GLTFShape("models/platform01/platform01.glb")
const knocker = new GLTFShape("models/platform01/knocker01.glb")
//
//
//
// Static platform course01

const course01 = new Entity()
course01.addComponent(course)
course01.addComponent(new Transform({position: new Vector3(16,0,16)}))
engine.addEntity(course01)

//platform01
const staticPlatform = new Entity()
staticPlatform.addComponent(platform)
staticPlatform.addComponent(new Transform({position: new Vector3(18,1,19),scale: new Vector3(1,.5,1)}))
engine.addEntity(staticPlatform)

let path = [new Vector3(0, -1, 1.5), new Vector3(0, 1, 1.5), new Vector3(0, 1, -1.5), new Vector3(0, -1, -1.5)]
const knocker01 = new PathedPlatform(knocker, path,2)
knocker01.setParent(staticPlatform)

const platform02 = new Entity()
platform02.addComponent(platform)
platform02.addComponent(new Transform({position: new Vector3(18,1.7,26),scale: new Vector3(1,.5,1)}))
engine.addEntity(platform02)

const knocker02 = new PathedPlatform(knocker, path,2)
knocker02.setParent(platform02)

const platform03 = new Entity()
platform03.addComponent(platform)
platform03.addComponent(new Transform({position: new Vector3(18,2,32),scale: new Vector3(1,.5,1.5)}))
engine.addEntity(platform03)

const knocker03 = new PathedPlatform(knocker, path,2)
knocker03.setParent(platform03)

const platform04 = new Entity()
platform04.addComponent(platform)
platform04.addComponent(new Transform({position: new Vector3(18,2,40),scale: new Vector3(2,.5,2)}))
engine.addEntity(platform04)

const knocker04 = new PathedPlatform(knocker, path,2)
knocker04.setParent(platform04)

const platform05 = new Entity()
platform05.addComponent(platform)
platform05.addComponent(new Transform({position: new Vector3(30,4,40),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
engine.addEntity(platform05)

const knocker05 = new PathedPlatform(knocker, path,2)
knocker05.setParent(platform05)

const platform06 = new Entity()
platform06.addComponent(platform)
platform06.addComponent(new Transform({position: new Vector3(30,5a,30),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
engine.addEntity(platform06)

const knocker06 = new PathedPlatform(knocker, path,2)
knocker06.setParent(platform06)

const platform07 = new Entity()
platform07.addComponent(platform)
platform07.addComponent(new Transform({position: new Vector3(30,5,24),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
engine.addEntity(platform07)

const knocker07 = new PathedPlatform(knocker, path,2)
knocker07.setParent(platform07)