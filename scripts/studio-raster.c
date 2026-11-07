/* Genuine depth-buffered 3D renderer for browsers without WebGL. No image carousel.
 * Build: clang --target=wasm32 -O3 -nostdlib -Wl,--no-entry -Wl,--export-all
 *        -Wl,--export-memory -Wl,--initial-memory=67108864 -o public/models/studio-raster.wasm scripts/studio-raster.c
 */
typedef unsigned int u32;
static float minf(float a,float b){return a<b?a:b;}
static float maxf(float a,float b){return a>b?a:b;}
static int clampi(int v,int a,int b){return v<a?a:v>b?b:v;}

void draw(int width,int height,int nv,int nt,float *vertices,u32 *triangles,
          float *matrix,float *projected,u32 *pixels,float *depth,u32 *ids,
          u32 *texture,int tw,int th,int quality,int selected) {
  for(int i=0;i<width*height;i++){pixels[i]=0;depth[i]=1.0e30f;ids[i]=0;}
  for(int i=0;i<nv;i++){
    float *v=vertices+i*5,*p=projected+i*4;
    float w=matrix[3]*v[0]+matrix[7]*v[1]+matrix[11]*v[2]+matrix[15];
    float iw=w>0?1.0f/w:0;
    p[0]=((matrix[0]*v[0]+matrix[4]*v[1]+matrix[8]*v[2]+matrix[12])*iw*.5f+.5f)*width;
    p[1]=(.5f-(matrix[1]*v[0]+matrix[5]*v[1]+matrix[9]*v[2]+matrix[13])*iw*.5f)*height;
    p[2]=(matrix[2]*v[0]+matrix[6]*v[1]+matrix[10]*v[2]+matrix[14])*iw;
    p[3]=iw;
  }
  for(int i=0;i<nt;i++){
    u32 *t=triangles+i*6; float *a=projected+t[0]*4,*b=projected+t[1]*4,*c=projected+t[2]*4;
    if(a[3]<=0||b[3]<=0||c[3]<=0)continue;
    int x0=clampi((int)minf(a[0],minf(b[0],c[0])),0,width-1);
    int x1=clampi((int)maxf(a[0],maxf(b[0],c[0]))+1,0,width-1);
    int y0=clampi((int)minf(a[1],minf(b[1],c[1])),0,height-1);
    int y1=clampi((int)maxf(a[1],maxf(b[1],c[1]))+1,0,height-1);
    float den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);
    if(den<.001f&&den>-.001f)continue;
    float inv=1.f/den,adx=(b[1]-c[1])*inv,ady=(c[0]-b[0])*inv;
    float bdx=(c[1]-a[1])*inv,bdy=(a[0]-c[0])*inv;
    float ar=((b[1]-c[1])*(x0+.5f-c[0])+(c[0]-b[0])*(y0+.5f-c[1]))*inv;
    float br=((c[1]-a[1])*(x0+.5f-c[0])+(a[0]-c[0])*(y0+.5f-c[1]))*inv;
    float *va=vertices+t[0]*5,*vb=vertices+t[1]*5,*vc=vertices+t[2]*5;
    for(int y=y0;y<=y1;y++,ar+=ady,br+=bdy){
      float aa=ar,bb=br;int p=y*width+x0;
      for(int x=x0;x<=x1;x++,p++,aa+=adx,bb+=bdx){
        float cc=1.f-aa-bb;if(aa<-.0001f||bb<-.0001f||cc<-.0001f)continue;
        float z=aa*a[2]+bb*b[2]+cc*c[2];if(z>=depth[p])continue;
        u32 color=t[3];
        if(t[4]){
          float iw=aa*a[3]+bb*b[3]+cc*c[3];
          float u=(aa*va[3]*a[3]+bb*vb[3]*b[3]+cc*vc[3]*c[3])/iw;
          float v=(aa*va[4]*a[3]+bb*vb[4]*b[3]+cc*vc[4]*c[3])/iw;
          float fx=u*(tw-1),fy=v*(th-1);
          int tx=clampi((int)fx,0,tw-1),ty=clampi((int)fy,0,th-1);
          color=texture[ty*tw+tx];
          if(quality){
            int tx1=tx+1<tw?tx+1:tx,ty1=ty+1<th?ty+1:ty;
            float rx=fx-tx,ry=fy-ty;rx=maxf(0,minf(1,rx));ry=maxf(0,minf(1,ry));
            u32 q=texture[ty*tw+tx1],r=texture[ty1*tw+tx],s=texture[ty1*tw+tx1],out=0xff000000;
            for(int ch=0;ch<3;ch++){
              float top=((color>>(ch*8))&255)*(1-rx)+((q>>(ch*8))&255)*rx;
              float bot=((r>>(ch*8))&255)*(1-rx)+((s>>(ch*8))&255)*rx;
              out|=((u32)(top*(1-ry)+bot*ry))<<(ch*8);
            }color=out;
          }
        }
        pixels[p]=color|0xff000000;depth[p]=z;
        u32 id=t[5];
        if(id<100){
          /* A large floor/wall triangle can cross several rooms. Pick the room
             under this pixel, rather than the room at the triangle's centre. */
          float iw=aa*a[3]+bb*b[3]+cc*c[3];
          float wx=(aa*va[0]*a[3]+bb*vb[0]*b[3]+cc*vc[0]*c[3])/iw;
          float wy=(aa*va[1]*a[3]+bb*vb[1]*b[3]+cc*vc[1]*c[3])/iw;
          if(wx>=-6.85f&&wx<=6.85f&&wy>=.48f&&wy<=10.25f){
            int floor=clampi((int)((wy-.48f)/2.45f),0,3);
            int col=clampi((int)((wx+6.9f)/4.6f),0,2);
            id=1+(3-floor)*3+col;
          }else id=0;
        }
        ids[p]=id;
      }
    }
  }
}
