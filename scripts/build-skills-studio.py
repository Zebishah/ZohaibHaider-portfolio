"""Build the portfolio's original, fully modelled six-room skills studio.

Run with Blender 4.3 Python (bpy), not the application runtime. Outputs a real
glTF model and Cycles-rendered previews; no reference photograph is used as a
texture. --preview makes a small proof; --bake bakes diffuse architectural light.
"""
import bpy
import math
import random
import sys
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/models/skills-studio"
WORK = Path("/tmp/zohaib-portfolio-qa/skills-studio")
OUT.mkdir(parents=True, exist_ok=True)
WORK.mkdir(parents=True, exist_ok=True)
random.seed(41)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.cycles.transparent_max_bounces = 6
scene.render.threads_mode = "FIXED"
scene.render.threads = 6
scene.render.image_settings.file_format = "PNG"
scene.render.film_transparent = True
scene.render.image_settings.color_mode = "RGBA"
scene.world.color = (.55, .49, .42)
scene.world.use_nodes = True
scene.world.node_tree.nodes["Background"].inputs[0].default_value = (.72, .66, .57, 1)
scene.world.node_tree.nodes["Background"].inputs[1].default_value = .45
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.render.resolution_percentage = 100

def material(name, color, rough=.5, metal=0, noise=0, emission=0, transmission=0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    nodes = m.node_tree.nodes
    p = nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    p.inputs["Transmission Weight"].default_value = transmission
    p.inputs["IOR"].default_value = 1.45
    if emission:
        p.inputs["Emission Color"].default_value = (*color, 1)
        p.inputs["Emission Strength"].default_value = emission
    if noise:
        tex = nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value = 48 if name != "Walnut" else 4
        tex.inputs["Detail"].default_value = 3
        bump = nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = noise
        bump.inputs["Distance"].default_value = .018
        m.node_tree.links.new(tex.outputs["Fac"], bump.inputs["Height"])
        m.node_tree.links.new(bump.outputs["Normal"], p.inputs["Normal"])
    return m

stone = material("Warm honed limestone", (.72,.65,.54), .68, noise=.25)
plaster = material("Ivory mineral plaster", (.73,.68,.60), .85, noise=.18)
floor_mat = material("Travertine", (.58,.49,.37), .52, noise=.2)
cream = material("Porcelain", (.84,.80,.71), .35)
wood = material("Walnut", (.20,.10,.045), .42, noise=.28)
wood_light = material("Oak slats", (.40,.27,.15), .55, noise=.2)
terracotta = material("Burnt clay", (.43,.16,.065), .75, noise=.17)
black = material("Graphite powder coat", (.025,.030,.029), .4, .3)
metal = material("Brushed aluminium", (.48,.50,.49), .27, .88, noise=.12)
gold = material("Brushed brass", (.50,.29,.09), .28, .78)
leather = material("Sand leather", (.57,.50,.40), .52, noise=.12)
screen = material("Display glass", (.019,.033,.047), .24, .2)
ui = material("Interface ink", (.26,.40,.52), .4, emission=.45)
ui_light = material("Interface paper", (.61,.66,.65), .5, emission=.3)
amber = material("Warm LEDs", (1,.48,.11), .35, emission=3.5)
white_light = material("Warm white LEDs", (1,.78,.48), .4, emission=2.5)
green = material("Plant leaves", (.14,.24,.065), .6)
stem = material("Branches", (.15,.08,.035), .7)
glass = material("Clear architectural glass", (.86,.92,.90), .08, transmission=1)
ground_mat = material("Warm ivory ground", (.83,.78,.70), .8, noise=.08)
objects = []
room = None

def finish(o, name, mat, dynamic=False):
    o.name = name
    if mat: o.data.materials.append(mat)
    if room is not None: o["room"] = room
    o["dynamic"] = dynamic
    objects.append(o)
    return o

def box(name, loc, dims, mat, bevel=.025, dynamic=False):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o=bpy.context.object
    o.dimensions=dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        b=o.modifiers.new("Crafted edges", "BEVEL"); b.width=bevel; b.segments=3
        n=o.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    return finish(o,name,mat,dynamic)

def sphere(name, loc, scale, mat, dynamic=False):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=1, location=loc)
    o=bpy.context.object; o.scale=scale
    for p in o.data.polygons: p.use_smooth=True
    return finish(o,name,mat,dynamic)

