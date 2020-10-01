import { PathedPlatform } from "./pathedPlatform"
import { RotatingPlatform } from "./rotatingPlatform"
import { Sound } from "./sound"
import { Ring } from "./ring"
import { MovingPlatform } from "./movingPlatform"


//structure
const statium = new GLTFShape("models/dcl_knockout_stadium.glb")
const berm = new GLTFShape("models/berm.glb")
const sign_d = new GLTFShape("models/d.glb")
const sign_c = new GLTFShape("models/c.glb")
const sign_l = new GLTFShape("models/l.glb")
const sign_k = new GLTFShape("models/k.glb")
const sign_n = new GLTFShape("models/n.glb")
const sign_o1 = new GLTFShape("models/o1.glb")
const sign_o2 = new GLTFShape("models/o2.glb")
const sign_c_lower = new GLTFShape("models/c_lower.glb")
const sign_k_lower = new GLTFShape("models/k_lower.glb")
const sign_u = new GLTFShape("models/u.glb")
const sign_t = new GLTFShape("models/t.glb")
const finish_plat = new GLTFShape("models/finish_platform.glb")
const course_marker = new GLTFShape("models/course_marker.glb")
const crown = new GLTFShape("models/crown.glb")

//bottom level course
const roundaboutAShape = new GLTFShape("models/level01Course/roundaboutA.glb")

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
floor3x7.addComponent(statium)
floor3x7.addComponent(new Transform({position: new Vector3(0,-.02,0)}))
engine.addEntity(floor3x7)

const c = new Entity()
c.addComponent(sign_c)
c.addComponent(new Transform({position: new Vector3(9,12.4,20.5),rotation: Quaternion.Euler(0,0,0)}))
engine.addEntity(c)


const k = new Entity()
k.addComponent(sign_k)
k.addComponent(new Transform({position: new Vector3(9,12.4,20.5),rotation: Quaternion.Euler(0,0,0)}))
engine.addEntity(k)

const o = new Entity()
o.addComponent(sign_o1)
o.addComponent(new Transform({position: new Vector3(9,12.4,20.5),rotation: Quaternion.Euler(0,0,0)}))
engine.addEntity(o)

const k_lower = new Entity()
k_lower.addComponent(sign_k_lower)
k_lower.addComponent(new Transform({position: new Vector3(9,12.4,20.5),rotation: Quaternion.Euler(0,0,0)}))
engine.addEntity(k_lower)

const u = new Entity()
u.addComponent(sign_u)
u.addComponent(new Transform({position: new Vector3(9,12.4,20.5),rotation: Quaternion.Euler(0,0,0)}))
engine.addEntity(u)

const c1_marker = new Entity()
c1_marker.addComponent(course_marker)
c1_marker.addComponent(new Transform({position: new Vector3(97.7,12.5,31.5),rotation: Quaternion.Euler(0,180,0)}))
engine.addEntity(c1_marker)


const c2_marker = new Entity()
c2_marker.addComponent(course_marker)
c2_marker.addComponent(new Transform({position: new Vector3(78.5,12.5,31.5),rotation: Quaternion.Euler(0,180,0)}))
engine.addEntity(c2_marker)


const c3_marker = new Entity()
c3_marker.addComponent(course_marker)
c3_marker.addComponent(new Transform({position: new Vector3(63,12.5,31.5),rotation: Quaternion.Euler(0,180,0)}))
engine.addEntity(c3_marker)

const c4_marker = new Entity()
c4_marker.addComponent(course_marker)
c4_marker.addComponent(new Transform({position: new Vector3(45,12.5,31.5),rotation: Quaternion.Euler(0,180,0)}))
engine.addEntity(c4_marker)


const c5_marker = new Entity()
c5_marker.addComponent(course_marker)
c5_marker.addComponent(new Transform({position: new Vector3(28,12.5,31.5),rotation: Quaternion.Euler(0,180,0)}))
engine.addEntity(c5_marker)

//
//
//
// Moving platform
const d_move = new MovingPlatform(
  sign_d,
  new Vector3(9,11.9,20.5),
  new Vector3(6,11.9,20.5),
  3
)

const l_move = new MovingPlatform(
  sign_l,
  new Vector3(9,11.9,20.5),
  new Vector3(7,11.9,20.5),
  3
)

const n_move = new MovingPlatform(
  sign_n,
  new Vector3(9.1,11.9,20.5),
  new Vector3(6,11.9,20.5),
  3
)

