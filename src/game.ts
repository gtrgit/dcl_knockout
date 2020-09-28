import { PathedPlatform } from "./pathedPlatform"
import { RotatingPlatform } from "./rotatingPlatform"
import { Sound } from "./sound"
import { Ring } from "./ring"

//structure
const floor = new GLTFShape("models/floor.glb")
const berm = new GLTFShape("models/berm.glb")


//course 01
const course01glb = new GLTFShape("models/course01/course01.glb")
const platform = new GLTFShape("models/platform01/platform01.glb")
const knocker = new GLTFShape("models/platform01/knocker01.glb")


//course 02
const course02glb = new GLTFShape("models/course02/course02.glb")
const whacker = new GLTFShape("models/course02/whacker.glb")

//course 03
const course03glb = new GLTFShape("models/course03/course03.glb")
const turbine = new GLTFShape("models/course03/turbine.glb")
const lilypad_centre = new GLTFShape("models/course03/lilyPad_center.glb")
const lilypad_inner = new GLTFShape("models/course03/lilypad_inner.glb")
const lilypad_outer = new GLTFShape("models/course03/lilyPad_outer.glb")


//course 04
const course04glb = new GLTFShape("models/course04/course04.glb")
const door_fake = new GLTFShape("models/course04/door_fake.glb")
const door = new GLTFShape("models/course04/door.glb")


//course 05
const course05glb = new GLTFShape("models/course05/course05.glb")
const rotating_platform = new GLTFShape("models/course05/rotating_platform.glb")
const rotating_platform_2x = new GLTFShape("models/course05/spiral.glb")


//
//
//
// Static assets

const floor3x7 = new Entity()
floor3x7.addComponent(floor)
floor3x7.addComponent(new Transform({position: new Vector3(0,-.02,0)}))
engine.addEntity(floor3x7)


const course01 = new Entity()
course01.addComponent(course01glb)
course01.addComponent(new Transform({position: new Vector3(16,16,16)}))
engine.addEntity(course01)


const course02 = new Entity()
course02.addComponent(course02glb)
course02.addComponent(new Transform({position: new Vector3(32,8,16)}))
engine.addEntity(course02)



const course03 = new Entity()
course03.addComponent(course03glb)
course03.addComponent(new Transform({position: new Vector3(48,8,16)}))
engine.addEntity(course03)

const course04 = new Entity()
course04.addComponent(course04glb)
course04.addComponent(new Transform({position: new Vector3(64,8,16)}))
engine.addEntity(course04)

const course05 = new Entity()
course05.addComponent(course05glb)
course05.addComponent(new Transform({position: new Vector3(80,8,16)}))
engine.addEntity(course05)


const roundaboutAShape = new GLTFShape("models/level01Course/roundaboutA.glb")

const roundaboutA1 = new RotatingPlatform(
  roundaboutAShape,
  new Transform({ position: new Vector3(40, 3, 33) }),
  Quaternion.Euler(0, 120, 0)
)