def cylinder(name, loc, radius, depth, mat, vertices=32, dynamic=False):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    o=bpy.context.object
    b=o.modifiers.new("Rim bevel", "BEVEL"); b.width=min(.015, radius*.12); b.segments=2
    o.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    return finish(o,name,mat,dynamic)

def line(name, points, radius, mat, dynamic=False):
    c=bpy.data.curves.new(name,"CURVE"); c.dimensions="3D"; c.resolution_u=2
    c.bevel_depth=radius; c.bevel_resolution=2
    p=c.splines.new("POLY"); p.points.add(len(points)-1)
    for v,co in zip(p.points,points): v.co=(*co,1)
    o=bpy.data.objects.new(name,c); bpy.context.collection.objects.link(o)
    return finish(o,name,mat,dynamic)

def between(name, a,b,r,mat,dynamic=False): return line(name,[a,b],r,mat,dynamic)

def area(name,loc,power,size,color,target):
    data=bpy.data.lights.new(name,"AREA"); data.energy=power; data.shape="DISK"; data.size=size; data.color=color
    o=bpy.data.objects.new(name,data); bpy.context.collection.objects.link(o); o.location=loc
    o.rotation_euler=(Vector(target)-o.location).to_track_quat("-Z","Y").to_euler()
    return o

def plant(x,y,z,scale=1):
    cylinder("Stone planter",(x,y,z+.15*scale),.19*scale,.30*scale,cream)
    cylinder("Soil",(x,y,z+.305*scale),.165*scale,.015*scale,stem)
    for i in range(5):
        angle=i*2.4
        end=(x+math.cos(angle)*.20*scale,y+math.sin(angle)*.20*scale,z+(.75+random.random()*.4)*scale)
        between("Botanical stem",(x,y,z+.3*scale),end,.009*scale,stem)
        for j in range(4):
            t=.35+j*.19
            center=Vector((x,y,z+.3*scale)).lerp(Vector(end),t)
            side=angle+(1 if j%2 else -1)*1.3
            leaf=sphere("Natural leaf",tuple(center+Vector((math.cos(side),math.sin(side),.1))*.10*scale),(.075*scale,.17*scale,.018*scale),green)
            leaf.rotation_euler=(.45, .15, side-1.57)

def desk(x,y,z,width=2.1):
    box("Walnut worktop",(x,y,z+.79),(width,.64,.065),wood,.025)
    for side in [-1,1]:
        for yy in [-.22,.22]: box("Desk leg",(x+side*(width/2-.10),y+yy,z+.39),(.035,.035,.74),black,.009)
    box("Drawer pedestal",(x+width/2-.30,y,z+.39),(.43,.56,.69),wood,.02)
    for j in range(3):
        box("Drawer front",(x+width/2-.30,y-.292,z+.17+j*.22),(.405,.018,.20),wood_light,.009)
        box("Drawer pull",(x+width/2-.30,y-.307,z+.2+j*.22),(.13,.015,.012),metal,.003)
    box("Keyboard",(x-.12,y-.12,z+.84),(.49,.18,.025),black,.012)
    for j in range(4):
        for k in range(12): box("Keyboard key",(x-.34+k*.039,y-.185+j*.039,z+.855),(.025,.023,.008),metal,.002)
    sphere("Mouse",(x+.28,y-.13,z+.855),(.045,.07,.02),black)

