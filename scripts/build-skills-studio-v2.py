"""Twelve-room forest-and-cream studio; shares the original architectural craft helpers."""
from pathlib import Path
import json
import sys

SOURCE = Path(__file__).with_name("build-skills-studio.py").read_text()
exec(SOURCE[:SOURCE.index("# Building envelope:")])
OUT = ROOT / "public/models/skills-studio-v2"
WORK = Path("/tmp/zohaib-portfolio-qa/studio-v2")
OUT.mkdir(parents=True, exist_ok=True); WORK.mkdir(parents=True, exist_ok=True)
room_names=["Frontend & UI","Backend & APIs","Databases","AI Agents & Models","Search & RAG","ML & Fine-tuning","Voice AI","Cloud & DevOps","Automation","Testing & Quality","Payments & Fintech","Security & Systems"]
centers=[-4.6,0,4.6]*4
bases=[.59+(3-i//3)*2.45 for i in range(12)]

def tint(mat,rgb):
    mat.diffuse_color=(*rgb,1)
    p=mat.node_tree.nodes.get("Principled BSDF"); p.inputs["Base Color"].default_value=(*rgb,1)
    if p.inputs["Emission Strength"].default_value>0: p.inputs["Emission Color"].default_value=(*rgb,1)

tint(terracotta,(.008,.070,.041)); terracotta.name="Forest green enamel"
tint(gold,(.35,.46,.11)); gold.name="Lime anodised aluminium"
tint(amber,(.63,.80,.22)); amber.name="Lime status lights"
tint(ui,(.09,.24,.17)); tint(ui_light,(.68,.77,.52))
tint(white_light,(.85,.94,.70)); tint(stone,(.72,.66,.55))
for mat in [plaster,stone,floor_mat,cream,wood,wood_light,leather,terracotta]:
    for node in mat.node_tree.nodes:
        if node.type=="BUMP": node.inputs["Strength"].default_value *= .25

_finish=finish
current_skill=None
def finish(o,name,mat,dynamic=False):
    o=_finish(o,name,mat,dynamic)
    if current_skill: o["skill"]=current_skill
    return o

room=None
box("Foundation lower",(.7,0,.12),(17.8,5.2,.24),stone,.07)
box("Foundation upper",(.7,.08,.32),(17.3,4.75,.18),cream,.04)
for zz in [.48,2.93,5.38,7.83,10.28]:
    box("Continuous limestone slab",(.7,.08,zz),(16.6,3.64,.19),stone,.025)
    for cx in [-4.6,0,4.6]: box("Forest fascia",(cx,-1.76,zz),(4.44,.045,.16),terracotta,.009)
for xx in [-6.91,-2.30,2.30,6.91]:
    box("Structural limestone column",(xx,-1.32,5.39),(.14,.28,9.82),stone,.02)
    box("Rear column",(xx,1.58,5.39),(.13,.13,9.82),stone,.015)
for floor in range(4):
    z=.59+floor*2.45
    box("Interior floor",(0,.1,z-.01),(13.65,3.12,.05),floor_mat,.005)
    for xx in [-2.3,2.3]: box("Room partition",(xx,.25,z+1.12),(.12,2.9,2.24),plaster,.012)
    box("Left glazing",(-6.91,.2,z+1.13),(.02,2.9,2.18),glass,.003,True)
    for yy in [-1.25,-.2,1.35]: box("Glass mullion",(-6.92,yy,z+1.13),(.035,.035,2.2),black,.005)

def rack(x,y,z):
    box("Server rack",(x,y,z+.88),(.67,.66,1.76),black,.025)
    for j in range(9):
        box("Server unit",(x,y-.34,z+.13+j*.18),(.56,.03,.14),black,.008)
        for k in range(5): box("Rack vent",(x-.21+k*.067,y-.362,z+.13+j*.18),(.025,.013,.065),metal,.002)
        box("Rack health LED",(x+.20,y-.38,z+.15+j*.18),(.035,.012,.025),amber,.004,True)

def core(x,y,z,h=1.4):
    cylinder("Database glass",(x,y,z+h/2+.05),.30,h,glass,dynamic=True)
    for j in range(5):
        cylinder("Database metal ring",(x,y,z+.07+j*(h-.1)/4),.32,.065,metal)
        cylinder("Database green status band",(x,y,z+.11+j*(h-.1)/4),.28,.025,amber,dynamic=True)
    cylinder("Database core",(x,y,z+h/2),.08,h,white_light,dynamic=True)

def neural(x,y,z,scale=1):
    cylinder("AI pedestal",(x,y,z+.16),.48,.32,cream)
    pts=[(x+math.cos(k*2.399)*.54*scale,y+math.sin(k*2.399)*.33*scale,z+.65+k*.105*scale) for k in range(10)]
    for k,p in enumerate(pts):
        sphere("AI node",p,(.08,.08,.08),cream,True)
        for j in [(k+1)%10,(k+3)%10]: between("AI edge",p,pts[j],.012,gold,True)

def robot(x,y,z):
    box("Automation plinth",(x,y,z+.19),(.62,.62,.38),cream,.035)
    pts=[(x,y,z+.4),(x-.12,y,z+.98),(x+.42,y,z+1.38),(x+.78,y,z+1.04)]
    for a,b in zip(pts,pts[1:]):
        v=Vector(b)-Vector(a); o=box("Robot link",(Vector(a)+Vector(b))/2,(.15,.18,v.length),cream,.055,True); o.rotation_euler=v.to_track_quat("Z","Y").to_euler()
    for p in pts:
        o=cylinder("Robot joint",p,.12,.22,terracotta,dynamic=True); o.rotation_euler.x=math.pi/2
    for side in [-1,1]: between("Gripper",(pts[-1][0]+side*.06,y,pts[-1][2]),(pts[-1][0]+side*.09,y,pts[-1][2]-.21),.022,metal,True)

def cloud(x,y,z):
    cylinder("Cloud platform",(x,y,z+.35),.40,.70,metal)
    for dx,dz,r in [(-.40,0,.23),(-.20,.10,.30),(.10,.18,.33),(.37,.06,.25),(.52,-.04,.18),(0,-.08,.27)]:
        sphere("Cloud volume",(x+dx,y,z+1.35+dz),(r,.19,r*.8),white_light,True)

def text(name,label,loc,size=.12):
    curve=bpy.data.curves.new(name,"FONT");curve.body=label;curve.size=size;curve.align_x="CENTER";curve.extrude=.001
    o=bpy.data.objects.new(name,curve);bpy.context.collection.objects.link(o);o.location=loc;o.rotation_euler.x=math.pi/2
    # Text becomes actual 3D geometry on export.
    return finish(o,name,cream)

def screen_desk(x,y,z,kind="code",width=1.75):
    desk(x,y,z,width); monitor(x-.08,y+.15,z+.83,kind,.82); chair(x+.22,y-.75,z)

def technical(tool,fn):
    global current_skill
    current_skill=tool; fn(); current_skill=None

for i,(cx,z) in enumerate(zip(centers,bases)):
    room=i
    box("Room back wall",(cx,1.60,z+1.12),(4.44,.13,2.24),terracotta if i in [3,4,5] else plaster,.01)
    if i in [0,6,7,8,9,10,11]:
        for k in range(25): box("Oak acoustic slat",(cx-2+k*.165,1.51,z+1.12),(.03,.035,2.15),wood_light,.004)
    box("Room ceiling",(cx,.03,z+2.17),(4.4,3.1,.045),plaster,.008)
    box("Lime cove light",(cx,1.42,z+2.08),(4.13,.02,.02),white_light,.004,True)
    box("Track rail",(cx,-.53,z+2.08),(3.8,.03,.03),black,.005)
    for xx in [cx-1.35,cx,cx+1.35]:
        cylinder("Track light",(xx,-.53,z+2),.038,.12,black)
        cylinder("Track lens",(xx,-.53,z+1.935),.03,.008,white_light,dynamic=True)
    area("Room light",(cx,-.3,z+2.04),75,2.8,(.89,1,.78),(cx,.4,z+.2))
    plant(cx-1.92,1.05,z,.7); plant(cx+1.92,1.05,z,.6)
    for a,b in [((cx-2.14,-1.47,z+.03),(cx+2.14,-1.47,z+.03)),((cx-2.14,-1.47,z+2.12),(cx+2.14,-1.47,z+2.12)),((cx-2.14,-1.47,z+.03),(cx-2.14,-1.47,z+2.12)),((cx+2.14,-1.47,z+.03),(cx+2.14,-1.47,z+2.12))]: between(f"RoomFrame_{i}",a,b,.01,amber if i==3 else stone,True)
    if i==0:
        technical("React",lambda:screen_desk(cx-.65,.48,z,"web",2.0))
        current_skill="shadcn/ui";wall_panels(cx-.35,z);current_skill=None
    elif i==1:
        technical("FastAPI",lambda:screen_desk(cx-1,.45,z,"code",1.4))
        technical("Node.js",lambda:rack(cx+.7,.8,z));technical("REST APIs",lambda:rack(cx+1.48,.8,z))
    elif i==2:
        technical("SQLAlchemy",lambda:screen_desk(cx-1.2,.45,z,"code",1.2))
        technical("PostgreSQL",lambda:core(cx+.15,.65,z,1.20));technical("MongoDB",lambda:core(cx+.92,.65,z,1.6));technical("Redis",lambda:core(cx+1.67,.65,z,1.32))
    elif i==3:
        technical("LangGraph",lambda:neural(cx-.95,.1,z))
        technical("Tool Calling",lambda:screen_desk(cx+1,.58,z,"code",1.55))
    elif i==4:
        technical("RAG",lambda:screen_desk(cx-1,.48,z,"search",1.5))
        current_skill="Qdrant"
        for col in range(3):
            for row in range(4):
                box("Vector embedding",(cx+.35+col*.48,.65,z+.22+row*.38),(.32,.34,.25),cream if row%2 else gold,.035)
        current_skill="Semantic Search"
        for k in range(4): box("Knowledge document",(cx+.75+k*.12,.0,z+.32+k*.06),(.65,.46,.06),cream,.01)
        current_skill=None
    elif i==5:
        technical("LoRA",lambda:screen_desk(cx-.95,.48,z,"code",1.55))
        current_skill="PyTorch"
        box("Training GPU enclosure",(cx+.8,.65,z+.7),(1.15,.70,1.4),black,.04)
        for k in range(3):
            cylinder("GPU fan",(cx+.8,.27,z+.30+k*.40),.16,.04,metal)
            for j in range(5): between("Training trace",(cx+.3+j*.22,.25,z+1.22),(cx+.3+j*.22,.25,z+1.36),.012,amber,True)
        current_skill="QLoRA";box("Adapter cartridge",(cx+1.65,.40,z+.35),(.35,.50,.65),terracotta,.025);current_skill=None
    elif i==6:
        technical("Groq Audio API",lambda:screen_desk(cx+.75,.50,z,"code",1.75))
        current_skill="Whisper"
        cylinder("Microphone stand",(cx-1,.1,z+.48),.022,.95,metal)
        cylinder("Microphone base",(cx-1,.1,z+.04),.25,.08,black)
        mic=box("Studio microphone",(cx-1,.1,z+1.15),(.25,.25,.55),black,.12)
        for k in range(7):box("Microphone grille",(cx-1,-.035,z+.96+k*.06),(.22,.012,.018),metal,.003)
        current_skill="Text-to-Speech"
        for k in range(16):box("Audio waveform",(cx-1.75+k*.12,1.42,z+1.40),(.055,.04,.15+abs(math.sin(k*.8))*.65),amber,.015,True)
        current_skill=None
    elif i==7:
        technical("AWS Lambda",lambda:cloud(cx+.85,.65,z))
        technical("GitHub Actions",lambda:screen_desk(cx-1.1,.48,z,"cloud",1.4))
        current_skill="Docker"
        for k in range(3):
            box("Container deployment",(cx+.9,.22,z+.15+k*.22),(.90,.70,.19),terracotta,.015)
            for j in range(7):box("Container rib",(cx+.52+j*.12,-.14,z+.15+k*.22),(.02,.025,.16),gold,.003)
        current_skill=None
    elif i==8:
        technical("n8n",lambda:robot(cx-1,.15,z))
        technical("MCP",lambda:screen_desk(cx+1,.48,z,"code",1.6))
        current_skill="Inngest"
        for k in range(4):
            box("Workflow stage",(cx-1.6+k*.9,1.40,z+1.73),(.50,.05,.28),cream,.025)
            if k<3:between("Workflow event",(cx-1.34+k*.9,1.35,z+1.73),(cx-1.0+k*.9,1.35,z+1.73),.018,amber,True)
        current_skill=None
    elif i==9:
        technical("pytest",lambda:screen_desk(cx+.75,.48,z,"check",1.9))
        current_skill="Playwright"
        for k in range(3):
            box("Browser test device",(cx-1.45+k*.50,.3,z+.8),(.37,.16,.65),black,.04)
            box("Device display",(cx-1.45+k*.50,.21,z+.8),(.29,.008,.5),ui_light,.012)
            cylinder("Test fixture",(cx-1.45+k*.5,.3,z+.24),.15,.48,cream)
        current_skill=None
    elif i==10:
        technical("Stripe Connect",lambda:screen_desk(cx-.9,.48,z,"code",1.55))
        current_skill="Payouts"
        for k in range(4):
            cylinder("Transaction ledger",(cx+.7,.4,z+.15+k*.11),.4,.08,gold)
        current_skill="Stripe"
        box("Payment terminal",(cx+1.3,.45,z+.73),(.65,.55,1.10),terracotta,.09)
        box("Payment screen",(cx+1.3,.16,z+1.03),(.48,.035,.34),ui_light,.035)
        box("Card insertion",(cx+1.3,.15,z+.62),(.40,.03,.04),black,.005)
        current_skill=None
    elif i==11:
        technical("System Design",lambda:screen_desk(cx+1,.48,z,"web",1.6))
        current_skill="OAuth 2.0"
        cylinder("Security pedestal",(cx-1,.2,z+.22),.48,.44,cream)
        box("Identity lock",(cx-1,.2,z+.88),(.85,.32,.70),terracotta,.10)
        line("Lock shackle",[(cx-1+.30*math.cos(k*math.pi/24),.2,z+1.20+.4*math.sin(k*math.pi/24)) for k in range(25)],.065,metal)
        current_skill="RBAC"
        for k in range(3):box("Access policy",(cx-1.5+k*.46,1.42,z+1.72),(.34,.04,.30),cream,.035)
        current_skill=None

room=None
sx,sy=7.78,.10
for k in range(54):
    a=k*math.tau/18;z=.60+k*(7.35/54);verts=[]
    for zz in [z-.035,z+.035]:
        for r,a2 in [(.12,a),(.78,a),(.78,a+math.tau/18),(.12,a+math.tau/18)]:verts.append((sx+r*math.cos(a2),sy+r*math.sin(a2),zz))
    mesh=bpy.data.meshes.new("Step");mesh.from_pydata(verts,[],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]);mesh.update()
    o=bpy.data.objects.new("Spiral tread",mesh);bpy.context.collection.objects.link(o);finish(o,o.name,cream)
    if k%3==0:between("Stair baluster",(sx+.76*math.cos(a),sy+.76*math.sin(a),z),(sx+.76*math.cos(a),sy+.76*math.sin(a),z+.78),.008,metal)
line("Spiral handrail",[(sx+.77*math.cos(k*math.tau/72),sy+.77*math.sin(k*math.tau/72),.60+k*7.35/216+.82) for k in range(217)],.018,gold)
cylinder("Stair central column",(sx,sy,4.28),.045,7.35,metal)
for xx in [6.95,8.66]:
    box("Stair glass",(xx,.08,5.40),(.02,3.5,9.78),glass,.003,True)
    for yy in [-1.64,1.80]:box("Stair frame",(xx,yy,5.40),(.04,.04,9.82),black,.006)
box("Stair front glass",(7.8,-1.65,5.40),(1.7,.018,9.78),glass,.002,True)
box("Stair roof",(7.8,.08,10.3),(1.95,3.7,.17),stone,.02)
for i in range(4):box("Stair landing",(7.18,-.85,.60+i*2.45),(.8,1.15,.09),cream,.015)
for x,y,s in [(-7.6,.5,1.7),(9.1,1.2,1.5),(-7.4,-1.7,.8),(8.8,-1.9,.7)]:plant(x,y,.4,s)
ground=box("Studio ground",(0,0,-.1),(200,200,.08),ground_mat,.01);ground.is_shadow_catcher=True
area("Daylight",(-7,-10,17),2500,12,(1,.94,.83),(0,0,4.8))
area("Front fill",(9,-10,10),1500,10,(.91,1,.88),(0,0,4.8))
area("Roof daylight",(0,5,16),2200,10,(1,.96,.88),(0,0,4))

bpy.context.view_layer.update()
hotspots=[]
for i in range(12):
    tools=sorted(set(o.get("skill") for o in objects if o.get("room")==i and o.get("skill")))
    for tool in tools:
        parts=[o for o in objects if o.get("room")==i and o.get("skill")==tool]
        coords=[o.matrix_world@Vector(v) for o in parts for v in o.bound_box]
        lo=Vector(tuple(min(v[d] for v in coords) for d in range(3)));hi=Vector(tuple(max(v[d] for v in coords) for d in range(3)))
        c=(lo+hi)/2;s=hi-lo
        hotspots.append({"room":i,"tool":tool,"label":tool+" — "+room_names[i],"center":[round(c.x,4),round(c.z,4),round(-c.y,4)],"size":[round(max(s.x,.14),4),round(max(s.z,.14),4),round(max(s.y,.14),4)]})
(OUT/"layout.json").write_text(json.dumps({"rooms":room_names,"hotspots":hotspots},indent=2))

camdata=bpy.data.cameras.new("Studio camera");camera=bpy.data.objects.new("Studio camera",camdata);bpy.context.collection.objects.link(camera);scene.camera=camera;camdata.type="ORTHO"
overview=Vector((8.2,-40,16.1));target=Vector((.7,0,5.05))
def camera_at(pos,look,scale):
    camera.location=pos;camera.rotation_euler=(Vector(look)-Vector(pos)).to_track_quat("-Z","Y").to_euler();camdata.ortho_scale=scale
camera_at(overview,target,20.7)
bpy.ops.wm.save_as_mainfile(filepath=str(WORK/"studio.blend"))
def render(name,width,height,pos=overview,look=target,scale=20.7,samples=12):
    camera_at(pos,look,scale);scene.cycles.samples=samples;scene.render.resolution_x=width;scene.render.resolution_y=height
    scene.render.filepath=str(WORK/(name+".png"));bpy.ops.render.render(write_still=True)
    from PIL import Image
    Image.open(WORK/(name+".png")).save(OUT/(name+".webp"),quality=91,method=6)
    print("ASSET",name,flush=True)

render("overview",1536,1024,samples=16)
if "--preview" in sys.argv:sys.exit(0)
# Bake before extra stills: the interactive experience is the primary deliverable.
bake=SOURCE[SOURCE.index("# Optional Cycles diffuse light atlas"):SOURCE.index("# Merge repeated materials")]
exec(bake)
# Preserve each technical object's identity, and reduce geometry without flattening it.
groups={}
for o in list(scene.objects):
    if o.type not in {"MESH","CURVE","FONT"} or o.name.startswith(("Studio ground","RoomFrame","Baked architectural")):continue
    key=(o.data.materials[0].name if o.data.materials else "none",o.get("room",-1),o.get("skill",""))
    groups.setdefault(key,[]).append(o)
for key,parts in groups.items():
    bpy.ops.object.select_all(action="DESELECT")
    for o in parts:o.select_set(True)
    bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.convert(target="MESH")
    if len(parts)>1:bpy.ops.object.join()
    bpy.context.object.name=str(key)
for o in list(scene.objects):
    if o.type=="MESH" and not o.name.startswith("Studio ground") and len(o.data.polygons)>400:
        dec=o.modifiers.new("Interactive geometry budget","DECIMATE");dec.ratio=.50;dec.use_collapse_triangulate=True
bpy.ops.object.select_all(action="DESELECT")
for o in scene.objects:
    if o.type in {"MESH","CURVE","FONT"} and not o.name.startswith("Studio ground"):o.select_set(True)
source_model=WORK/"studio-source.glb"
bpy.ops.export_scene.gltf(filepath=str(source_model),export_format="GLB",use_selection=True,export_yup=True,export_extras=True,export_image_format="JPEG",export_materials="EXPORT")
import subprocess
subprocess.run(["npx","--yes","gltfpack@1.3.0","-i",str(source_model),"-o",str(OUT/"studio.glb"),"-cc","-si","0.55","-se","0.002","-sp","-kn","-km","-ke"],check=True)
print("MODEL READY",flush=True)
