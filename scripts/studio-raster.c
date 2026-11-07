/* Depth-buffered software 3D. Incremental batches allow stale 4K frames to be cancelled. */
typedef unsigned int u32;
static float minf(float a,float b){return a<b?a:b;}
static float maxf(float a,float b){return a>b?a:b;}
static int clampi(int v,int a,int b){return v<a?a:v>b?b:v;}
static int floori(float v){int i=(int)v;return v<i?i-1:i;}
static u32 mixcolor(u32 a,u32 b,float amount){
 u32 weight=(u32)(amount*256),other=256-weight;
 u32 rb=(((a&0x00ff00ff)*other+(b&0x00ff00ff)*weight)>>8)&0x00ff00ff;
 u32 g=(((a&0x0000ff00)*other+(b&0x0000ff00)*weight)>>8)&0x0000ff00;
 return 0xff000000|rb|g;
}
static u32 sample(u32 *texture,int size,float u,float v){
 float fx=u*size-.5,fy=v*size-.5;int ix=floori(fx),iy=floori(fy);
 int x0=clampi(ix,0,size-1),y0=clampi(iy,0,size-1),x1=clampi(ix+1,0,size-1),y1=clampi(iy+1,0,size-1);
 return mixcolor(mixcolor(texture[y0*size+x0],texture[y0*size+x1],fx-ix),mixcolor(texture[y1*size+x0],texture[y1*size+x1],fx-ix),fy-iy);
}

void prepare(int width,int height,int nv,float *vertices,float *matrix,float *projected,u32 *pixels,float *depth,u32 *ids){
 for(int i=0;i<width*height;i++){pixels[i]=0;depth[i]=1.0e30f;ids[i]=0;}
 for(int i=0;i<nv;i++){
  float *v=vertices+i*6,*p=projected+i*4;
  float w=matrix[3]*v[0]+matrix[7]*v[1]+matrix[11]*v[2]+matrix[15],iw=w>0?1.0/w:0;
  p[0]=((matrix[0]*v[0]+matrix[4]*v[1]+matrix[8]*v[2]+matrix[12])*iw*.5+.5)*width;
  p[1]=(.5-(matrix[1]*v[0]+matrix[5]*v[1]+matrix[9]*v[2]+matrix[13])*iw*.5)*height;
  p[2]=(matrix[2]*v[0]+matrix[6]*v[1]+matrix[10]*v[2]+matrix[14])*iw;p[3]=iw;
 }
}
/* Orthographic scanline rasterization: visit covered spans, rather than every
   pixel in a triangle's bounding rectangle (particularly costly for rails). */