def chair(x,y,z):
    box("Leather chair seat",(x,y,z+.46),(.48,.49,.095),leather,.07)
    back=box("Leather chair back",(x,y+.22,z+.78),(.49,.095,.58),leather,.075); back.rotation_euler.x=-.13
    cylinder("Chair stem",(x,y,z+.23),.027,.36,metal)
    for k in range(5):
        a=k*math.tau/5; end=(x+math.cos(a)*.31,y+math.sin(a)*.31,z+.09)
        between("Chair base",(x,y,z+.15),end,.018,metal)
        sphere("Caster",end,(.032,.032,.04),black)

def monitor(x,y,z,kind="code",size=1):
    # z is desktop height. Screens face the open front of the building.
    w=1.36*size; h=.78*size; cz=z+.51*size
    box("Monitor aluminium foot",(x,y,z+.025),(.38*size,.24*size,.025),metal,.018)
    box("Monitor stem",(x,y+.035,z+.20*size),(.055,.065,.35*size),metal,.015)
    box("Monitor bezel",(x,y,cz),(w,.075,h),black,.035)
    box("Monitor display",(x,y-.041,cz),(w-.07,.008,h-.065),screen,.015)
    yy=y-.048
    if kind=="web":
        box("Browser toolbar",(x,yy,cz+h*.39),(w*.92,.008,h*.10),ui_light,.005)
        box("Sidebar",(x-w*.35,yy,cz-h*.03),(w*.20,.008,h*.65),ui,.005)
        box("Page headline",(x+w*.10,yy,cz+h*.24),(w*.54,.008,h*.055),ui_light,.005)
        for i in range(3):
            box("Interface card",(x-w*.09+i*w*.22,yy,cz-h*.02),(w*.19,.008,h*.28),ui_light,.008)
            box("Interface chart",(x-w*.09+i*w*.22,yy-.005,cz-h*.21),(w*.19,.008,h*.07),ui,.005)
    elif kind=="code":
        for j in range(9):
            for k in range(3):
                box("Code syntax",(x-w*.30+k*w*.21+random.random()*.05,yy,cz+h*.31-j*h*.073),((.09+random.random()*.14)*size,.008,.013*size),ui if k%2 else white_light,.002)
    else:
        if kind=="search":
            pts=[(x+.16*size*math.cos(a),yy-.005,cz+.16*size*math.sin(a)+.04) for a in [i*math.tau/40 for i in range(41)]]
            line("Search icon",pts,.018*size,ui_light); between("Search handle",(x+.12*size,yy,cz-.08*size),(x+.29*size,yy,cz-.25*size),.018*size,ui_light)
        elif kind=="check": line("Test passed",[(x-.22*size,yy,cz),(x-.05*size,yy,cz-.14*size),(x+.25*size,yy,cz+.18*size)],.026*size,ui_light)
        elif kind=="cloud":
            pts=[(-.35,-.1),(-.41,.02),(-.36,.15),(-.2,.17),(-.15,.29),(.02,.32),(.18,.22),(.3,.22),(.39,.11),(.38,-.02),(.28,-.1),(-.35,-.1)]
            line("Cloud display",[(x+u*size,yy,cz+v*size) for u,v in pts],.016*size,ui_light)
        else: line("Terminal",[(x-.25,yy,cz+.14),(x-.1,yy,cz),(x-.25,yy,cz-.14)],.018,ui_light); between("Terminal cursor",(x+.02,yy,cz-.14),(x+.25,yy,cz-.14),.018,ui_light)

def wall_panels(cx,z):
    for j in range(2):
        for k in range(2):
            x=cx+1.2+k*.65; zz=z+1.25+j*.45
            box("UI wall tile",(x,1.41,zz),(.54,.075,.32),cream,.035)
            if k==0:
                for b in range(3): box("Component lines",(x-.03,1.365,zz+.06-b*.055),(.29-b*.03,.012,.015),wood_light,.004)
            else:
                for b in range(2): box("Toggle component",(x,1.36,zz+.07-b*.14),(.30,.025,.075),leather,.025)