/*

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
platform04.addComponent(new Transform({position: new Vector3(17.5,2,40),scale: new Vector3(2,.5,2.5)}))
engine.addEntity(platform04)

const knocker04 = new PathedPlatform(knocker, path,2)
knocker04.setParent(platform04)

const platform05 = new Entity()
platform05.addComponent(platform)
platform05.addComponent(new Transform({position: new Vector3(29,4,40),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
engine.addEntity(platform05)

const knocker05 = new PathedPlatform(knocker, path,2)
knocker05.setParent(platform05)

const platform06 = new Entity()
platform06.addComponent(platform)
platform06.addComponent(new Transform({position: new Vector3(29,5,33),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
engine.addEntity(platform06)

const knocker06 = new PathedPlatform(knocker, path,2)
knocker06.setParent(platform06)

const platform07 = new Entity()
platform07.addComponent(platform)
platform07.addComponent(new Transform({position: new Vector3(30,5,24),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
engine.addEntity(platform07)

const knocker07 = new PathedPlatform(knocker, path,2)
knocker07.setParent(platform07)

//course02

const whacker01 = new RotatingPlatform(
  whacker,
  new Transform({ position: new Vector3(8, 3.2, 16) }),
  Quaternion.Euler(0, -120, 0)
)
whacker01.setParent(course02)

const whacker02 = new RotatingPlatform(
  whacker,
  new Transform({ position: new Vector3(8, 7, 16) }),
  Quaternion.Euler(0, -110, 0)
)
whacker02.setParent(course02)

const whacker03 = new RotatingPlatform(
  whacker,
  new Transform({ position: new Vector3(8, 11, 16) }),
  Quaternion.Euler(0, -120, 0)
)
 whacker03.setParent(course02)

//course 03


const turbine01 = new RotatingPlatform(
  turbine,
  new Transform({ position: new Vector3(12, 7, 17),rotation: Quaternion.Euler(90,0,0) }),
  Quaternion.Euler(0, -80, 0)
)
turbine01.setParent(course03)

const lp_group_01_centre = new RotatingPlatform(
  lilypad_centre,
  new Transform({ position: new Vector3(5, 1.5, 12),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -10, 0)
)
lp_group_01_centre.setParent(course03)

const lp_group_01_inner = new RotatingPlatform(
  lilypad_inner,
  new Transform({ position: new Vector3(0, 0, 0),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -10, 0)
)
lp_group_01_inner.setParent(lp_group_01_centre)

const lp_group_01_outer = new RotatingPlatform(
  lilypad_outer,
  new Transform({ position: new Vector3(0, 0, 0),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -10, 0)
)
lp_group_01_outer.setParent(lp_group_01_inner)



const lp_group_02_centre = new RotatingPlatform(
  lilypad_centre,
  new Transform({ position: new Vector3(5, 1.5, 18),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -7, 0)
)
lp_group_02_centre.setParent(course03)

const lp_group_02_inner = new RotatingPlatform(
  lilypad_inner,
  new Transform({ position: new Vector3(0, 0, 0),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -7, 0)
)
lp_group_02_inner.setParent(lp_group_02_centre)

const lp_group_02_outer = new RotatingPlatform(
  lilypad_outer,
  new Transform({ position: new Vector3(0, 0, 0),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, 7, 0)
)
lp_group_02_outer.setParent(lp_group_02_inner)



const lp_group_03_centre = new RotatingPlatform(
  lilypad_centre,
  new Transform({ position: new Vector3(5, 1.5, 24),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -5, 0)
)
lp_group_03_centre.setParent(course03)

const lp_group_03_inner = new RotatingPlatform(
  lilypad_inner,
  new Transform({ position: new Vector3(0, 0, 0),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -5, 0)
)
lp_group_03_inner.setParent(lp_group_03_centre)

const lp_group_03_outer = new RotatingPlatform(
  lilypad_outer,
  new Transform({ position: new Vector3(0, 0, 0),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -12, 0)
)
lp_group_03_outer.setParent(lp_group_03_inner)


//course 04

const door_row1 = new Entity()
door_row1.addComponent(door)
door_row1.addComponent(new Transform({position: new Vector3(1.47,0,0.1)}))
door_row1.setParent(course04)

const door_row1_f1 = new Entity()
door_row1_f1.addComponent(door_fake)
door_row1_f1.addComponent(new Transform({position: new Vector3(4.35,0,0.1)}))
door_row1_f1.setParent(course04)

const door_row1_f2 = new Entity()
door_row1_f2.addComponent(door_fake)
door_row1_f2.addComponent(new Transform({position: new Vector3(7.15,0,0.1)}))
door_row1_f2.setParent(course04)


const door_row2 = new Entity()
door_row2.addComponent(door_fake)
door_row2.addComponent(new Transform({position: new Vector3(1.47,0,5.1)}))
door_row2.setParent(course04)

const door_row2_f1 = new Entity()
door_row2_f1.addComponent(door)
door_row2_f1.addComponent(new Transform({position: new Vector3(4.35,0,5.1)}))
door_row2_f1.setParent(course04)

const door_row2_f2 = new Entity()
door_row2_f2.addComponent(door_fake)
door_row2_f2.addComponent(new Transform({position: new Vector3(7.15,0,5.1)}))
door_row2_f2.setParent(course04)


const door_row3 = new Entity()
door_row3.addComponent(door_fake)
door_row3.addComponent(new Transform({position: new Vector3(1.47,0,10.1)}))
door_row3.setParent(course04)

const door_row3_f1 = new Entity()
door_row3_f1.addComponent(door)
door_row3_f1.addComponent(new Transform({position: new Vector3(4.35,0,10.1)}))
door_row3_f1.setParent(course04)

const door_row3_f2 = new Entity()
door_row3_f2.addComponent(door_fake)
door_row3_f2.addComponent(new Transform({position: new Vector3(7.15,0,10.1)}))
door_row3_f2.setParent(course04)




const door_row4 = new Entity()
door_row4.addComponent(door)
door_row4.addComponent(new Transform({position: new Vector3(1.47,0,15.1)}))
door_row4.setParent(course04)

const door_row4_f1 = new Entity()
door_row4_f1.addComponent(door_fake)
door_row4_f1.addComponent(new Transform({position: new Vector3(4.35,0,15.1)}))
door_row4_f1.setParent(course04)

const door_row4_f2 = new Entity()
door_row4_f2.addComponent(door_fake)
door_row4_f2.addComponent(new Transform({position: new Vector3(7.15,0,15.1)}))
door_row4_f2.setParent(course04)



const door_row5 = new Entity()
door_row5.addComponent(door_fake)
door_row5.addComponent(new Transform({position: new Vector3(1.47,0,20.1)}))
door_row5.setParent(course04)

const door_row5_f1 = new Entity()
door_row5_f1.addComponent(door_fake)
door_row5_f1.addComponent(new Transform({position: new Vector3(4.35,0,20.1)}))
door_row5_f1.setParent(course04)

const door_row5_f2 = new Entity()
door_row5_f2.addComponent(door)
door_row5_f2.addComponent(new Transform({position: new Vector3(7.15,0,20.1)}))
door_row5_f2.setParent(course04)


const door_row6 = new Entity()
door_row6.addComponent(door_fake)
door_row6.addComponent(new Transform({position: new Vector3(1.47,0,25.1)}))
door_row6.setParent(course04)

const door_row6_f1 = new Entity()
door_row6_f1.addComponent(door_fake)
door_row6_f1.addComponent(new Transform({position: new Vector3(4.35,0,25.1)}))
door_row6_f1.setParent(course04)

const door_row6_f2 = new Entity()
door_row6_f2.addComponent(door)
door_row6_f2.addComponent(new Transform({position: new Vector3(7.15,0,25.1)}))
door_row6_f2.setParent(course04)

//upper level
const door_upper_row1 = new Entity()
door_upper_row1.addComponent(door)
door_upper_row1.addComponent(new Transform({position: new Vector3(10.7,3,25.1),scale: new Vector3(1.2,1,1)}))
door_upper_row1.setParent(course04)

const door_upper_row1_f1 = new Entity()
door_upper_row1_f1.addComponent(door_fake)
door_upper_row1_f1.addComponent(new Transform({position: new Vector3(13.35,3,25.1),scale: new Vector3(1.2,1,1)}))
door_upper_row1_f1.setParent(course04)


const door_upper_row2 = new Entity()
door_upper_row2.addComponent(door_fake)
door_upper_row2.addComponent(new Transform({position: new Vector3(10.7,3,20.1),scale: new Vector3(1.2,1,1)}))
door_upper_row2.setParent(course04)

const door_upper_row2_f1 = new Entity()
door_upper_row2_f1.addComponent(door)
door_upper_row2_f1.addComponent(new Transform({position: new Vector3(13.35,3,20.1),scale: new Vector3(1.2,1,1)}))
door_upper_row2_f1.setParent(course04)


const door_upper_row3 = new Entity()
door_upper_row3.addComponent(door)
door_upper_row3.addComponent(new Transform({position: new Vector3(10.7,3,15.1),scale: new Vector3(1.2,1,1)}))
door_upper_row3.setParent(course04)

const door_upper_row3_f1 = new Entity()
door_upper_row3_f1.addComponent(door_fake)
door_upper_row3_f1.addComponent(new Transform({position: new Vector3(13.35,3,15.1),scale: new Vector3(1.2,1,1)}))
door_upper_row3_f1.setParent(course04)


const door_upper_row4 = new Entity()
door_upper_row4.addComponent(door_fake)
door_upper_row4.addComponent(new Transform({position: new Vector3(10.7,3,10.1),scale: new Vector3(1.2,1,1)}))
door_upper_row4.setParent(course04)

const door_upper_row4_f1 = new Entity()
door_upper_row4_f1.addComponent(door)
door_upper_row4_f1.addComponent(new Transform({position: new Vector3(13.35,3,10.1),scale: new Vector3(1.2,1,1)}))
door_upper_row4_f1.setParent(course04)


//course05

rotating_platform


const right_rotating_platform = new RotatingPlatform(
  rotating_platform_2x,
  new Transform({ position: new Vector3(86, 7, 32),rotation: Quaternion.Euler(0,90,0),scale: new Vector3(1.3,1,1) }),
  Quaternion.Euler(-12, 0, 0)
)
engine.addEntity(right_rotating_platform)

*/


///////////////////////////////////////////////////////////////////
//
//
//course 06