const c_move = new MovingPlatform(
  sign_c_lower,
  new Vector3(11,11.9,20.5),
  new Vector3(5,11.9,20.5),
  3
)

const o2_move = new MovingPlatform(
  sign_o2,
  new Vector3(9.1,11.9,20.5),
  new Vector3(6,11.9,20.5),
  3
)

const t_move = new MovingPlatform(
  sign_t,
  new Vector3(11,11.9,20.5),
  new Vector3(5,11.9,20.5),
  3
)

const finish_move = new MovingPlatform(
  finish_plat,
  new Vector3(2.5,4.5,35),
  new Vector3(2.5,4.5,33),
  3
)

///////////////////////////////////////////////////////////////////////////////
//
//Bottom level obsticles
const roundaboutA1 = new RotatingPlatform(
  roundaboutAShape,
  new Transform({ position: new Vector3(28, 3, 34),scale: new Vector3(2,1,2)}),
  Quaternion.Euler(0, 100, 0)
)
const roundaboutB1 = new RotatingPlatform(
  roundaboutAShape,
  new Transform({ position: new Vector3(28, 3, 18),scale: new Vector3(2,1,2)}),
  Quaternion.Euler(0, 100, 0)
)

const roundabout2 = new RotatingPlatform(
  roundaboutAShape,
  new Transform({ position: new Vector3(42, 3, 26),scale: new Vector3(2,1,2) }),
  Quaternion.Euler(0, 120, 0)
)

const roundabout3 = new RotatingPlatform(
  roundaboutAShape,
  new Transform({ position: new Vector3(55, 3, 34),scale: new Vector3(2,1,2) }),
  Quaternion.Euler(0, 120, 0)
)

const roundabout4 = new RotatingPlatform(
  roundaboutAShape,
  new Transform({ position: new Vector3(55, 3, 18),scale: new Vector3(2,1,2) }),
  Quaternion.Euler(0, 120, 0)
)

const roundabout5 = new RotatingPlatform(
  roundaboutAShape,
  new Transform({ position: new Vector3(70, 3, 34),scale: new Vector3(2,1,2) }),
  Quaternion.Euler(0, 120, 0)
)

const roundabout6 = new RotatingPlatform(
  roundaboutAShape,
  new Transform({ position: new Vector3(70, 3, 18),scale: new Vector3(2,1,2) }),
  Quaternion.Euler(0, 120, 0)
)

const roundabout7 = new RotatingPlatform(
  roundaboutAShape,
  new Transform({ position: new Vector3(85, 3, 24),scale: new Vector3(2,1,2) }),
  Quaternion.Euler(0, 120, 0)
)

const crown1 = new RotatingPlatform(
  crown,
  new Transform({ position: new Vector3(0, 1,0) }),
  Quaternion.Euler(0, 10, 0)
)
crown1.setParent(finish_move)

//platform01 obsticles
const staticPlatform = new Entity()
staticPlatform.addComponent(platform)
staticPlatform.addComponent(new Transform({position: new Vector3(3,1,4),scale: new Vector3(1,.5,1)}))
staticPlatform.setParent(c1_marker)
engine.addEntity(staticPlatform)

let path = [new Vector3(0, -1, 1.5), new Vector3(0, 1, 1.5), new Vector3(0, 1, -1.5), new Vector3(0, -1, -1.5)]
const knocker01 = new PathedPlatform(knocker, path,2)
knocker01.setParent(staticPlatform)



const platform02 = new Entity()
platform02.addComponent(platform)
platform02.addComponent(new Transform({position: new Vector3(3,1.7,10),scale: new Vector3(1,.5,1)}))
platform02.setParent(c1_marker)
engine.addEntity(platform02)

const knocker02 = new PathedPlatform(knocker, path,2)
knocker02.setParent(platform02)

const platform03 = new Entity()
platform03.addComponent(platform)
platform03.addComponent(new Transform({position: new Vector3(3,2,16),scale: new Vector3(1,.5,1.5)}))
platform03.setParent(c1_marker)
engine.addEntity(platform03)

const knocker03 = new PathedPlatform(knocker, path,2)
knocker03.setParent(platform03)

const platform04 = new Entity()
platform04.addComponent(platform)
platform04.addComponent(new Transform({position: new Vector3(3,2,26),scale: new Vector3(2,.5,2.5)}))
platform04.setParent(c1_marker)
engine.addEntity(platform04)

const knocker04 = new PathedPlatform(knocker, path,2)
knocker04.setParent(platform04)