# Building envelope: continuous slabs and columns, never disconnected cards.
room=None
box("Foundation lower",(.55,0,.12),(15.1,5.2,.24),stone,.07)
box("Foundation upper",(.55,.08,.32),(14.6,4.75,.18),cream,.045)
for zz in [.48,2.93,5.38,7.83]:
    box("Continuous limestone slab",(.55,.08,zz),(13.8,3.64,.19),stone,.035)
    box("Polished slab front edge",(.55,-1.75,zz+.02),(13.8,.065,.13),cream,.012)
for xx in [-6.0,-.05,5.82]:
    box("Structural stone column",(xx,-1.32,4.16),(.18,.32,7.4),stone,.025)
    box("Rear column",(xx,1.58,4.16),(.16,.16,7.4),stone,.02)
for floor in range(3):
    zz=.59+floor*2.45
    box("Interior floor",(-.07,.1,zz-.01),(11.72,3.12,.05),floor_mat,.005)
    box("Central partition",(-.05,.25,zz+1.12),(.15,2.9,2.24),plaster,.02)
    box("Left glazing",(-6.0,.20,zz+1.13),(.02,2.9,2.18),glass,.005,True)
    for yy in [-1.25,-.2,1.35]: box("Glass mullion",(-6.01,yy,zz+1.13),(.04,.035,2.2),black,.006)