void paint(int width,int height,int first,int count,float *vertices,u32 *triangles,float *projected,
 u32 *pixels,float *depth,u32 *ids,u32 *textures,int tw,int th,int quality){
 for(int i=first;i<first+count;i++){
  u32 *t=triangles+i*6;float *a=projected+t[0]*4,*b=projected+t[1]*4,*c=projected+t[2]*4;
  if(a[3]<=0||b[3]<=0||c[3]<=0)continue;
  double ax=a[0],ay=a[1],bx=b[0],by=b[1],cx=c[0],cy=c[1];
  double den=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy);
  if(den<.0000001f&&den>-.0000001f)continue;
  double inv=1.0/den,adx=(by-cy)*inv,ady=(cx-bx)*inv,bdx=(cy-ay)*inv,bdy=(ax-cx)*inv;
  int y0=clampi((int)__builtin_ceilf(minf(a[1],minf(b[1],c[1]))-.5f),0,height-1);
  int y1=clampi(floori(maxf(a[1],maxf(b[1],c[1]))-.5f),0,height-1);
  float *va=vertices+t[0]*6,*vb=vertices+t[1]*6,*vc=vertices+t[2]*6;
  double dz=adx*((double)a[2]-c[2])+bdx*((double)b[2]-c[2]);
  double du=adx*((double)va[3]-vc[3])+bdx*((double)vb[3]-vc[3]);
  double dv=adx*((double)va[4]-vc[4])+bdx*((double)vb[4]-vc[4]);
  double ds=adx*((double)va[5]-vc[5])+bdx*((double)vb[5]-vc[5]);
  double dwx=adx*((double)va[0]-vc[0])+bdx*((double)vb[0]-vc[0]);
  double dwy=adx*((double)va[1]-vc[1])+bdx*((double)vb[1]-vc[1]);
  int texsize=t[4]?(1<<(t[4]&15)):1,offset=0;
  u32 *texture=t[4]?(u32*)(t[4]&~15u):textures;
  float duy=ady*(va[3]-vc[3])+bdy*(vb[3]-vc[3]),dvy=ady*(va[4]-vc[4])+bdy*(vb[4]-vc[4]);
  float footprint=maxf(__builtin_fabs(du)+__builtin_fabs(dv),__builtin_fabsf(duy)+__builtin_fabsf(dvy))*texsize;
  while(footprint>2&&texsize>1){offset+=texsize*texsize;texsize>>=1;footprint*=.5f;}
  texture+=offset;float mipblend=quality?maxf(0,minf(1,footprint-1)):0;
  for(int y=y0;y<=y1;y++){
   float py=y+.5f,left=1.e30f,right=-1.e30f;
   float *ends[3]={a,b,c};
   for(int edge=0;edge<3;edge++){
    float *p=ends[edge],*q=ends[(edge+1)%3];
    if(p[1]==q[1]||py<minf(p[1],q[1])||py>maxf(p[1],q[1]))continue;
    float x=p[0]+(py-p[1])*(q[0]-p[0])/(q[1]-p[1]);
    left=minf(left,x);right=maxf(right,x);
   }
   if(left>right||right<.5f||left>width-.5f)continue;
   int x0=clampi((int)__builtin_ceilf(left-.50001f),0,width-1),x1=clampi(floori(right-.49999f),0,width-1);
   double aa=((by-cy)*(x0+.5-cx)+(cx-bx)*(py-cy))*inv;
   double bb=((cy-ay)*(x0+.5-cx)+(ax-cx)*(py-cy))*inv;
   double cc=1-aa-bb;
   double z=aa*a[2]+bb*b[2]+cc*c[2];
   double u=aa*va[3]+bb*vb[3]+cc*vc[3],v=aa*va[4]+bb*vb[4]+cc*vc[4];
   double shade=aa*va[5]+bb*vb[5]+cc*vc[5];
   double wx=aa*va[0]+bb*vb[0]+cc*vc[0],wy=aa*va[1]+bb*vb[1]+cc*vc[1];
   for(int x=x0,p=y*width+x0;x<=x1;x++,p++,z+=dz,u+=du,v+=dv,shade+=ds,wx+=dwx,wy+=dwy){
    if(z>=depth[p])continue;
    u32 color=t[3];
    if(t[4]){
     color=sample(texture,texsize,u,v);
     if(mipblend>.01f&&texsize>1)color=mixcolor(color,sample(texture+texsize*texsize,texsize>>1,u,v),mipblend);
    }else{
     u32 out=0xff000000;
     for(int ch=0;ch<3;ch++)out|=((u32)clampi((int)(((color>>(ch*8))&255)*shade),0,255))<<(ch*8);
     color=out;
    }
    pixels[p]=color|0xff000000;depth[p]=z;
    u32 id=t[5];
    if(id<100){
     if(wx>=-6.85f&&wx<=6.85f&&wy>=.48f&&wy<=10.25f){int floor=clampi((int)((wy-.48f)/2.45f),0,3),col=clampi((int)((wx+6.9f)/4.6f),0,2);id=1+(3-floor)*3+col;}else id=0;
    }ids[p]=id;
   }
  }
 }
}
void draw(int width,int height,int nv,int nt,float *vertices,u32 *triangles,float *matrix,float *projected,
 u32 *pixels,float *depth,u32 *ids,u32 *textures,int tw,int th,int quality,int selected){
 prepare(width,height,nv,vertices,matrix,projected,pixels,depth,ids);
 paint(width,height,0,nt,vertices,triangles,projected,pixels,depth,ids,textures,tw,th,quality);
}