const platform05 = new Entity()
platform05.addComponent(platform)
platform05.addComponent(new Transform({position: new Vector3(12,4,17),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
platform05.setParent(c1_marker)
engine.addEntity(platform05)

const knocker05 = new PathedPlatform(knocker, path,2)
knocker05.setParent(platform05)

const platform06 = new Entity()
platform06.addComponent(platform)
platform06.addComponent(new Transform({position: new Vector3(12,5,25),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
platform06.setParent(c1_marker)
engine.addEntity(platform06)

const knocker06 = new PathedPlatform(knocker, path,2)
knocker06.setParent(platform06)

const platform07 = new Entity()
platform07.addComponent(platform)
platform07.addComponent(new Transform({position: new Vector3(12,5,12),rotation: Quaternion.Euler(0,180,0),scale: new Vector3(2,.5,2)}))
platform07.setParent(c1_marker)
engine.addEntity(platform07)

const knocker07 = new PathedPlatform(knocker, path,2)
knocker07.setParent(platform07)

//course02 obsticles
const whacker01 = new RotatingPlatform(
  whacker,
  new Transform({ position: new Vector3(8, 3.2, 16) }),
  Quaternion.Euler(0, -120, 0)
)
whacker01.setParent(c2_marker)

const whacker02 = new RotatingPlatform(
  whacker,
  new Transform({ position: new Vector3(8, 7, 16) }),
  Quaternion.Euler(0, -110, 0)
)
whacker02.setParent(c2_marker)

const whacker03 = new RotatingPlatform(
  whacker,
  new Transform({ position: new Vector3(8, 11, 16) }),
  Quaternion.Euler(0, -120, 0)
)
 whacker03.setParent(c2_marker)

//course 03 obsticles
const turbine01 = new RotatingPlatform(
  turbine,
  new Transform({ position: new Vector3(12, 7, 17),rotation: Quaternion.Euler(90,0,0) }),
  Quaternion.Euler(0, -80, 0)
)
turbine01.setParent(c3_marker)

const lp_group_01_centre = new RotatingPlatform(
  lilypad_centre,
  new Transform({ position: new Vector3(5, 1.5, 12),rotation: Quaternion.Euler(0,0,0) }),
  Quaternion.Euler(0, -10, 0)
)
lp_group_01_centre.setParent(c3_marker)

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
lp_group_02_centre.setParent(c3_marker)

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
lp_group_03_centre.setParent(c3_marker)

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
door_row1.setParent(c4_marker)

const door_row1_f1 = new Entity()
door_row1_f1.addComponent(door_fake)
door_row1_f1.addComponent(new Transform({position: new Vector3(4.35,0,0.1)}))
door_row1_f1.setParent(c4_marker)

const door_row1_f2 = new Entity()
door_row1_f2.addComponent(door_fake)
door_row1_f2.addComponent(new Transform({position: new Vector3(7.15,0,0.1)}))
door_row1_f2.setParent(c4_marker)


const door_row2 = new Entity()
door_row2.addComponent(door_fake)
door_row2.addComponent(new Transform({position: new Vector3(1.47,0,5.1)}))
door_row2.setParent(c4_marker)

const door_row2_f1 = new Entity()
door_row2_f1.addComponent(door)
door_row2_f1.addComponent(new Transform({position: new Vector3(4.35,0,5.1)}))
door_row2_f1.setParent(c4_marker)

const door_row2_f2 = new Entity()
door_row2_f2.addComponent(door_fake)
door_row2_f2.addComponent(new Transform({position: new Vector3(7.15,0,5.1)}))
door_row2_f2.setParent(c4_marker)


const door_row3 = new Entity()
door_row3.addComponent(door_fake)
door_row3.addComponent(new Transform({position: new Vector3(1.47,0,10.1)}))
door_row3.setParent(c4_marker)

const door_row3_f1 = new Entity()
door_row3_f1.addComponent(door)
door_row3_f1.addComponent(new Transform({position: new Vector3(4.35,0,10.1)}))
door_row3_f1.setParent(c4_marker)

const door_row3_f2 = new Entity()
door_row3_f2.addComponent(door_fake)
door_row3_f2.addComponent(new Transform({position: new Vector3(7.15,0,10.1)}))
door_row3_f2.setParent(c4_marker)




const door_row4 = new Entity()
door_row4.addComponent(door)
door_row4.addComponent(new Transform({position: new Vector3(1.47,0,15.1)}))
door_row4.setParent(c4_marker)

const door_row4_f1 = new Entity()
door_row4_f1.addComponent(door_fake)
door_row4_f1.addComponent(new Transform({position: new Vector3(4.35,0,15.1)}))
door_row4_f1.setParent(c4_marker)

const door_row4_f2 = new Entity()
door_row4_f2.addComponent(door_fake)
door_row4_f2.addComponent(new Transform({position: new Vector3(7.15,0,15.1)}))
door_row4_f2.setParent(c4_marker)



const door_row5 = new Entity()
door_row5.addComponent(door_fake)
door_row5.addComponent(new Transform({position: new Vector3(1.47,0,20.1)}))
door_row5.setParent(c4_marker)

const door_row5_f1 = new Entity()
door_row5_f1.addComponent(door_fake)
door_row5_f1.addComponent(new Transform({position: new Vector3(4.35,0,20.1)}))
door_row5_f1.setParent(c4_marker)

const door_row5_f2 = new Entity()
door_row5_f2.addComponent(door)
door_row5_f2.addComponent(new Transform({position: new Vector3(7.15,0,20.1)}))
door_row5_f2.setParent(c4_marker)


const door_row6 = new Entity()
door_row6.addComponent(door_fake)
door_row6.addComponent(new Transform({position: new Vector3(1.47,0,25.1)}))
door_row6.setParent(c4_marker)

const door_row6_f1 = new Entity()
door_row6_f1.addComponent(door_fake)
door_row6_f1.addComponent(new Transform({position: new Vector3(4.35,0,25.1)}))
door_row6_f1.setParent(c4_marker)

const door_row6_f2 = new Entity()
door_row6_f2.addComponent(door)
door_row6_f2.addComponent(new Transform({position: new Vector3(7.15,0,25.1)}))
door_row6_f2.setParent(c4_marker)

//upper level
const door_upper_row1 = new Entity()
door_upper_row1.addComponent(door)
door_upper_row1.addComponent(new Transform({position: new Vector3(10.7,3,25.1),scale: new Vector3(1.2,1,1)}))
door_upper_row1.setParent(c4_marker)

const door_upper_row1_f1 = new Entity()
door_upper_row1_f1.addComponent(door_fake)
door_upper_row1_f1.addComponent(new Transform({position: new Vector3(13.35,3,25.1),scale: new Vector3(1.2,1,1)}))
door_upper_row1_f1.setParent(c4_marker)


const door_upper_row2 = new Entity()
door_upper_row2.addComponent(door_fake)
door_upper_row2.addComponent(new Transform({position: new Vector3(10.7,3,20.1),scale: new Vector3(1.2,1,1)}))
door_upper_row2.setParent(c4_marker)

const door_upper_row2_f1 = new Entity()
door_upper_row2_f1.addComponent(door)
door_upper_row2_f1.addComponent(new Transform({position: new Vector3(13.35,3,20.1),scale: new Vector3(1.2,1,1)}))
door_upper_row2_f1.setParent(c4_marker)


const door_upper_row3 = new Entity()
door_upper_row3.addComponent(door)
door_upper_row3.addComponent(new Transform({position: new Vector3(10.7,3,15.1),scale: new Vector3(1.2,1,1)}))
door_upper_row3.setParent(c4_marker)

const door_upper_row3_f1 = new Entity()
door_upper_row3_f1.addComponent(door_fake)
door_upper_row3_f1.addComponent(new Transform({position: new Vector3(13.35,3,15.1),scale: new Vector3(1.2,1,1)}))
door_upper_row3_f1.setParent(c4_marker)


const door_upper_row4 = new Entity()
door_upper_row4.addComponent(door_fake)
door_upper_row4.addComponent(new Transform({position: new Vector3(10.7,3,10.1),scale: new Vector3(1.2,1,1)}))
door_upper_row4.setParent(c4_marker)

const door_upper_row4_f1 = new Entity()
door_upper_row4_f1.addComponent(door)
door_upper_row4_f1.addComponent(new Transform({position: new Vector3(13.35,3,10.1),scale: new Vector3(1.2,1,1)}))
door_upper_row4_f1.setParent(c4_marker)


//course05

rotating_platform


const right_rotating_platform = new RotatingPlatform(
  rotating_platform_2x,
  new Transform({ position: new Vector3(6, 6, 16),rotation: Quaternion.Euler(0,90,0),scale: new Vector3(1.3,1,1) }),
  Quaternion.Euler(-12, 0, 0)
)
right_rotating_platform.setParent(c5_marker)
engine.addEntity(right_rotating_platform);