bases=[5.49,5.49,3.04,3.04,.59,.59]
centers=[-3.02,2.88,-3.02,2.88,-3.02,2.88]
for i,(cx,z) in enumerate(zip(centers,bases)):
    room=i
    box("Room back wall",(cx,1.60,z+1.12),(5.72,.13,2.24),terracotta if i==2 else plaster,.012)
    if i in [0,4,5]:
        for k in range(30): box("Walnut acoustic slat",(cx-2.5+k*.17,1.51,z+1.12),(.035,.04,2.15),wood_light,.005)
    box("Recessed ceiling",(cx,.03,z+2.17),(5.7,3.1,.055),plaster,.009)
    box("Cove lighting",(cx,1.42,z+2.08),(5.40,.025,.025),white_light,.005,True)
    box("Track light rail",(cx,-.53,z+2.08),(4.8,.035,.035),black,.006)
    for xx in [cx-1.7,cx,cx+1.7]:
        cylinder("Track light",(xx,-.53,z+2.00),.042,.12,black)
        cylinder("Spot lens",(xx,-.53,z+1.935),.032,.008,white_light,dynamic=True)
    area("Interior daylight",(cx,-.3,z+2.04),90,3,(1,.76,.48),(cx,.4,z+.2))
    # Four independent selectable outline strips; can glow without remeshing.
    for a,b in [((cx-2.75,-1.47,z+.03),(cx+2.75,-1.47,z+.03)),((cx-2.75,-1.47,z+2.12),(cx+2.75,-1.47,z+2.12)),((cx-2.75,-1.47,z+.03),(cx-2.75,-1.47,z+2.12)),((cx+2.75,-1.47,z+.03),(cx+2.75,-1.47,z+2.12))]:
        between(f"RoomFrame_{i}",a,b,.012,amber if i==2 else stone,True)
    plant(cx-2.25,1.02,z,.85)
    plant(cx+2.20,1.0,z,.75)
    if i==0:
        desk(cx-.6,.32,z,2.35); monitor(cx-.7,.50,z+.83,"web",1.15); chair(cx+.12,-.47,z)
        wall_panels(cx,z)
        cylinder("Desk orb base",(cx-1.46,.32,z+.86),.11,.035,gold)
        sphere("Desk globe lamp",(cx-1.46,.32,z+1.00),(.14,.14,.14),white_light,True)
    elif i==1:
        desk(cx-1.25,.40,z,1.65); monitor(cx-1.4,.56,z+.83,"code",.72); chair(cx-1.3,-.43,z)
        for xx in [cx+.64,cx+1.42,cx+2.20]:
            box("Server cabinet",(xx,.85,z+.96),(.65,.72,1.91),black,.035)
            for j in range(10):
                zz=z+.15+j*.17
                box("Rack unit",(xx,.471,zz),(.54,.025,.13),black,.009)
                for k in range(6): box("Cooling slots",(xx-.19+k*.056,.450,zz),(.02,.012,.067),black,.002)
                for k in range(2): box("Server status",(xx+.17+k*.06,.432,zz+.025),(.025,.012,.022),amber,.003,True)
    elif i==2:
        desk(cx+1.05,.58,z,1.8); monitor(cx+.9,.70,z+.83,"code",.78); chair(cx+1.3,-.3,z)
        cylinder("Neural sculpture plinth",(cx-1.10,-.03,z+.19),.57,.38,cream)
        points=[]
        for k in range(10):
            angle=k*2.399
            points.append((cx-1.1+math.cos(angle)*(.68 if k%2 else .50),-.03+math.sin(angle)*.38,z+.70+k*.095))
        points.extend([(cx-1.1,-.03,z+1.9),(cx-1.1,-.03,z+.58)])
        for k,p in enumerate(points):
            sphere("NeuralNode",p,(.095,.095,.095),cream,True)
            for j in [(k+1)%12,(k+3)%12]: between("NeuralConnection",p,points[j],.012,gold,True)
        for j in range(2):
            box("Research shelf",(cx+1.2,1.40,z+1.50+j*.33),(1.6,.32,.045),wood,.012)
            for k in range(5): box("Research volume",(cx+.64+k*.13,1.40,z+1.63+j*.33),(.08,.17,.20),cream if k%2 else wood_light,.005)
    elif i==3:
        desk(cx-1.35,.45,z,1.75); monitor(cx-1.45,.62,z+.83,"search",.78); chair(cx-1.1,-.4,z)
        for xx,h in [(cx+.45,1.15),(cx+1.30,1.65),(cx+2.15,1.35)]:
            cylinder("Data core",(xx,.65,z+h/2),.09,h,amber,dynamic=True)
            cylinder("Data glass",(xx,.65,z+h/2+.05),.30,h,glass,dynamic=True)
            for j in range(5):
                cylinder("Storage ring",(xx,.65,z+.07+j*(h-.1)/4),.325,.065,metal)
                cylinder("Data light band",(xx,.65,z+.11+j*(h-.1)/4),.282,.025,amber,dynamic=True)
            for a in range(4):
                angle=a*math.pi/2
                between("Storage spine",(xx+math.cos(angle)*.30,.65+math.sin(angle)*.30,z+.08),(xx+math.cos(angle)*.30,.65+math.sin(angle)*.30,z+h),.012,metal)
    elif i==4:
        desk(cx-.65,.45,z,2.55); monitor(cx-1.23,.62,z+.83,"cloud",.7); monitor(cx-.15,.62,z+.83,"terminal",.7); chair(cx-.5,-.45,z)
        cylinder("Cloud pedestal",(cx+1.3,.5,z+.38),.43,.76,metal)
        # Smooth overlapping lobes form an actual volumetric cloud sculpture.
        for dx,dz,r in [(-.47,0,.24),(-.24,.10,.33),(.10,.18,.36),(.40,.06,.28),(.58,-.04,.20),(0,-.08,.30)]:
            sphere("CloudSculpture",(cx+1.3+dx,.5,z+1.37+dz),(r,.19,r*.80),white_light,True)
        for k in range(8): box("Deployment unit",(cx+1.30,.075,z+.13+k*.075),(.48,.025,.045),black,.005)
    elif i==5:
        desk(cx+1.20,.46,z,1.95); monitor(cx+1.15,.63,z+.83,"check",.85); chair(cx+1.35,-.4,z)
        box("Robot podium",(cx-1.12,.15,z+.22),(.70,.70,.44),cream,.04)
        pts=[(cx-1.12,.15,z+.49),(cx-1.24,.15,z+1.06),(cx-.70,.15,z+1.46),(cx-.25,.15,z+1.12)]
        for a,b in zip(pts,pts[1:]):
            v=Vector(b)-Vector(a); mid=(Vector(a)+Vector(b))/2
            o=box("RobotLink",mid,(.17,.19,v.length),cream,.07,True); o.rotation_euler=v.to_track_quat("Z","Y").to_euler()
        for p in pts:
            o=cylinder("RobotJoint",p,.13,.23,terracotta,dynamic=True); o.rotation_euler.x=math.pi/2
            q=cylinder("RobotBearing",(p[0],p[1]-.13,p[2]),.075,.025,metal,dynamic=True); q.rotation_euler.x=math.pi/2
        for side in [-1,1]: between("RobotGripper",(pts[-1][0]+side*.065,.15,pts[-1][2]-.02),(pts[-1][0]+side*.10,.15,pts[-1][2]-.23),.025,black,True)
        for k in range(3):
            box("Test fixture",(cx+.46+k*.30,.44,z+.91),(.12,.12,.15),metal,.008)

