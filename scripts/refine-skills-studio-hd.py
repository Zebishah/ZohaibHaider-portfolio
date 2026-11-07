"""Quality-first refinement of the twelve-room studio with bounded-error packaging.

Uses the editable, pre-bake scene produced by build-skills-studio-v2.py --preview.
Four independent 4K lightmaps preserve room detail without one giant bake.
"""
import ast
import bpy
import json
import math
import random
import subprocess
from pathlib import Path
from mathutils import Vector

ROOT=Path(__file__).resolve().parents[1]
WORK=Path('/tmp/zohaib-portfolio-qa/studio-hd');WORK.mkdir(parents=True,exist_ok=True)
OUT=ROOT/'public/models/skills-studio-hd';OUT.mkdir(parents=True,exist_ok=True)
if '--render-only' not in __import__('sys').argv:
    resume='--resume' in __import__('sys').argv
    if resume:
        bpy.ops.wm.open_mainfile(filepath=str(WORK/'studio-refined.blend'))
        scene=bpy.context.scene
        metal=bpy.data.materials['Brushed aluminium'];gold=bpy.data.materials['Lime anodised aluminium'];glass=bpy.data.materials['Clear architectural glass'];steel=bpy.data.materials['Satin storage steel']
    else:
        source=Path('/tmp/zohaib-portfolio-qa/studio-v2/studio.blend')
        if not source.exists():
            subprocess.run([__import__('sys').executable,str(ROOT/'scripts/build-skills-studio-v2.py'),'--preview'],check=True)
        bpy.ops.wm.open_mainfile(filepath=str(source))
        scene=bpy.context.scene
        scene.render.threads_mode='FIXED';scene.render.threads=6
        scene.cycles.use_denoising=True;scene.cycles.max_bounces=8
        scene.view_settings.view_transform='AgX';scene.view_settings.look='AgX - Medium High Contrast'
        shared=ast.parse((ROOT/'scripts/build-skills-studio.py').read_text().split('# Building envelope:')[0])
        exec(compile(ast.Module(body=[n for n in shared.body if isinstance(n,ast.FunctionDef)],type_ignores=[]),'studio-craft-helpers','exec'))
        objects=[];room=None;current_skill=None
        _finish=finish
        def finish(o,name,mat,dynamic=False):
            o=_finish(o,name,mat,dynamic)
            if current_skill:o['skill']=current_skill
            return o

        def mat(name):return bpy.data.materials[name]
        stone=mat('Warm honed limestone');plaster=mat('Ivory mineral plaster');floor_mat=mat('Travertine')
        cream=mat('Porcelain');wood=mat('Walnut');wood_light=mat('Oak slats');black=mat('Graphite powder coat')
        metal=mat('Brushed aluminium');gold=mat('Lime anodised aluminium');glass=mat('Clear architectural glass')
        white_light=mat('Warm white LEDs');amber=mat('Lime status lights');green=mat('Plant leaves');stem=mat('Branches')
        terracotta=mat('Forest green enamel');leather=mat('Sand leather');screen=mat('Display glass')
        ui=mat('Interface ink');ui_light=mat('Interface paper')

        def tint(m,rgb,emission=None):
            p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*rgb,1);m.diffuse_color=(*rgb,1)
            if emission is not None:p.inputs['Emission Color'].default_value=(*rgb,1);p.inputs['Emission Strength'].default_value=emission
        tint(gold,(.43,.38,.26));gold.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.32
        tint(white_light,(.86,.82,.73),1.25);tint(amber,(.43,.57,.27),1.3)
        tint(ui,(.13,.24,.21),.35);tint(ui_light,(.67,.74,.68),.4)
        for light in bpy.data.lights:
            if light.name.startswith('Room light'):light.color=(1,.95,.85);light.energy=85
            elif light.type=='AREA':light.color=(1,.96,.90)
        scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.72,.70,.65,1)
        scene.world.node_tree.nodes['Background'].inputs[1].default_value=.5
        steel=material('Satin storage steel',(.27,.30,.29),.38,.65)

        def erase(prefixes):
            for o in list(scene.objects):
                if o.name.startswith(tuple(prefixes)):bpy.data.objects.remove(o,do_unlink=True)

        # Continuous slabs previously crossed the stairwell. Leave the entire atrium open.
        for o in scene.objects:
            if o.name.startswith('Continuous limestone slab'):
                o.location.x=.7 if o.location.z>10.2 else 0;o.dimensions.x=16.10 if o.location.z>10.2 else 13.98
        erase(['Stair roof'])
        erase(['Interior floor','Structural limestone column','Rear column'])
        for level in range(4):
            z=.59+level*2.45
            for x in [-6.91,-2.30,2.30,6.91]:
                box('Segmented structural column',(x,-1.32,z+1.12),(.14,.28,2.26),stone,.015)
                box('Segmented rear column',(x,1.58,z+1.12),(.13,.13,2.26),stone,.012)
            for cx in [-4.6,0,4.6]:box('Room floor',(cx,.1,z-.015),(4.44,3.12,.05),floor_mat,.008)

        # Closed storage bodies replace floating glowing rings, including in software 3D.
        erase(['Database glass','Database metal ring','Database green status band','Database core'])
        room=2;z=7.94;cx=4.6
        for tool,x,h in [('PostgreSQL',cx+.15,1.20),('MongoDB',cx+.92,1.6),('Redis',cx+1.67,1.32)]:
            current_skill=tool
            cylinder('Storage enclosure',(x,.65,z+h/2),.29,h,steel,64)
            for j in range(5):
                cylinder('Storage polished seam',(x,.65,z+.05+j*(h-.1)/4),.302,.025,metal,64)
            for zz in [z+.04,z+h-.04]:cylinder('Storage end cap',(x,.65,zz),.306,.055,metal,64)
            box('Storage status panel',(x,.351,z+h*.55),(.14,.014,.32),black,.025)
            for k in range(3):box('Storage status light',(x,.34,z+h*.55-.09+k*.09),(.07,.012,.018),amber,.004,True)
        current_skill=None;room=None

        # Front-facing fans, including hubs and real blades, instead of horizontal disks.
        erase(['GPU fan'])
        room=5;current_skill='PyTorch';cx=4.6;z=5.49
        for k in range(3):
            center=(cx+.8,.255,z+.30+k*.40)
            for name,r,depth,material_ in [('Fan housing',.165,.025,metal),('Fan recess',.142,.031,black),('Fan hub',.036,.045,metal)]:
                o=cylinder(name,center,r,depth,material_,48);o.rotation_euler.x=math.pi/2
            for j in range(7):
                a=j*math.tau/7
                line('GPU fan blade',[(center[0]+math.cos(a)*.04,.228,center[2]+math.sin(a)*.04),(center[0]+math.cos(a+.35)*.10,.225,center[2]+math.sin(a+.35)*.10),(center[0]+math.cos(a+.55)*.13,.228,center[2]+math.sin(a+.55)*.13)],.011,metal)
        current_skill=None;room=None

        # Make the curved technical sculptures smooth; leave the small botanical meshes alone.
        for o in list(scene.objects):
            if o.type=='MESH' and o.name.startswith('AI node'):
                sub=o.modifiers.new('Smooth sculpture silhouette','SUBSURF');sub.levels=1;sub.render_levels=1
        clouds=[o for o in scene.objects if o.type=='MESH' and o.name.startswith('Cloud volume')]
        if clouds:
            bpy.ops.object.select_all(action='DESELECT')
            for o in clouds:o.select_set(True)
            bpy.context.view_layer.objects.active=clouds[0]
            bpy.ops.object.convert(target='MESH');bpy.ops.object.join()
            cloud=bpy.context.object;cloud.name='Continuous cloud sculpture';cloud['room']=7;cloud['skill']='AWS Lambda';cloud['dynamic']=True
            bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
            voxel=cloud.modifiers.new('Seamless cloud volume','REMESH');voxel.mode='VOXEL';voxel.voxel_size=.025;voxel.use_smooth_shade=True
            smooth=cloud.modifiers.new('Cloud surface finish','SMOOTH');smooth.factor=.65;smooth.iterations=3

        # A real two-flight stair, with solid risers, supported flights, and connected landings.
        erase(['Spiral tread','Stair baluster','Spiral handrail','Stair central column','Stair landing'])
        for level in range(4):
            z=.59+level*2.45
            box('Connected floor landing',(7.76,-1.30,z-.045),(1.90,.64,.09),stone,.018)
            if level==3:continue
            rise=2.45/18;run=.19
            box('Intermediate stair landing',(7.82,1.13,z+1.225-.045),(1.56,.90,.09),stone,.018)
            for side in range(2):
                x=7.40 if side==0 else 8.24
                for step in range(9):
                    y=-1.03+(step+.5)*run if side==0 else .68-(step+.5)*run
                    top=z+(step+1)*rise if side==0 else z+1.225+(step+1)*rise
                    box('Solid stair riser',(x,y,top-rise/2),(.70,run+.002,rise),stone,.005)
                    box('Oak stair tread',(x,y,top+.01),(.72,run+.012,.026),wood_light,.007)
                    if step%2==0:
                        for edge in [-1,1]:
                            between('Stair baluster',(x+edge*.34,y,top+.015),(x+edge*.34,y,top+.82),.009,metal)
                a=Vector((x,-1.03,z-.07)) if side==0 else Vector((x,.68,z+1.225-.07))
                b=Vector((x,.68,z+1.225-.07)) if side==0 else Vector((x,-1.03,z+2.45-.07))
                beam=box('Continuous stair support',(a+b)/2,(.68,.11,(b-a).length),stone,.012);beam.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler()
                for edge in [-1,1]:between('Continuous stair handrail',tuple(a+Vector((edge*.34,0,.9))),tuple(b+Vector((edge*.34,0,.9))),.017,metal)
            line('Rear landing guardrail',[(7.05,1.55,z+2.04),(8.60,1.55,z+2.04),(8.60,.69,z+2.04)],.017,metal)

        # Apply dimensions and export modifiers before grouping; never collapse UV seams.
        for o in scene.objects:
            if o.type=='MESH' and o.name.startswith(('Storage enclosure','Storage polished','Storage end cap','Fan housing','Fan recess','Fan hub')):
                for polygon in o.data.polygons:polygon.use_smooth=len(polygon.vertices)==4
        bpy.ops.object.select_all(action='DESELECT')
        for o in scene.objects:
            if o.type in {'MESH','CURVE','FONT'} and not o.name.startswith('Studio ground'):o.select_set(True)
        bpy.context.view_layer.objects.active=next(o for o in scene.objects if o.select_get())
        bpy.ops.object.convert(target='MESH')
        bpy.context.view_layer.update()

        layout=json.loads((ROOT/'public/models/skills-studio-v2/layout.json').read_text())
        for h in layout['hotspots']:
            parts=[o for o in scene.objects if o.type=='MESH' and o.get('room')==h['room'] and o.get('skill')==h['tool']]
            if not parts:continue
            coords=[o.matrix_world@Vector(v) for o in parts for v in o.bound_box]
            lo=Vector(tuple(min(v[d] for v in coords) for d in range(3)));hi=Vector(tuple(max(v[d] for v in coords) for d in range(3)));c=(lo+hi)/2;s=hi-lo
            h['center']=[round(c.x,4),round(c.z,4),round(-c.y,4)];h['size']=[round(max(s.x,.14),4),round(max(s.z,.14),4),round(max(s.y,.14),4)]
        (OUT/'layout.json').write_text(json.dumps(layout,indent=2))
        bpy.ops.wm.save_as_mainfile(filepath=str(WORK/'studio-refined.blend'))
        scene.cycles.samples=16;scene.render.resolution_x=1200;scene.render.resolution_y=800;scene.render.resolution_percentage=100
        scene.render.filepath=str(WORK/'proof.png');scene.render.image_settings.file_format='PNG'
        bpy.ops.render.render(write_still=True)
        print('REFINED GEOMETRY PROOF READY',flush=True)


    def is_emitting(m):
        if not m or not m.use_nodes:return False
        p=m.node_tree.nodes.get('Principled BSDF')
        return p is not None and p.inputs['Emission Strength'].default_value>0

    groups=[[] for _ in range(4)]
    for o in list(scene.objects):
        if o.type!='MESH' or o.name.startswith(('Studio ground','RoomFrame')) or o.get('dynamic'):continue
        m=o.data.materials[0] if o.data.materials else None
        if not m or m in [metal,gold,glass,steel] or is_emitting(m):continue
        if o.get('room') is not None:level=3-int(o['room'])//3
        else:level=max(0,min(3,int((o.matrix_world.translation.z+.10)/2.45)))
        groups[level].append(o)

    for level,parts in enumerate(groups):
        bpy.ops.object.select_all(action='DESELECT')
        for o in parts:o.select_set(True)
        bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join()
        baked=bpy.context.object;baked.name=f'Baked architectural floor {level}'
        bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.uv.smart_project(angle_limit=1.15,island_margin=.003,area_weight=.75)
        bpy.ops.object.mode_set(mode='OBJECT')
        cached=OUT/f'floor-{level}-4k.jpg'
        rebake=not (resume and cached.exists())
        if rebake:
            image=bpy.data.images.new(f'Floor {level} 4K HDR lighting',width=4096,height=4096,alpha=False,float_buffer=True)
            for m in baked.data.materials:
                if not m or not m.use_nodes:continue
                node=m.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;m.node_tree.nodes.active=node
            scene.cycles.samples=16;scene.render.bake.margin=24
            scene.render.bake.use_pass_direct=True;scene.render.bake.use_pass_indirect=True;scene.render.bake.use_pass_color=True
            bpy.ops.object.bake(type='DIFFUSE')
            clean=bpy.data.scenes.new('HDR lightmap finishing');clean.render.engine='CYCLES';clean.cycles.samples=1
            clean.render.threads_mode='FIXED';clean.render.threads=6;clean.render.resolution_x=4096;clean.render.resolution_y=4096;clean.render.resolution_percentage=100
            clean.view_settings.view_transform='AgX';clean.view_settings.look='AgX - Medium High Contrast'
            camera=bpy.data.objects.new('Lightmap camera',bpy.data.cameras.new('Lightmap camera'));clean.collection.objects.link(camera);clean.camera=camera
            clean.use_nodes=True;nodes=clean.node_tree.nodes;nodes.clear()
            src=nodes.new('CompositorNodeImage');src.image=image
            denoise=nodes.new('CompositorNodeDenoise');denoise.prefilter='ACCURATE'
            if hasattr(denoise,'use_hdr'):denoise.use_hdr=True
            result=nodes.new('CompositorNodeComposite');clean.node_tree.links.new(src.outputs['Image'],denoise.inputs['Image']);clean.node_tree.links.new(denoise.outputs['Image'],result.inputs['Image'])
            clean.render.image_settings.file_format='JPEG';clean.render.image_settings.quality=97;clean.render.filepath=str(OUT/f'floor-{level}-4k.jpg')
            bpy.ops.render.render(write_still=True,scene=clean.name)

        finished=bpy.data.images.load(str(cached),check_existing=False)
        bakedmat=bpy.data.materials.new(f'Baked daylight floor {level}');bakedmat.use_nodes=True
        n=bakedmat.node_tree.nodes;n.clear();output=n.new('ShaderNodeOutputMaterial');emit=n.new('ShaderNodeEmission');tex=n.new('ShaderNodeTexImage');tex.image=finished
        bakedmat.node_tree.links.new(tex.outputs['Color'],emit.inputs['Color']);bakedmat.node_tree.links.new(emit.outputs[0],output.inputs[0])
        baked.data.materials.clear();baked.data.materials.append(bakedmat)
        for p in baked.data.polygons:p.material_index=0
        if rebake:
            bpy.data.scenes.remove(clean)
            for m in bpy.data.materials:
                if m.use_nodes:
                    for node in list(m.node_tree.nodes):
                        if node.type=='TEX_IMAGE' and node.image==image:m.node_tree.nodes.remove(node)
            bpy.data.images.remove(image)

        print('FINISHED 4K FLOOR',level,flush=True)

    groups={}
    for o in list(scene.objects):
        if o.type!='MESH' or o.name.startswith(('Studio ground','RoomFrame','Baked architectural')):continue
        key=(o.data.materials[0].name if o.data.materials else 'none',o.get('room',-1),o.get('skill',''))
        groups.setdefault(key,[]).append(o)
    for key,parts in groups.items():
        bpy.ops.object.select_all(action='DESELECT')
        for o in parts:o.select_set(True)
        bpy.context.view_layer.objects.active=parts[0]
        if len(parts)>1:bpy.ops.object.join()
        bpy.context.object.name=str(key)
    bpy.ops.wm.save_as_mainfile(filepath=str(WORK/'studio-lit.blend'))
    bpy.ops.object.select_all(action='DESELECT')
    for o in scene.objects:
        if o.type=='MESH' and not o.name.startswith('Studio ground'):o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(WORK/'studio-unreduced.glb'),export_format='GLB',use_selection=True,export_yup=True,export_extras=True,export_image_format='JPEG',export_materials='EXPORT')
    subprocess.run([__import__('sys').executable,str(ROOT/'scripts/optimize-skills-studio.py'),str(WORK/'studio-unreduced.glb')],check=True)
    print('HD MODEL EXPORTED',flush=True)


# A genuine 3840-pixel reference, rendered from the same geometry and lighting.
bpy.ops.wm.open_mainfile(filepath=str(WORK/'studio-refined.blend'))
scene=bpy.context.scene
scene.camera=bpy.data.objects.get('Studio camera');scene.cycles.samples=16
scene.render.resolution_x=3840;scene.render.resolution_y=2560;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.filepath=str(OUT/'studio-4k.png')
bpy.ops.render.render(write_still=True)
from PIL import Image
Image.open(OUT/'studio-4k.png').save(OUT/'overview.webp',quality=95,method=6)
print('4K OVERVIEW FINISHED',flush=True)