# The glazed side stair tower contains real individual spiral treads.
room=None
sx,sy=6.60,.10
for k in range(36):
    a=k*math.tau/18; z=.60+k*(4.9/36)
    verts=[]
    for zz in [z-.035,z+.035]:
        for r,a2 in [(.12,a),(.83,a),(.83,a+math.tau/18),(.12,a+math.tau/18)]: verts.append((sx+r*math.cos(a2),sy+r*math.sin(a2),zz))
    mesh=bpy.data.meshes.new("Spiral step"); mesh.from_pydata(verts,[],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]); mesh.update()
    o=bpy.data.objects.new("Spiral limestone tread",mesh); bpy.context.collection.objects.link(o); finish(o,o.name,cream)
    if k%2==0:
        between("Stair baluster",(sx+.80*math.cos(a),sy+.80*math.sin(a),z),(sx+.80*math.cos(a),sy+.80*math.sin(a),z+.78),.009,metal)
line("Continuous spiral handrail",[(sx+.81*math.cos(k*math.tau/72),sy+.81*math.sin(k*math.tau/72),.60+k*4.9/144+.82) for k in range(145)],.018,gold)
cylinder("Spiral central column",(sx,sy,3.1),.048,5.0,metal)
for xx in [5.86,7.44]:
    box("Stair glazing",(xx,.08,4.17),(.022,3.5,7.32),glass,.003,True)
    for yy in [-1.64,1.80]: box("Stair frame",(xx,yy,4.17),(.045,.045,7.4),black,.008)
box("Stair front glass",(6.64,-1.65,4.17),(1.5,.018,7.32),glass,.002,True)
for xx in [5.9,7.4]: box("Stair linear light",(xx,1.76,4.1),(.024,.025,7.1),white_light,.005,True)
box("Stair roof",(6.62,.08,7.85),(1.75,3.7,.17),stone,.025)
for i in range(3):
    box("Stair landing",(6.13,-.85,.60+i*2.45),(.8,1.15,.09),cream,.015)

# Restrained landscape, rather than a game island.
for x,y,s in [(-6.9,.5,1.9),(8.0,1.2,1.7),(-6.6,-1.7,.9),(7.6,-1.9,.8)]: plant(x,y,.40,s)
for k in range(7):
    x=-7.0+random.random()*.7; y=-1.0+random.random()*1.7
    sphere("Landscape limestone",(x,y,.47),(.22+random.random()*.18,.20,.14+random.random()*.18),stone)
ground=box("Studio ground",(0,0,-.10),(200,200,.08),ground_mat,.01)
ground.is_shadow_catcher=True
area("Large daylight softbox",(-7,-10,15),2200,10,(1,.89,.75),(0,0,3.5))
area("Front fill",(8,-9,8),1300,8,(.84,.91,1),(0,0,3.5))
area("Roof daylight",(0,5,14),2000,8,(1,.93,.82),(0,0,3))

camdata=bpy.data.cameras.new("Studio camera"); camera=bpy.data.objects.new("Studio camera",camdata); bpy.context.collection.objects.link(camera)
scene.camera=camera; camdata.type="ORTHO"; camdata.ortho_scale=17.4
overview=Vector((8,-35,13)); target=Vector((.5,0,3.9))
def camera_at(pos,look,scale):
    camera.location=pos; camera.rotation_euler=(Vector(look)-Vector(pos)).to_track_quat("-Z","Y").to_euler(); camdata.ortho_scale=scale
camera_at(overview,target,17.4)
bpy.ops.wm.save_as_mainfile(filepath=str(WORK/"studio.blend"))

def render(name,width,height,pos=overview,look=target,scale=17.4,samples=24):
    camera_at(pos,look,scale); scene.cycles.samples=samples
    scene.render.resolution_x=width; scene.render.resolution_y=height
    scene.render.filepath=str(WORK/(name+".png")); bpy.ops.render.render(write_still=True)
    from PIL import Image
    im=Image.open(WORK/(name+".png")); im.save(OUT/(name+".webp"),quality=92,method=6)
    print("ASSET",name,flush=True)

if "--preview" in sys.argv:
    render("proof",1100,720,samples=16)
    sys.exit(0)

render("overview",1920,1200,samples=32)
for i,(cx,z) in enumerate(zip(centers,bases)):
    look=Vector((cx,.15,z+1.05))
    render(f"room-{i}",1440,900,look+Vector((3,-15,4.6)),look,7.7,24)
for name,offset in [("left",(-11,-33,13)),("right",(14,-32,13))]:
    render(name,1920,1200,Vector(offset),target,17.4,24)
camera_at(overview,target,17.4)

# Optional Cycles diffuse light atlas: retain soft daylight in the live model.
# Glass, metals, glowing details, and articulated sculptures remain PBR meshes.
if "--bake" in sys.argv:
    static=[]
    for o in objects:
        if o.type not in {"MESH","CURVE"} or o.get("dynamic") or not o.data.materials: continue
        m=o.data.materials[0]
        if m in [glass,metal,gold] or o.name=="Studio ground": continue
        static.append(o)
    bpy.ops.object.select_all(action="DESELECT")
    for o in static: o.select_set(True)
    bpy.context.view_layer.objects.active=static[0]
    bpy.ops.object.convert(target="MESH")
    bpy.ops.object.join()
    baked=bpy.context.object; baked.name="Baked architectural daylight"
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=1.15,island_margin=.008,area_weight=.5)
    bpy.ops.object.mode_set(mode="OBJECT")
    atlas=bpy.data.images.new("Studio daylight atlas",width=4096,height=4096,alpha=False)
    for m in baked.data.materials:
        if not m or not m.use_nodes: continue
        node=m.node_tree.nodes.new("ShaderNodeTexImage"); node.image=atlas; m.node_tree.nodes.active=node
    scene.cycles.samples=24
    scene.render.bake.use_pass_direct=True; scene.render.bake.use_pass_indirect=True; scene.render.bake.use_pass_color=True
    scene.render.bake.margin=12
    bpy.ops.object.bake(type="DIFFUSE")
    atlas.filepath_raw=str(OUT/"daylight-atlas.jpg"); atlas.file_format="JPEG"; atlas.save()
    # Denoise the light texture in linear space, without changing mesh detail.
    # This avoids magnifying Cycles sampling grain during interactive room zooms.
    clean_scene=bpy.data.scenes.new("Light atlas denoising")
    clean_scene.render.engine="CYCLES"; clean_scene.cycles.samples=1
    clean_scene.render.threads_mode="FIXED"; clean_scene.render.threads=6
    clean_scene.render.resolution_x=4096; clean_scene.render.resolution_y=4096
    clean_scene.render.resolution_percentage=100
    clean_scene.view_settings.view_transform="Standard"; clean_scene.view_settings.look="None"
    clean_camera=bpy.data.objects.new("Atlas camera",bpy.data.cameras.new("Atlas camera"))
    clean_scene.collection.objects.link(clean_camera); clean_scene.camera=clean_camera
    clean_scene.use_nodes=True; cn=clean_scene.node_tree.nodes; cn.clear()
    source=cn.new("CompositorNodeImage"); source.image=atlas
    denoise=cn.new("CompositorNodeDenoise"); denoise.prefilter="ACCURATE"
    composite=cn.new("CompositorNodeComposite")
    clean_scene.node_tree.links.new(source.outputs["Image"],denoise.inputs["Image"])
    clean_scene.node_tree.links.new(denoise.outputs["Image"],composite.inputs["Image"])
    clean_scene.render.image_settings.file_format="JPEG"; clean_scene.render.image_settings.quality=95
    clean_scene.render.filepath=str(OUT/"daylight-atlas.jpg")
    bpy.ops.render.render(write_still=True,scene=clean_scene.name)
    atlas=bpy.data.images.load(str(OUT/"daylight-atlas.jpg"),check_existing=False)
    bpy.data.scenes.remove(clean_scene)
    bakedmat=bpy.data.materials.new("Baked daylight unlit"); bakedmat.use_nodes=True
    nd=bakedmat.node_tree.nodes; nd.clear(); output=nd.new("ShaderNodeOutputMaterial"); emit=nd.new("ShaderNodeEmission"); tex=nd.new("ShaderNodeTexImage"); tex.image=atlas
    bakedmat.node_tree.links.new(tex.outputs["Color"],emit.inputs["Color"]); bakedmat.node_tree.links.new(emit.outputs[0],output.inputs[0])
    baked.data.materials.clear(); baked.data.materials.append(bakedmat)
    for p in baked.data.polygons: p.material_index=0

# Merge repeated materials to keep the interactive model's draw calls bounded.
# The animated sculptures and selection outlines keep their own identities.
sculpture_groups={}
for group_name,prefixes,pivot in [
    ("Neural sculpture",("NeuralNode","NeuralConnection"),(-4.12,-.03,4.2)),
    ("Cloud sculpture",("CloudSculpture",),(-1.72,.5,1.96)),
]:
    parent=bpy.data.objects.new(group_name,None); bpy.context.collection.objects.link(parent); parent.location=pivot
    bpy.context.view_layer.update()
    for o in list(scene.objects):
        if o.type in {"MESH","CURVE"} and o.name.startswith(prefixes):
            matrix=o.matrix_world.copy(); o.parent=parent; o.matrix_world=matrix
    sculpture_groups[group_name]=parent
groups={}
for o in list(scene.objects):
    if o.type not in {"MESH","CURVE"} or o.name.startswith(("Studio ground","RoomFrame","Baked architectural")): continue
    key=(o.data.materials[0].name if o.data.materials else "none",o.parent.name if o.parent else "static")
    groups.setdefault(key,[]).append(o)
for (matname,parentname),parts in groups.items():
    bpy.ops.object.select_all(action="DESELECT")
    for o in parts: o.select_set(True)
    bpy.context.view_layer.objects.active=parts[0]
    bpy.ops.object.convert(target="MESH")
    if len(parts)>1: bpy.ops.object.join()
    bpy.context.object.name=matname+" / "+parentname

# Apply modifiers on export. Exclude giant studio ground and Blender-only lights.
bpy.ops.object.select_all(action="DESELECT")
for o in scene.objects:
    if o.type in {"MESH","CURVE","EMPTY"} and not o.name.startswith("Studio ground"): o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/"studio.glb"),export_format="GLB",use_selection=True,export_yup=True,export_extras=True,export_image_format="JPEG",export_materials="EXPORT")
print("EXPORTED", OUT/"studio.glb",flush=True)
